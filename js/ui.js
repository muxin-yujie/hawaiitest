// ========== UI 渲染模块 ==========
// 负责所有消息显示和 UI 交互

/**
 * 消息工厂函数 - 统一创建消息元素
 * @param {string} type - 消息类型 ('player', 'npc', 'inner-monologue', 'system')
 * @param {string} sender - 发送者（可选）
 * @param {string|string[]} content - 内容（可以是字符串或数组）
 * @param {object} options - 额外选项
 * @param {string} options.senderColor - 发送者文字颜色
 * @param {string} options.contentColor - 内容文字颜色
 * @param {string} options.backgroundColor - 背景颜色
 * @param {string} options.borderColor - 边框颜色
 * @returns {HTMLDivElement} 创建的消息元素
 */
function createMessage(type, sender = null, content, options = {}) {
    const chatContainer = document.getElementById('chatContainer');
    
    const message = document.createElement('div');
    message.className = `message ${type}-message`;
    
    // 如果有 sender，添加 sender 头
    let html = '';
    if (sender) {
        const senderStyle = options.senderColor ? `style="color: ${options.senderColor};"` : '';
        html += `<div class="message-sender" ${senderStyle}>${sender}</div>`;
    }
    
    // 处理内容（支持字符串或数组）
    if (Array.isArray(content)) {
        content.forEach(item => {
            if (typeof item === 'string') {
                const contentStyle = options.contentColor ? `style="color: ${options.contentColor};"` : '';
                html += `<div ${contentStyle}>${item}</div>`;
            } else if (item.html) {
                html += item.html;
            } else if (item.text) {
                const contentStyle = options.contentColor ? `style="color: ${options.contentColor};"` : '';
                html += `<div ${contentStyle}>${item.text}</div>`;
            }
        });
    } else {
        const contentStyle = options.contentColor ? `style="color: ${options.contentColor};"` : '';
        html += `<div ${contentStyle}>${content}</div>`;
    }
    
    // 添加额外 class
    if (options.extraClass) {
        message.classList.add(options.extraClass);
    }
    
    // 添加 ID（如果需要）
    if (options.id) {
        message.id = options.id;
    }
    
    // 自定义背景色
    if (options.backgroundColor) {
        message.style.background = options.backgroundColor;
    }
    
    // 自定义边框颜色
    if (options.borderColor) {
        message.style.borderColor = options.borderColor;
    }
    
    message.innerHTML = html;
    chatContainer.appendChild(message);
    scrollToBottom();
    
    return message;
}

/**
 * 滚动聊天容器到底部
 */
function scrollToBottom() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * 清空聊天容器
 */
function clearChat() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
}

/**
 * 显示场景旁白
 * @param {string} type - 旁白类型（如"到达 威基基海滩"、"Day 1 结束"）
 * @param {string} content - 旁白内容
 */
function showSceneNarration(type, content) {
    const chatContainer = document.getElementById('chatContainer');
    
    // 根据类型自动匹配 emoji
    const emojiMap = {
        '到达': '📍',
        'Day': type.includes('结束') ? '🌅' : '🌞',
        '晚宴': '🌺',
        '环境': '🌴'
    };
    
    let emoji = '📝'; // 默认
    for (const [key, value] of Object.entries(emojiMap)) {
        if (type.includes(key)) {
            emoji = value;
            break;
        }
    }
    
    const narrationElement = document.createElement('div');
    narrationElement.className = 'message inner-monologue';
    narrationElement.innerHTML = `
        <div class="message-sender" style="font-size: 0.8em; color: #999;">
            ${emoji} ${type}
        </div>
        <div style="font-style: italic; font-size: 0.9em; color: #666;">
            ${content.replace(/\n/g, '<br>')}
        </div>
    `;
    chatContainer.appendChild(narrationElement);
    scrollToBottom();
}

/**
 * 紫色场景切换函数
 * @param {string} emoji - 场景 emoji
 * @param {string} title - 场景标题
 * @param {string} description - 场景描写
 * @param {Object} options - 可选配置（如渐变背景）
 */
