// 三步交互流程管理

// 全局变量
let currentStep = 1;

// 生成自然彩色粒子尾迹
function createNaturalTrail(x, y) {
    const colors = [
        'rgba(255, 20, 100, 1)',    // 超鲜粉红
        'rgba(255, 100, 0, 1)',     // 超鲜橙
        'rgba(255, 230, 0, 1)',     // 超鲜黄
        'rgba(0, 255, 100, 1)',     // 超鲜绿
        'rgba(0, 180, 255, 1)',     // 超鲜蓝
        'rgba(180, 0, 255, 1)',     // 超鲜紫
        'rgba(255, 0, 150, 1)',     // 超鲜玫红
        'rgba(100, 255, 0, 1)'      // 超鲜青绿
    ];
    
    const trail = document.createElement('div');
    trail.className = 'natural-trail';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    trail.style.position = 'fixed';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '999';
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    trail.style.background = `radial-gradient(circle, ${color} 0%, transparent 30%)`;
    trail.style.boxShadow = `0 0 15px ${color}, 0 0 30px ${color}, 0 0 45px ${color}`;
    trail.style.filter = 'brightness(1.5) saturate(1.5)';
    
    const size = 3 + Math.random() * 4;
    trail.style.width = size + 'px';
    trail.style.height = size + 'px';
    trail.style.borderRadius = '50%';
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.classList.add('animate');
    }, 10);
    
    setTimeout(() => {
        trail.remove();
    }, 800);
}

// 第一步 → 1.5 过渡页
function goToStep1_5() {
    // 隐藏第一步
    const step1Page = document.getElementById('step1Page');
    step1Page.style.display = 'none';
    
    // 显示过渡页
    const step1_5Page = document.getElementById('step1_5Page');
    step1_5Page.style.display = 'block';
    
    // 生成星空
    createStars('step1_5Stars', 200);
    
    // 逐字打印欢迎文字
    const welcomeText = "ALOHA！欢迎来到《Language Tour · 阳光夏威夷》的奇妙世界！\n在这里，语言学习、文化体验与社交邂逅，将交织成一段独一无二的魅力旅程。";
    const textContainer = document.getElementById('welcomeText');
    let charIndex = 0;
    let canClick = false; // 标记是否可以点击
    
    // 将文本按行分割
    const lines = welcomeText.split('\n');
    let currentLine = 0;
    let currentCharInLine = 0;
    
    function typeWriter() {
        if (currentLine < lines.length) {
            const currentLineText = lines[currentLine];
            
            if (currentCharInLine === 0) {
                // 创建新的行容器
                const lineDiv = document.createElement('div');
                lineDiv.id = `welcomeLine${currentLine}`;
                lineDiv.style.whiteSpace = 'nowrap';
                textContainer.appendChild(lineDiv);
            }
            
            if (currentCharInLine < currentLineText.length) {
                const lineDiv = document.getElementById(`welcomeLine${currentLine}`);
                lineDiv.innerHTML += currentLineText[currentCharInLine];
                currentCharInLine++;
                setTimeout(typeWriter, 100); // 每个字符 100ms
            } else {
                // 当前行打印完成，切换到下一行
                currentLine++;
                currentCharInLine = 0;
                setTimeout(typeWriter, 200); // 行与行之间延迟稍长
            }
        } else {
            // 文字打印完成，显示点击提示
            setTimeout(() => {
                const clickHint = document.getElementById('clickHint');
                clickHint.style.display = 'block';
                canClick = true; // 允许点击
            }, 500);
        }
    }
    
    // 延迟一点开始打印
    setTimeout(typeWriter, 500);
    
    currentStep = 1.5;
}

// API 选择相关函数

// 从第一步显示 API 选择弹窗
function showAPISelectionFromStep1() {
    const modal = document.getElementById('apiSelectionModal');
    modal.style.display = 'flex';
}

// 从 1.5 步显示 API 选择弹窗（已废弃，保留以防需要）
function showAPISelection() {
    const clickHint = document.getElementById('clickHint');
    // 只有提示显示后才能点击
    if (clickHint && clickHint.style.display === 'block') {
        const modal = document.getElementById('apiSelectionModal');
        modal.style.display = 'flex';
    }
}

