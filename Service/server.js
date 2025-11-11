const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 数据存储文件路径
const DATA_FILE = path.join(__dirname, 'data', 'keys.json');

// 确保数据目录存在
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// 读取API keys数据
async function readKeys() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // 如果文件不存在，返回空数组
    return [];
  }
}

// 保存API keys数据
async function saveKeys(keys) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(keys, null, 2));
}

// 验证单个API key
async function validateApiKey(apiKey) {
  try {
    const response = await axios.get('https://api.resend.com/domains', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      timeout: 10000
    });

    return {
      success: true,
      status: 'valid',
      data: response.data
    };
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 400) {
        return {
          success: false,
          status: 'invalid',
          error: 'API key is invalid'
        };
      } else if (status === 403) {
        return {
          success: false,
          status: 'suspended',
          error: 'This API key is suspended'
        };
      } else if (status === 401) {
        return {
          success: false,
          status: 'restricted',
          error: 'This API key is restricted to only send emails'
        };
      } else {
        return {
          success: false,
          status: 'error',
          error: `HTTP ${status}: ${data.message || 'Unknown error'}`
        };
      }
    } else {
      return {
        success: false,
        status: 'network_error',
        error: error.message || 'Network error'
      };
    }
  }
}

// API路由

// 获取所有API keys
app.get('/api/keys', async (req, res) => {
  try {
    const keys = await readKeys();
    res.json(keys);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read keys' });
  }
});

// 添加单个API key
app.post('/api/keys', async (req, res) => {
  try {
    const { domain, apiKey } = req.body;
    
    if (!domain || !apiKey) {
      return res.status(400).json({ error: 'Domain and API key are required' });
    }

    const keys = await readKeys();
    
    // 检查是否已存在相同的domain或apiKey
    const existingKey = keys.find(key => key.domain === domain || key.apiKey === apiKey);
    if (existingKey) {
      return res.status(400).json({ error: 'Domain or API key already exists' });
    }

    const newKey = {
      id: Date.now().toString(),
      domain,
      apiKey,
      addedAt: new Date().toISOString()
    };

    keys.push(newKey);
    await saveKeys(keys);

    res.json(newKey);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add key' });
  }
});

// 删除API key
app.delete('/api/keys/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const keys = await readKeys();
    
    const filteredKeys = keys.filter(key => key.id !== id);
    
    if (filteredKeys.length === keys.length) {
      return res.status(404).json({ error: 'Key not found' });
    }

    await saveKeys(filteredKeys);
    res.json({ message: 'Key deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete key' });
  }
});

// 批量验证所有API keys
app.post('/api/validate', async (req, res) => {
  try {
    const keys = await readKeys();
    
    if (keys.length === 0) {
      return res.json({ results: [], message: 'No keys to validate' });
    }

    const results = [];
    
    // 并行验证所有keys
    const validationPromises = keys.map(async (key) => {
      const validation = await validateApiKey(key.apiKey);
      return {
        id: key.id,
        domain: key.domain,
        apiKey: key.apiKey,
        ...validation,
        validatedAt: new Date().toISOString()
      };
    });

    const validationResults = await Promise.all(validationPromises);
    
    res.json({
      results: validationResults,
      total: validationResults.length,
      valid: validationResults.filter(r => r.success).length,
      invalid: validationResults.filter(r => !r.success).length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate keys' });
  }
});

// 批量导入keys
app.post('/api/import', async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || typeof data !== 'string') {
      return res.status(400).json({ error: 'Import data is required' });
    }

    const lines = data.split('\n').filter(line => line.trim());
    const importedKeys = [];
    const errors = [];

    // 解析格式：domain1, key1, 空行, domain2, key2, ...
    for (let i = 0; i < lines.length; i += 2) {
      const domain = lines[i]?.trim();
      const apiKey = lines[i + 1]?.trim();

      if (!domain || !apiKey) {
        if (domain) {
          errors.push(`Missing API key for domain: ${domain}`);
        }
        continue;
      }

      importedKeys.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        domain,
        apiKey,
        addedAt: new Date().toISOString()
      });
    }

    if (importedKeys.length === 0) {
      return res.status(400).json({ error: 'No valid keys found in import data', errors });
    }

    const existingKeys = await readKeys();
    const newKeys = [...existingKeys, ...importedKeys];
    await saveKeys(newKeys);

    res.json({
      imported: importedKeys.length,
      errors: errors.length > 0 ? errors : undefined,
      keys: importedKeys
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import keys' });
  }
});

// 导出keys
app.get('/api/export', async (req, res) => {
  try {
    const keys = await readKeys();
    
    if (keys.length === 0) {
      return res.status(404).json({ error: 'No keys to export' });
    }

    // 格式：domain1\nkey1\n\ndomain2\nkey2\n...
    let exportData = '';
    keys.forEach((key, index) => {
      exportData += key.domain + '\n' + key.apiKey;
      if (index < keys.length - 1) {
        exportData += '\n\n';
      }
    });

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="resend-keys.txt"');
    res.send(exportData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export keys' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Resend Key Validator server running on port ${PORT}`);
});