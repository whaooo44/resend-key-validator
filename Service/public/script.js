// 全局变量
let keys = [];

// DOM元素
const elements = {
    addKeyForm: document.getElementById('addKeyForm'),
    keysList: document.getElementById('keysList'),
    batchImportBtn: document.getElementById('batchImportBtn'),
    batchExportBtn: document.getElementById('batchExportBtn'),
    batchValidateBtn: document.getElementById('batchValidateBtn'),
    importModal: document.getElementById('importModal'),
    validationResults: document.getElementById('validationResults'),
    resultsSummary: document.getElementById('resultsSummary'),
    resultsList: document.getElementById('resultsList'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    message: document.getElementById('message'),
    importData: document.getElementById('importData'),
    confirmImport: document.getElementById('confirmImport'),
    cancelImport: document.getElementById('cancelImport'),
    closeModal: document.querySelector('.close')
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadKeys();
    setupEventListeners();
});

// 设置事件监听器
function setupEventListeners() {
    elements.addKeyForm.addEventListener('submit', handleAddKey);
    elements.batchImportBtn.addEventListener('click', showImportModal);
    elements.batchExportBtn.addEventListener('click', handleBatchExport);
    elements.batchValidateBtn.addEventListener('click', handleBatchValidate);
    elements.confirmImport.addEventListener('click', handleBatchImport);
    elements.cancelImport.addEventListener('click', hideImportModal);
    elements.closeModal.addEventListener('click', hideImportModal);
    
    // 点击模态框外部关闭
    elements.importModal.addEventListener('click', (e) => {
        if (e.target === elements.importModal) {
            hideImportModal();
        }
    });
}

// 显示加载状态
function showLoading(message = '正在处理中...') {
    elements.loadingOverlay.querySelector('p').textContent = message;
    elements.loadingOverlay.style.display = 'flex';
}

// 隐藏加载状态
function hideLoading() {
    elements.loadingOverlay.style.display = 'none';
}

// 显示消息
function showMessage(text, type = 'info') {
    elements.message.textContent = text;
    elements.message.className = `message ${type}`;
    elements.message.style.display = 'block';
    
    setTimeout(() => {
        elements.message.style.display = 'none';
    }, 3000);
}

// 加载所有keys
async function loadKeys() {
    try {
        const response = await fetch('/api/keys');
        keys = await response.json();
        renderKeysList();
    } catch (error) {
        showMessage('加载API Keys失败', 'error');
        console.error('Failed to load keys:', error);
    }
}

// 渲染keys列表
function renderKeysList() {
    if (keys.length === 0) {
        elements.keysList.innerHTML = '<p class="empty-message">暂无 API Keys，请添加或导入</p>';
        return;
    }

    elements.keysList.innerHTML = keys.map(key => `
        <div class="key-item">
            <div class="key-info">
                <div class="key-domain">${escapeHtml(key.domain)}</div>
                <div class="key-api">${escapeHtml(key.apiKey)}</div>
                <div class="key-date">添加时间: ${new Date(key.addedAt).toLocaleString('zh-CN')}</div>
            </div>
            <button class="delete-btn" onclick="deleteKey('${key.id}')">删除</button>
        </div>
    `).join('');
}

// HTML转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 添加单个key
async function handleAddKey(e) {
    e.preventDefault();
    
    const formData = new FormData(elements.addKeyForm);
    const domain = formData.get('domain').trim();
    const apiKey = formData.get('apiKey').trim();
    
    if (!domain || !apiKey) {
        showMessage('请填写域名和API Key', 'error');
        return;
    }

    showLoading('正在添加API Key...');
    
    try {
        const response = await fetch('/api/keys', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ domain, apiKey })
        });

        const data = await response.json();
        
        if (response.ok) {
            showMessage('API Key添加成功', 'success');
            elements.addKeyForm.reset();
            await loadKeys();
        } else {
            showMessage(data.error || '添加失败', 'error');
        }
    } catch (error) {
        showMessage('网络错误，请重试', 'error');
        console.error('Failed to add key:', error);
    } finally {
        hideLoading();
    }
}