// 选择使用开发者的 API
function selectDeveloperAPI() {
    // 使用默认的开发者 API Key（从 config.js 读取）
    window.USE_DEVELOPER_API = true;
    window.CUSTOM_API_KEY = null;
    
    // 清除 localStorage 中保存的自定义 API Key
    localStorage.removeItem('hawaii_game_api_key');
    
    // 隐藏弹窗
    const modal = document.getElementById('apiSelectionModal');
    modal.style.display = 'none';
    
    // 延迟一点后进入 1.5 步
    setTimeout(() => {
        goToStep1_5();
    }, 300);
}

// 显示自定义 API 输入框
function showCustomAPIInput() {
    const customInput = document.getElementById('customAPIInput');
    customInput.style.display = 'block';
    
    // 聚焦到输入框
    setTimeout(() => {
        const apiKeyInput = document.getElementById('apiKeyInput');
        apiKeyInput.focus();
    }, 100);
}

// 保存自定义 API 并继续
function saveCustomAPI() {
    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
        alert('请输入 API Key！');
        return;
    }
    
    // 保存自定义 API Key 到全局变量
    window.USE_DEVELOPER_API = false;
    window.CUSTOM_API_KEY = apiKey;
    
    // 保存到 localStorage，这样在 index.html 中也能使用
    localStorage.setItem('hawaii_game_api_key', apiKey);
    
    // 隐藏弹窗
    const modal = document.getElementById('apiSelectionModal');
    modal.style.display = 'none';
    
    // 延迟一点后进入 1.5 步
    setTimeout(() => {
        goToStep1_5();
    }, 300);
}

// 1.5 过渡页 → 第二步（带点击检查）
function goToStep2From1_5() {
    const clickHint = document.getElementById('clickHint');
    // 只有提示显示后才能点击
    if (clickHint && clickHint.style.display === 'block') {
        goToStep2();
    }
}

// 1.5 过渡页 → 第二步：机票显示
function goToStep2() {
    // 隐藏过渡页（如果存在）
    const step1_5Page = document.getElementById('step1_5Page');
    if (step1_5Page) {
        step1_5Page.style.display = 'none';
    }
    
    // 隐藏第一步（如果存在）
    const step1Page = document.getElementById('step1Page');
    if (step1Page) {
        step1Page.style.display = 'none';
    }
    
    // 显示第二步
    const step2Page = document.getElementById('step2Page');
    step2Page.style.display = 'block';
    
    // 生成星空
    createStars('step2Stars', 200);
    
    // 打字效果显示提示文字
    const typingText = "opps！快看，你的机票到了！快填上你的名字，开启这段旅行吧！";
    const textContainer = document.getElementById('step2TypingText');
    let charIndex = 0;
    
    function typeWriter() {
        if (charIndex < typingText.length) {
            textContainer.innerHTML += typingText[charIndex];
            charIndex++;
            setTimeout(typeWriter, 100);
        }
    }
    
    // 延迟一点开始打字效果
    setTimeout(typeWriter, 300);
    
    // 自动聚焦到输入框
    setTimeout(() => {
        const nameInput = document.getElementById('step2NameInput');
        if (nameInput) {
            nameInput.focus();
        }
    }, 500);
    
    currentStep = 2;
}

// 第二步：机票显示 → 第三步：飞机飞出
function goToStep3() {
    // 获取乘客姓名
    const nameInput = document.getElementById('step2NameInput');
    const name = nameInput.value.trim();
    
    if (!name) {
        alert('请输入你的名字哦！✈️');
        nameInput.focus();
        return;
    }
    
    // 直接隐藏第二步
    const step2Page = document.getElementById('step2Page');
    step2Page.style.display = 'none';
    
    // 显示第三步
    const step3Page = document.getElementById('step3Page');
    step3Page.style.display = 'block';
    
    // 生成星空
    createStars('step3Stars', 200);
    
    // 填充乘客姓名
    document.getElementById('step3TicketName').textContent = name;
    
    // 立即移除机票的所有动画
    const step3Ticket = document.getElementById('step3Ticket');
    if (step3Ticket) {
        step3Ticket.style.animation = 'none';
    }
    
    // 执行飞机飞出动画
    startStep3Animation();
    
    currentStep = 3;
}