function 紫色场景切换 (emoji, title, description, options = {}) {
    const chatContainer = getChatContainer();
    
    const sceneMessage = document.createElement('div');
    sceneMessage.className = 'system-message';
    
    // 支持特殊样式（如回酒店的渐变背景）
    if (options.gradient) {
        sceneMessage.style.background = options.gradient;
        sceneMessage.style.color = 'white';
    }
    
    sceneMessage.innerHTML = `
        <span style="font-weight: bold; color: ${options.color || '#6a1b9a'}; font-size: 0.95em; line-height: 1.6;">
            ${emoji} ${title} ${emoji}<br><br>
            ${description}
        </span>
    `;
    chatContainer.appendChild(sceneMessage);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 暴露到全局
window.紫色场景切换 = 紫色场景切换;

/**
 * 更新场景名称显示
 * @param {string} emoji - 场景 emoji
 * @param {string} name - 场景名称
 * @param {string} decoration - 装饰 emoji（可选，默认🌸）
 */
function 更新场景名 (emoji, name, decoration = '🌸') {
    const sceneNameEl = document.querySelector('.scene-name');
    if (sceneNameEl) {
        sceneNameEl.innerHTML = `
            <span>${emoji}</span>
            <span>${name}</span>
            <span>${decoration}</span>
        `;
    }
}

// 暴露到全局
window.更新场景名 = 更新场景名;

/**
 * 添加二级地点到探索面板（UI 显示）
 * @param {string} primaryName - 一级地点名称
 * @param {string} secondaryName - 二级地点名称
 * @param {string} emoji - 地点表情符号
 * @param {string} description - 地点描述
 */
function 添加二级地点 (primaryName, secondaryName, emoji, description) {
    addSecondaryLocation(primaryName, secondaryName, emoji, description);
}

// 暴露到全局
window.添加二级地点 = 添加二级地点;

/**
 * 设置游戏状态（辅助函数，只更新指定的属性，不会覆盖其他状态）
 * @param {Object} updates - 要更新的属性对象
 * 
 * 使用示例：
 * 设置状态({
 *     currentPrimaryLocation: "airport",
 *     currentSecondaryLocation: "海关",
 *     currentNpc: "海关官员",
 *     storyPhase: "customs"
 * });
 */
function 设置状态 (updates) {
    // 使用 Object.assign 只更新指定的属性，不会覆盖其他属性
    Object.assign(gameState, updates);
    
    // 如果设置了新的 storyPhase，自动重置对话计数器
    if (updates.storyPhase) {
        gameState.conversationCount = 0;
        gameState.conversationHistory = [];
    }
    
    // 如果设置了新的 NPC，自动重置对话历史
    if (updates.currentNpc && !updates.conversationHistory) {
        gameState.conversationHistory = [];
    }
    
    console.log("✅ 游戏状态已更新:", updates);
}

// 暴露到全局
window.设置状态 = 设置状态;

/**
 * 显示内心独白（仅 UI 渲染，AI 逻辑已移至 aigenerate/innermo.js）
 * @deprecated 请使用 window.generateInnerMonologue()
 */

/**
 * 显示玩家消息
 * @param {string} text - 消息内容
 */
function displayPlayerMessage(text) {
    return createMessage('player', '你', text);
}

/**
 * 显示 NPC 消息
 * @param {string} npcName - NPC 名称
 * @param {string} text - 英文原文
 * @param {string} translation - 中文翻译
 */
function displayNPCMessage(npcName, text, translation) {
    // 清理中文动作词（防御性处理）
    const cleanedText = window.cleanNpcDialogue ? window.cleanNpcDialogue(text) : text;
    const cleanedTranslation = window.cleanNpcDialogue ? window.cleanNpcDialogue(translation) : translation;
    
    return createMessage('npc', `${getNpcEmoji(npcName)} ${npcName}`, [
        cleanedText,
        { html: `<div class="translation">${cleanedTranslation}</div>` }
    ]);
}

/**
 * 显示加载提示
 * @param {string} npcName - NPC 名称
 */
function displayLoadingMessage(npcName) {
    const chatContainer = document.getElementById('chatContainer');
    
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'message npc-message';
    loadingMessage.id = 'loadingMessage';
    
    // 显示正在输入中
    loadingMessage.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    chatContainer.appendChild(loadingMessage);
    scrollToBottom();
    
    return loadingMessage;
}

/**
 * 移除加载提示
 */
function removeLoadingMessage() {
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

/*

/**
 * 显示选项让玩家选择
 * @param {Array} options - 选项数组，每个选项包含：
 *   - text: string - 选项文本（可包含 emoji）
 *   - gradient: string - 渐变背景色（可选，默认紫色渐变）
 *   - boxShadow: string - 阴影颜色（可选）
 *   - onClick: function - 点击回调函数
 * @returns {HTMLElement} 选项容器元素
 */
function showOptions(options) {
    const chatContainer = document.getElementById('chatContainer');
    
    // 创建选项容器
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    optionsContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 20px 0;
        padding: 15px;
        background: rgba(255,255,255,0.5);
        border-radius: 15px;
        border: 2px solid #bde0fe;
    `;
    
    // 创建每个选项按钮
    options.forEach(option => {
        const optionButton = document.createElement('div');
        optionButton.className = 'option-button';
        
        // 使用传入的渐变色或默认紫色渐变
        const gradient = option.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        
        // 计算阴影颜色（从渐变色或单独指定）
        let boxShadow = option.boxShadow;
        if (!boxShadow) {
            // 根据渐变色类型设置默认阴影
            if (gradient.includes('#667eea')) {
                boxShadow = '0 3px 8px rgba(102, 126, 234, 0.3)';
            } else if (gradient.includes('#f093fb')) {
                boxShadow = '0 3px 8px rgba(240, 147, 251, 0.3)';
            } else {
                boxShadow = '0 3px 8px rgba(0,0,0,0.2)';
            }
        }
        
        // 计算悬停阴影
        let hoverBoxShadow = option.hoverBoxShadow;
        if (!hoverBoxShadow) {
            if (gradient.includes('#667eea')) {
                hoverBoxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
            } else if (gradient.includes('#f093fb')) {
                hoverBoxShadow = '0 5px 15px rgba(240, 147, 251, 0.4)';
            } else {
                hoverBoxShadow = '0 5px 15px rgba(0,0,0,0.3)';
            }
        }
        
        optionButton.style.cssText = `
            padding: 12px 20px;
            background: ${gradient};
            color: white;
            border-radius: 10px;
            cursor: pointer;
            text-align: center;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: ${boxShadow};
        `;
        optionButton.innerHTML = option.text;
        
        // 悬停效果
        optionButton.onmouseover = () => {
            optionButton.style.transform = 'translateY(-2px)';
            optionButton.style.boxShadow = hoverBoxShadow;
        };
        
        optionButton.onmouseout = () => {
            optionButton.style.transform = 'translateY(0)';
            optionButton.style.boxShadow = boxShadow;
        };
        
        // 点击处理
        optionButton.onclick = async () => {
            optionsContainer.style.display = 'none';
            if (option.onClick) {
                await option.onClick();
            }
        };
        
        optionsContainer.appendChild(optionButton);
    });
    
    chatContainer.appendChild(optionsContainer);
    scrollToBottom();
    
    console.log("选项已显示，等待玩家选择...");
    
    return optionsContainer;
}

/**
 * 隐藏选项容器
 * @param {HTMLElement} optionsContainer - 选项容器元素
 */
function hideOptions(optionsContainer) {
    if (optionsContainer) {
        optionsContainer.style.display = 'none';
    }
}

/**
 * 显示撒花特效
 */
function showConfetti() {
    const colors = ['#ffc8dd', '#bde0fe', '#ffafcc', '#a8e6cf', '#dcedc1', '#ffd700'];
    const emojis = ['🌺', '', '✨', '', '🌸', '💫'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            const size = Math.random() * 10 + 8;
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
            
            const duration = Math.random() * 2 + 2;
            confetti.style.animationDuration = duration + 's';
            
            if (Math.random() < 0.3) {
                confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                confetti.style.backgroundColor = 'transparent';
                confetti.style.fontSize = size + 'px';
                confetti.style.textAlign = 'center';
                confetti.style.lineHeight = size + 'px';
            }
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, duration * 1000);
        }, i * 50);
    }
}

/**
 * 按钮波纹效果
 */
function initRippleEffect() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (getComputedStyle(this).position !== 'relative') {
                return;
            }
            
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (x - size / 2) + 'px';
            ripple.style.top = (y - size / 2) + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}





/**
 * 显示 Toast 提示消息
 * @param {string} message - 消息内容
 * @param {string} icon - 图标 emoji
 */
function showToast(message, icon = 'ℹ️') {
    // 移除已存在的 toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <span class="toast-notification-icon">${icon}</span>
        <div class="toast-notification-content">
            <div class="toast-notification-message">${message}</div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // 3 秒后自动消失
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 1500);
    }, 3000);
}

// 暴露到全局作用域
window.showConfetti = showConfetti;
window.showOptions = showOptions;
window.hideOptions = hideOptions;
window.initRippleEffect = initRippleEffect;
window.showToast = showToast;

/**
 * 简化版选项函数 - 快速创建两个选项
 * @param {string} option1Text - 选项 1 文本
 * @param {Function} option1Click - 选项 1 点击回调
 * @param {string} option2Text - 选项 2 文本
 * @param {Function} option2Click - 选项 2 点击回调
 * @param {Object} options - 可选配置
 * @param {string} options.gradient1 - 选项 1 渐变色
 * @param {string} options.gradient2 - 选项 2 渐变色
 * 
 * 使用示例：
 * 选择 ('🏨 去酒店', goToHotel, '🏖️ 去海滩', goToBeach);
 */
function 选择 (option1Text, option1Click, option2Text, option2Click, options = {}) {
    showOptions([
        {
            text: option1Text,
            gradient: options.gradient1 || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            onClick: option1Click
        },
        {
            text: option2Text,
            gradient: options.gradient2 || 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            onClick: option2Click
        }
    ]);
}

// 暴露到全局
window.选择 = 选择;

/**
 * 恢复输入框（启用输入框和发送按钮）
 */
function 恢复输入框 () {
    const userInputEl = document.getElementById('userInput');
    const sendButton = document.querySelector('.send-btn');
    if (userInputEl) {
        userInputEl.disabled = false;
        userInputEl.placeholder = "输入消息...";
    }
    if (sendButton) {
        sendButton.disabled = false;
        sendButton.style.opacity = "1";
        sendButton.style.cursor = "pointer";
    }
}

window.恢复输入框 = 恢复输入框;

/**
 * 显示照片弹窗
 * @param {string} photoSrc - 图片路径
 * @param {string} photoName - 照片名称（英文）
 * @param {string} photoNameChinese - 照片名称（中文）
 * @param {string} emoji - 照片 emoji
 * @param {string} description - 照片描述
 * @param {Function} onClose - 关闭回调（可选）
 * 
 * 使用示例：
 * 显示照片 ('pictures/机场.png', 'Honolulu Airport', '檀香山机场', '✈️', '抵达夏威夷的第一张照片');
 */
function 显示照片 (photoSrc, photoName, photoNameChinese, emoji, description, onClose) {
    // 1. 保存照片到收集系统
    const newPhoto = {
        src: photoSrc,
        name: photoName,
        nameChinese: photoNameChinese,
        emoji: emoji,
        location: '海关',
        description: description
    };
    
    if (!gameState.photos) {
        gameState.photos = [];
    }
    
    if (!gameState.photos.some(p => p.src === newPhoto.src)) {
        gameState.photos.push(newPhoto);
        console.log('📸 照片已保存:', newPhoto.name);
    }
    
    // 2. 创建照片弹窗
    const overlay = document.createElement('div');
    overlay.className = 'photo-modal-overlay';
    overlay.onclick = () => {
        overlay.remove();
        if (onClose) onClose();
    };
    
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.innerHTML = `
        <button class="photo-close-btn" onclick="this.closest('.photo-modal-overlay').remove(); setTimeout(() => {
            if (onClose) onClose();
        }, 100);">×</button>
        <div class="photo-modal-header">
            <h3>📸 Photo!</h3>
        </div>
        <div class="photo-modal-image">
            <img src="${photoSrc}" alt="${photoName}">
        </div>
        <div class="photo-modal-caption">
            <span>${emoji}</span>
            <span>${photoName}</span>
            <span>${emoji}</span>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

/**
 * 照相效果（闪光灯 + 咔嚓声 + 显示照片）
 * @param {string} photoSrc - 图片路径
 * @param {string} photoName - 照片名称（英文）
 * @param {string} photoNameChinese - 照片名称（中文）
 * @param {string} emoji - 照片 emoji
 * @param {string} description - 照片描述
 * @param {Function} onClose - 关闭照片后的回调（可选）
 * 
 * 使用示例：
 * 照相 ('pictures/机场.png', 'Honolulu Airport', '檀香山机场', '✈️', '抵达夏威夷的第一张照片', () => {
 *     triggerAirportRandomEvent();
 * });
 */
function 照相 (photoSrc, photoName, photoNameChinese, emoji, description, onClose) {
    // 1. 显示闪光灯效果
    const flash = document.createElement('div');
    flash.className = 'camera-flash';
    document.body.appendChild(flash);
    
    // 2. 显示"咔嚓"文字
    const shutterText = document.createElement('div');
    shutterText.className = 'camera-shutter-text';
    shutterText.textContent = '📸 咔嚓！';
    document.body.appendChild(shutterText);
    
    // 3. 1 秒后显示照片弹窗
    setTimeout(() => {
        // 移除闪光灯和文字
        if (flash.parentNode) flash.parentNode.removeChild(flash);
        if (shutterText.parentNode) shutterText.parentNode.removeChild(shutterText);
        
        // 显示照片弹窗
        显示照片 (photoSrc, photoName, photoNameChinese, emoji, description, onClose);
    }, 1000);
}

// 暴露到全局
window.显示照片 = 显示照片;
window.照相 = 照相;

console.log("UI 渲染模块已加载 ✓");

// 页面加载完成后自动初始化波纹效果
document.addEventListener('DOMContentLoaded', function() {
    initRippleEffect();
    console.log("波纹效果已初始化 ✓");
});
