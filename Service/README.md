# Resend API Key 批量校验工具

一个用于批量管理和验证 Resend API Keys 的 Web 服务。

## 功能特性

- ✅ 单个添加/删除 API Key 和对应域名
- ✅ 批量导入 API Keys（支持文本格式）
- ✅ 批量导出 API Keys
- ✅ 批量校验 API Keys 状态
- ✅ 显示详细的校验结果和域名信息
- ✅ 响应式设计，支持移动端

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

### 3. 访问应用

打开浏览器访问：`http://localhost:3000`

## API 接口

### 获取所有 API Keys
```
GET /api/keys
```

### 添加单个 API Key
```
POST /api/keys
Content-Type: application/json

{
  "domain": "example.com",
  "apiKey": "re_xxxxxxxxx"
}
```

### 删除 API Key
```
DELETE /api/keys/:id
```

### 批量校验 API Keys
```
POST /api/validate
```

### 批量导入 API Keys
```
POST /api/import
Content-Type: application/json

{
  "data": "domain1\nkey1\n\ndomain2\nkey2"
}
```

### 批量导出 API Keys
```
GET /api/export
```

## 批量导入格式

批量导入时，请按以下格式输入：

```
domain1
key1

domain2
key2

domain3
key3
```

每对域名和API key之间用空行分隔。

## API Key 状态说明

### 有效状态
- **valid**: API Key 有效，可以正常使用
- 返回关联的域名列表，包含域名状态、创建时间、区域等信息

### 无效状态
- **invalid**: API Key 无效（400错误）
- **suspended**: API Key 已被吊销（403错误）
- **restricted**: API Key 权限不足，只能发送邮件（401错误）
- **network_error**: 网络连接错误
- **error**: 其他未知错误

## 数据存储

- API Keys 数据存储在 `data/keys.json` 文件中
- 首次运行时会自动创建数据目录和文件

## 技术栈

- **后端**: Node.js + Express.js
- **前端**: HTML + CSS + JavaScript (原生)
- **HTTP客户端**: axios
- **数据存储**: JSON 文件

## 项目结构

```
resend-key-validator/
├── package.json          # 项目配置和依赖
├── server.js             # Express 服务器
├── data/                 # 数据存储目录
│   └── keys.json         # API Keys 数据文件
├── public/               # 前端静态文件
│   ├── index.html        # 主页面
│   ├── style.css         # 样式文件
│   └── script.js         # 前端逻辑
└── README.md             # 项目说明
```

## 注意事项

1. 请妥善保管 API Keys，避免泄露
2. 建议定期备份 `data/keys.json` 文件
3. 批量校验时会并行请求 Resend API，请注意 API 限制
4. 网络连接问题可能导致校验失败，请重试

## 许可证

MIT License