// 第三步动画：机票消散 + 飞机飞出
function startStep3Animation() {
    const ticketWrapper = document.getElementById('step3TicketWrapper');
    const ticket = document.getElementById('step3Ticket');
    const boardingPassWrapper = document.querySelector('#step3TicketWrapper .boarding-pass-wrapper');
    
    // 停止所有动画
    if (ticket) {
        ticket.style.animation = 'none';
    }
    if (boardingPassWrapper) {
        boardingPassWrapper.style.animation = 'none';
    }
    
    // 确保机票在居中位置淡出（延长到 3 秒）
    ticketWrapper.style.transition = 'opacity 3s ease-out';
    ticketWrapper.style.opacity = '0';
    
    // 创建星光粒子效果
    createStarParticles();
    
    // 3 秒后完全隐藏
    setTimeout(() => {
        ticketWrapper.style.display = 'none';
    }, 3000);
    
    // 2 秒后纸飞机飞出（淡出开始后）
    setTimeout(() => {
        const paperPlane = document.getElementById('paperPlane');
        paperPlane.classList.add('fly');
        
        // 创建自然彩色粒子尾迹
        let naturalTrailInterval = setInterval(() => {
            const paperPlane = document.getElementById('paperPlane');
            if (!paperPlane) return;
            
            const planeRect = paperPlane.getBoundingClientRect();
            // 每次创建 5-8 个粒子
            const count = Math.floor(Math.random() * 4) + 5;
            for (let i = 0; i < count; i++) {
                // 粒子在飞机中心的后面（左下方）
                const offsetX = (Math.random() - 0.5) * 15 - 20;  // 向右后方一点
                const offsetY = (Math.random() - 0.5) * 15 + 20;  // 向下后方一点
                createNaturalTrail(planeRect.left + planeRect.width / 2 + offsetX, planeRect.top + planeRect.height / 2 + offsetY);
            }
        }, 30); // 更频繁地创建粒子
        
        // 飞机飞出后停止创建尾迹
        setTimeout(() => {
            clearInterval(naturalTrailInterval);
        }, 7000);
        
        // 显示完成提示（但不显示重新开始按钮，直接跳转）
        setTimeout(() => {
            document.getElementById('completeMessage').classList.add('show');
            // 不显示重新开始按钮，直接跳转
            // document.getElementById('restartBtn').classList.add('show');
            
            // 1.5 秒后跳转到主游戏页面
            setTimeout(() => {
                if (typeof goToMainGame === 'function') {
                    goToMainGame();
                }
            }, 100);
        }, 1000);
    }, 1000);
}

// 重新开始
function restart() {
    // 重置所有状态
    document.getElementById('step2NameInput').value = '';
    document.getElementById('completeMessage').classList.remove('show');
    document.getElementById('restartBtn').classList.remove('show');
    document.getElementById('paperPlane').classList.remove('fly');
    
    // 清空粒子效果
    const step3Page = document.getElementById('step3Page');
    const particles = step3Page.querySelectorAll('.star-particle, .natural-trail, .trail');
    particles.forEach(p => p.remove());
    
    // 重置第三步的显示
    const step3TicketWrapper = document.getElementById('step3TicketWrapper');
    const step3Ticket = document.getElementById('step3Ticket');
    if (step3TicketWrapper) {
        step3TicketWrapper.style.display = 'block';
        step3TicketWrapper.style.opacity = '1';
        step3TicketWrapper.style.transform = 'scale(1)';
    }
    if (step3Ticket) {
        step3Ticket.style.display = 'block';
        step3Ticket.style.opacity = '1';
        step3Ticket.style.transform = 'scale(1)';
    }
    
    // 恢复所有文字元素
    if (step3TicketWrapper) {
        const allTextElements = step3TicketWrapper.querySelectorAll('*');
        allTextElements.forEach(el => {
            el.style.opacity = '1';
            el.style.removeProperty('color');
            el.style.removeProperty('-webkit-text-fill-color');
        });
    }
    
    // 隐藏第三步
    step3Page.style.display = 'none';
    
    // 直接显示第一步
    const step1Page = document.getElementById('step1Page');
    step1Page.style.display = 'block';
    
    // 重新生成第一步的星空
    document.getElementById('step1Stars').innerHTML = '';
    createStars('step1Stars', 200);
    
    currentStep = 1;
}

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
    // 生成第一步的星空
    createStars('step1Stars', 200);
});
