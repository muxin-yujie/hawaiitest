// ========== 游戏入口和场景调度模块 ==========
// ✅ 全局变量已由 core.js 集中管理

// 初始化错误处理模块
if (typeof ErrorHandler !== 'undefined') {
    ErrorHandler.init();
}

window.playerContext = GameCore.state.playerContext;


// ============================================================================
// 第 2 部分：场景函数（被调用的放在前面）
// ============================================================================

// 场景入口函数已移到 game.js：
// - startCustomsScene() - 海关场景
// - meetGuide() - 遇到导游

// ============================================================================
// 第 3 部分：剧情调度函数
// ============================================================================

/**
 * 剧情进度检查
 * 调用者：handleInput()
 * 注意：实际实现在 game.js 中，包含所有阶段的处理逻辑
 */
// checkStoryProgress 函数已移到 game.js，包含海关、导游、邂逅等所有阶段的处理

/**
 * 处理用户输入（核心交互入口）
 * 调用者：回车键事件监听器
 * 
 * 完整流程：
 * 1. 显示玩家消息
 * 2. 保存到对话历史
 * 3. 清空输入框
 * 4. 显示"NPC 正在思考..."
 * 5. 获取 AI 回复（英文）
 * 6. 翻译成中文
 * 7. 移除加载提示
 * 8. 显示 NPC 消息（英文 + 中文）
 * 9. 保存到对话历史
 * 10. 生成文化提示（90% 概率）
 * 11. 对话计数 +1
 * 12. 检查剧情进度
 */
async function handleInput() {
    const inputEl = document.getElementById('userInput');
    if (!inputEl) return;

    const userInput = inputEl.value;
    if (!userInput.trim()) return;
    
    if (!gameState.currentNpc && gameState.storyPhase === "test") {
        alert("当前没有可以对话的 NPC。请刷新页面或开始新游戏！");
        return;
    }
    
    // 显示玩家消息
    displayPlayerMessage(userInput);
    
    // 保存到对话历史
    gameState.conversationHistory.push({ role: "user", content: userInput });
    
    // 同时保存到当前 NPC 的对话历史（用于邀约系统）
    if (gameState.currentNpc && gameState.storyPhase === "encounter") {
        const npcEncounter = gameState.encounters.find(e => e.name === gameState.currentNpc);
        if (npcEncounter) {
            if (!npcEncounter.chatHistory) {
                npcEncounter.chatHistory = [];
            }
            npcEncounter.chatHistory.push({ role: "user", content: userInput });
        }
    }
    
    // 清空输入框
    inputEl.value = '';
    
    // 显示加载提示
    displayLoadingMessage(gameState.currentNpc);
    
    // 获取 AI 回复（英文）
    const npcResponse = await getAIResponse(userInput, gameState.currentNpc, gameState.conversationHistory);
    
    // 翻译成中文
    const translation = await translateToChinese(npcResponse);
    
    // 移除加载提示
    removeLoadingMessage();
    
    // 显示 NPC 消息（英文 + 中文翻译）
    displayNPCMessage(gameState.currentNpc, npcResponse, translation);
    
    // 保存到对话历史
    gameState.conversationHistory.push({ role: "assistant", content: npcResponse });
    
    // 同时保存到当前 NPC 的对话历史（用于邀约系统）
    if (gameState.currentNpc && gameState.storyPhase === "encounter") {
        const npcEncounter = gameState.encounters.find(e => e.name === gameState.currentNpc);
        if (npcEncounter) {
            if (!npcEncounter.chatHistory) {
                npcEncounter.chatHistory = [];
            }
            npcEncounter.chatHistory.push({ role: "assistant", content: npcResponse });
        }
    }
    
    // 90% 概率生成文化提示
    if (Math.random() < 0.9) {
        await generateAICultureTip(gameState.currentPrimaryLocation, npcResponse);
    }
    
    // 对话计数 +1
    gameState.conversationCount = (gameState.conversationCount || 0) + 1;
    
    // Duke's Waikiki 约会计数
    if (gameState.storyPhase === "Duke's Waikiki") {
        gameState.dateConversationCount = (gameState.dateConversationCount || 0) + 1;
        console.log("Duke's Waikiki 对话轮数:", gameState.dateConversationCount);
    }
    
    // 对话达到 2 轮后，显示结束对话按钮（仅在机场邂逅场景）
    if (gameState.conversationCount >= 2 && gameState.storyPhase === "encounter") {
        const endBtn = document.getElementById('endConversationBtn');
        if (endBtn && endBtn.style.display === 'none') {
            endBtn.style.display = 'block';
        }
    }
    
    // 调试日志
    console.log("对话计数:", gameState.conversationCount, "当前阶段:", gameState.storyPhase);
    console.log("准备检查进度 - 玩家输入:", userInput, "NPC 回复:", npcResponse);
    
    // 检查剧情进度
    await checkStoryProgress(userInput, npcResponse);
}