// 删除key
async function deleteKey(id) {
    if (!confirm('确定要删除这个API Key吗？')) {
        return;
    }

    showLoading('正在删除API Key...');
    
    try {
        const response = await fetch(`/api/keys/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        
        if (response.ok) {
            showMessage('API Key删除成功', 'success');
            await loadKeys();
        } else {
            showMessage(data.error || '删除失败', 'error');
        }
    } catch (error) {
        showMessage('网络错误，请重试', 'error');
        console.error('Failed to delete key:', error);
    } finally {
        hideLoading();
    }
}

// 显示导入模态框
function showImportModal() {
    elements.importModal.style.display = 'block';
    elements.importData.value = '';
}

// 隐藏导入模态框
function hideImportModal() {
    elements.importModal.style.display = 'none';
}

// 批量导入
async function handleBatchImport() {
    const data = elements.importData.value.trim();
    
    if (!data) {
        showMessage('请输入导入数据', 'error');
        return;
    }

    showLoading('正在批量导入API Keys...');
    
    try {
        const response = await fetch('/api/import', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });

        const result = await response.json();
        
        if (response.ok) {
            showMessage(`成功导入 ${result.imported} 个API Keys`, 'success');
            hideImportModal();
            await loadKeys();
            
            if (result.errors && result.errors.length > 0) {
                showMessage(`导入完成，但有 ${result.errors.length} 个错误`, 'info');
                console.warn('Import errors:', result.errors);
            }
        } else {
            showMessage(result.error || '导入失败', 'error');
        }
    } catch (error) {
        showMessage('网络错误，请重试', 'error');
        console.error('Failed to import keys:', error);
    } finally {
        hideLoading();
    }
}

// 批量导出
async function handleBatchExport() {
    if (keys.length === 0) {
        showMessage('没有可导出的API Keys', 'error');
        return;
    }

    showLoading('正在导出API Keys...');
    
    try {
        const response = await fetch('/api/export');
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'resend-keys.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            showMessage('API Keys导出成功', 'success');
        } else {
            const data = await response.json();
            showMessage(data.error || '导出失败', 'error');
        }
    } catch (error) {
        showMessage('网络错误，请重试', 'error');
        console.error('Failed to export keys:', error);
    } finally {
        hideLoading();
    }
}

// 批量校验
async function handleBatchValidate() {
    if (keys.length === 0) {
        showMessage('没有可校验的API Keys', 'error');
        return;
    }

    showLoading('正在批量校验API Keys...');
    
    try {
        const response = await fetch('/api/validate', {
            method: 'POST'
        });

        const result = await response.json();
        
        if (response.ok) {
            renderValidationResults(result);
            showMessage(`校验完成：${result.valid} 个有效，${result.invalid} 个无效`, 'info');
        } else {
            showMessage(result.error || '校验失败', 'error');
        }
    } catch (error) {
        showMessage('网络错误，请重试', 'error');
        console.error('Failed to validate keys:', error);
    } finally {
        hideLoading();
    }
}

// 渲染校验结果
function renderValidationResults(result) {
    // 显示结果区域
    elements.validationResults.style.display = 'block';
    
    // 渲染汇总信息
    elements.resultsSummary.innerHTML = `
        <div class="summary-item total">
            <div>总计</div>
            <div>${result.total}</div>
        </div>
        <div class="summary-item valid">
            <div>有效</div>
            <div>${result.valid}</div>
        </div>
        <div class="summary-item invalid">
            <div>无效</div>
            <div>${result.invalid}</div>
        </div>
    `;
    
    // 渲染详细结果
    elements.resultsList.innerHTML = result.results.map(item => {
        const statusClass = item.success ? 'valid' : item.status;
        const statusText = getStatusText(item);
        
        let domainsHtml = '';
        if (item.success && item.data && item.data.data) {
            domainsHtml = `
                <div class="result-domains">
                    <strong>关联域名:</strong>
                    ${item.data.data.map(domain => `
                        <div class="domain-item">
                            <div>${escapeHtml(domain.name)}</div>
                            <small>状态: ${domain.status} | 区域: ${domain.region}</small>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        return `
            <div class="result-item ${statusClass}">
                <div class="result-domain">${escapeHtml(item.domain)}</div>
                <div class="result-status ${statusClass}">${statusText}</div>
                ${item.error ? `<div class="result-error">${escapeHtml(item.error)}</div>` : ''}
                ${domainsHtml}
                <div class="key-api">${escapeHtml(item.apiKey)}</div>
                <div class="key-date">校验时间: ${new Date(item.validatedAt).toLocaleString('zh-CN')}</div>
            </div>
        `;
    }).join('');
    
    // 滚动到结果区域
    elements.validationResults.scrollIntoView({ behavior: 'smooth' });
}

// 获取状态文本
function getStatusText(item) {
    if (item.success) {
        return '✓ 有效';
    }
    
    switch (item.status) {
        case 'invalid':
            return '✗ API Key无效';
        case 'suspended':
            return '✗ API Key已吊销';
        case 'restricted':
            return '✗ API Key权限不足';
        case 'network_error':
            return '⚠ 网络错误';
        default:
            return '✗ 校验失败';
    }
}