// ============================================================================
// 第 4 部分：游戏入口函数
// ============================================================================

/**
 * 提交玩家姓名（真正的游戏入口）
 * 调用者：HTML 按钮点击 / window.submitName
 */
function submitName() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();
    
    if (name) {
        startGameWithName(name);
    } else {
        alert('请输入你的姓名');
    }
}

/**
 * 从 URL 参数读取名字（如果有的话）
 */
function checkURLForName() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    
    if (name) {
        // 有名字参数，直接开始游戏
        startGameWithName(name);
    } else {
        // 没有名字参数，显示名字输入页面
        document.getElementById('nameSetupPage').style.display = 'flex';
    }
}

/**
 * 使用名字开始游戏
 */
function startGameWithName(name) {
    // 检查 gameState 是否存在
    if (typeof gameState === 'undefined') {
        console.error('gameState 未定义！请确保 game.js 已加载');
        alert('游戏初始化失败，请刷新页面重试');
        return;
    }
    
    gameState.player.name = name;
    document.getElementById('userName').textContent = name;
    document.getElementById('nameSetupPage').style.display = 'none';
    document.getElementById('gamePage').style.display = 'flex';
    initGame();
}

/**
 * 游戏初始化
 * 调用者：submitName()
 */
function initGame() {
    // 使用统一适配器初始化所有状态
    window.gameState = window.initUnifiedAdapter(window.gameState);
    
    // 初始化游戏状态
    gameState.locations = [];
    gameState.encounters = [];
    gameState.notebook = [];
    gameState.medals = [];
    gameState.branches = [];
    gameState.completedTasks = [];
    gameState.storyPhase = "customs";
    gameState.currentItineraryIndex = 0;
    gameState.itinerary = [];
    gameState.dynamicNpcRoles = {};
    
    startCustomsScene();
}

/**
 * 处理结束对话按钮点击
 * 玩家点击后自动生成告别语，NPC 回复后结束对话
 */
async function handleEndConversation() {
    if (!gameState.currentNpc) {
        console.log("当前没有对话 NPC");
        return;
    }
    
    const chatContainer = document.getElementById('chatContainer');
    const endBtn = document.getElementById('endConversationBtn');
    
    // 禁用按钮防止重复点击
    if (endBtn) {
        endBtn.disabled = true;
        endBtn.style.opacity = '0.6';
    }
    
    // 自动生成告别语
    const farewellMessages = [
        "I have to go now. It was nice talking to you! Bye!",
        "Well, I should get going. Take care! See you later!",
        "It's getting late. I need to go now. Bye!",
        "I enjoyed our conversation, but I have to go now. Take care!",
        "Today ends here. It was great meeting you! Bye!"
    ];
    
    const randomFarewell = farewellMessages[Math.floor(Math.random() * farewellMessages.length)];
    
    // 显示玩家的告别消息
    displayPlayerMessage(randomFarewell);
    gameState.conversationHistory.push({ role: "user", content: randomFarewell });
    
    // 保存到 NPC 的对话历史
    if (gameState.storyPhase === "encounter") {
        const npcEncounter = gameState.encounters.find(e => e.name === gameState.currentNpc);
        if (npcEncounter) {
            if (!npcEncounter.chatHistory) {
                npcEncounter.chatHistory = [];
            }
            npcEncounter.chatHistory.push({ role: "user", content: randomFarewell });
        }
    }
    
    // 显示加载提示
    displayLoadingMessage(gameState.currentNpc);
    
    // 获取 NPC 的告别回复
    const farewellPrompt = `The player wants to end the conversation. Please respond with a warm, friendly goodbye message. Keep it natural and brief (1-2 sentences).`;
    const npcResponse = await getAIResponse(farewellPrompt, gameState.currentNpc, gameState.conversationHistory);
    
    // 翻译
    const translation = await translateToChinese(npcResponse);
    
    // 移除加载提示
    removeLoadingMessage();
    
    // 显示 NPC 的告别消息
    displayNPCMessage(gameState.currentNpc, npcResponse, translation);
    gameState.conversationHistory.push({ role: "assistant", content: npcResponse });
    
    // 保存到 NPC 的对话历史
    if (gameState.storyPhase === "encounter") {
        const npcEncounter = gameState.encounters.find(e => e.name === gameState.currentNpc);
        if (npcEncounter) {
            npcEncounter.chatHistory.push({ role: "assistant", content: npcResponse });
        }
    }
    
    // 延迟后结束对话
    setTimeout(() => {
        console.log("🚪 玩家主动结束对话");
        
        // 清空当前 NPC
        gameState.currentNpc = null;
        gameState.conversationHistory = [];
        
        // 隐藏结束按钮
        if (endBtn) {
            endBtn.style.display = 'none';
            endBtn.disabled = false;
            endBtn.style.opacity = '1';
        }
        
        // 显示系统提示
        const endMessage = document.createElement('div');
        endMessage.className = 'system-message';
        endMessage.innerHTML = `
            <span style="font-weight: bold; color: #6a1b9a;">
                💬 对话结束。你可以继续探索其他地方了。
            </span>
        `;
        chatContainer.appendChild(endMessage);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // 根据当前阶段触发后续事件
        if (gameState.storyPhase === "encounter") {
            // 邂逅结束后遇到导游
            setTimeout(async () => {
                await meetGuide();
            }, 1000);
        } else if (gameState.storyPhase === "medal") {
            // 成就结束后遇到导游
            setTimeout(async () => {
                await meetGuide();
            }, 1000);
        } else if (gameState.storyPhase === "secondaryLocation") {
            // 二级地点结束后进入下一个地点
            setTimeout(async () => {
                const nextSecondaryIndex = gameState.currentSecondaryIndex + 1;
                if (nextSecondaryIndex < gameState.secondaryLocations.length) {
                    await enterSecondaryLocation(nextSecondaryIndex);
                } else {
                    showSystemMessage("所有地点探索完毕！");
                }
            }, 1000);
        }
    }, 2000);
}

// 暴露到全局
window.handleEndConversation = handleEndConversation;
window.meetGuide = meetGuide;  // 导出 meetGuide 函数


// ============================================================================
// 第 5 部分：全局暴露
// ============================================================================

window.submitName = submitName;
window.handleInput = handleInput;

// 页面加载时检查 URL 参数
document.addEventListener('DOMContentLoaded', function() {
    checkURLForName();
});

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}


// ============================================================================
// 第 6 部分：事件监听器（最后执行）
// ============================================================================

// 初始化 UI 特效
initRippleEffect();
// initMouseEmoji(); // 此函数已移除

// 检查 localStorage 中是否有保存的 API Key
(function checkSavedAPIKey() {
    const savedApiKey = localStorage.getItem('hawaii_game_api_key');
    if (savedApiKey) {
        console.log('✓ 已加载保存的 API Key');
        window.CUSTOM_API_KEY = savedApiKey;
        window.USE_DEVELOPER_API = false;
    } else {
        console.log('ℹ️ 未找到保存的 API Key，将使用默认配置');
    }
})();

// 回车键发送消息
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleInput();
    }
});


// ============================================================================
// 第 7 部分：加载日志
// ============================================================================

console.log("游戏入口模块已加载 ✓");
