// ========== 游戏测试功能 ==========
// 此文件包含游戏的所有测试功能，用于开发和调试

// 测试撒花特效
window.testConfetti = function() {
    console.log("=== 测试撒花特效 ===");
    showConfetti();
    
    const chatContainer = document.getElementById('chatContainer');
    const testMessage = document.createElement('div');
    testMessage.className = 'system-message';
    testMessage.innerHTML = `
        <span style="font-weight: bold; color: #6a1b9a;">
            🎉 撒花特效测试 🎉<br><br>
            享受这华丽的时刻！✨
        </span>
    `;
    chatContainer.appendChild(testMessage);
}

// 测试机场邂逅
window.testAirportEncounter = async function() {
    console.log("=== 开始测试机场邂逅 ===");
    
    // 初始化游戏状态
    gameState.currentNpc = null;
    gameState.conversationHistory = [];
    gameState.conversationCount = 0;
    
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
    
    // 显示测试标题
    const testTitle = document.createElement('div');
    testTitle.className = 'system-message';
    testTitle.innerHTML = `
        <span style="font-weight: bold; color: #6a1b9a;">
            🧪 测试模式 - 机场邂逅 🧪<br><br>
            正在生成邂逅人物...
        </span>
    `;
    chatContainer.appendChild(testTitle);
    
    // 触发邂逅（会自动设置 storyPhase = "encounter"）
    await window.triggerAirportEncounter();
    
    console.log("机场邂逅测试已启动，现在可以正常对话了！");
}

// 测试机场成就
// ... (content omitted) ...

// 测试邀约短信（使用默认模板，不调用 AI）
window.testInvitationSMS = function() {
    console.log("=== 测试邀约短信（默认模板）===");
    
    // 创建测试 NPC
    const testNpc = {
        name: "TestNPC",
        chineseName: "测试 NPC",
        age: 25,
        occupation: "摄影师",
        personality: "热情开朗",
        origin: "美国"
    };
    
    // 直接生成默认邀约
    const invitation = window.generateDefaultInvitation(testNpc);
    console.log("生成的邀约内容:", invitation);
    
    // 显示短信
    window.showInvitationSMS(invitation, testNpc.name, testNpc.chineseName);
    
    console.log("✅ 邀约短信测试已显示");
};

// 测试默认邀约模板
window.testDefaultInvitation = function() {
    console.log("=== 测试默认邀约模板 ===");
    
    const testNpc = {
        name: "DefaultNPC",
        chineseName: "默认 NPC",
        occupation: "冲浪教练",
        personality: "阳光热情"
    };
    
    const invitation = window.generateDefaultInvitation(testNpc);
    console.log("生成的默认邀约:", invitation);
    
    window.showInvitationSMS(invitation, testNpc.name, testNpc.chineseName);
    console.log("✅ 默认邀约模板测试已显示");
};
window.testAirportMedal = async function() {
    console.log("=== 开始测试机场成就 ===");
    
    // 初始化游戏状态
    gameState.currentNpc = null;
    gameState.conversationHistory = [];
    gameState.storyPhase = "test";
    gameState.conversationCount = 0;
    
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
    
    // 显示测试标题
    const testTitle = document.createElement('div');
    testTitle.className = 'system-message';
    testTitle.innerHTML = `
        <span style="font-weight: bold; color: #6a1b9a;">
            🧪 测试模式 - 机场成就 🧪<br><br>
            正在生成成就事件...
        </span>
    `;
    chatContainer.appendChild(testTitle);
    
    // 触发成就
    await window.triggerAirportMedalEvent();
    
    console.log("机场成就测试已启动！");
}

// 测试酒店部分
window.testHotel = async function() {
    console.log("=== 开始测试酒店部分 ===");
    
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
    
    // 初始化游戏状态
    gameState.locations = [];
    gameState.encounters = [];
    gameState.branches = [];
    gameState.conversationHistory = [];
    gameState.currentNpc = "前台接待员";
    gameState.storyPhase = "hotelCheckIn";
    gameState.conversationCount = 0;
    gameState.luauInvitationShown = false;
    
    // 添加酒店到 Location 面板
    if (!gameState.hotel) {
        gameState.hotel = {
            name: "威基基海滩酒店",
            description: "位于海滩边的豪华酒店",
            npc: "前台接待员"
        };
    }
    
    // 添加一级地点：檀香山国际机场
    addPrimaryLocation("檀香山国际机场", "✈️", "夏威夷的主要国际机场，开启美好旅程的第一站。");
    
    // 添加一级地点：威基基区域
    addPrimaryLocation("威基基区域", "🌺", "这里是世界著名的夏威夷度假区，拥有美丽的海滩、繁华的购物街和丰富的文化景点。");
    
    // 添加二级地点：威基基海滩酒店（关联到威基基区域）
    addSecondaryLocation("威基基区域", "威基基海滩酒店", "🏨", "豪华酒店");
    
    // 更新场景名称显示（左上角）
    const sceneNameEl = document.querySelector('.scene-name');
    if (sceneNameEl) {
        sceneNameEl.innerHTML = `
            <span>🏨</span>
            <span>威基基海滩酒店</span>
            <span>🌸</span>
        `;
    }
    
    // 显示到达酒店的旁白
    const arrivalMessage = document.createElement('div');
    arrivalMessage.className = 'system-message';
    arrivalMessage.innerHTML = `
        <span style="font-weight: bold; color: #6a1b9a;">
            🏨 到达威基基海滩酒店 🏨<br><br>
            出租车沿着海岸线飞驰，将檀香山机场的喧嚣远远抛在身后。当车子缓缓停稳，威基基海滩的画卷在她眼前豁然展开——炽热的阳光将细软的白沙镀成金色，湛蓝的海浪轻吻着岸边，成排的椰树在微风中摇曳生姿，投下斑驳的凉荫。酒店大堂敞开着面向大海的廊柱，咸湿的海风裹挟着欢快的浪涛声扑面而来，每一寸空气都浸透着热带岛屿特有的慵懒与热情。
        </span>
    `;
    chatContainer.appendChild(arrivalMessage);
    
    // 内心独白
    setTimeout(async () => {
        await generateInnerMonologue("终于到酒店了，看起来真不错！期待接下来的冒险！", "开心、期待、有点累但兴奋");
        
        // 前台接待员欢迎
        setTimeout(async () => {
            await generateNPCDialogue("前台接待员", `作为威基基海滩酒店的前台接待员，用英语热情欢迎游客入住。

【对话重点】
1. 第一句：简单欢迎，说"Aloha! Welcome to Waikiki Beach Hotel!"
2. 第二句：询问预订信息（姓名）来办理入住
3. 第三句：简单介绍酒店设施（泳池、海滩 access、餐厅等）
4. 保持专业、友好、热情，但不要发散太多话题

对话要简洁聚焦，不要提到太多附近的地方，重点是办理入住。用英语，语气专业友好。`);
            
            console.log("酒店测试已启动，现在可以和前台接待员对话！");
        }, 1000);
    }, 1000);
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 测试导游部分
window.testGuide = async function() {
    console.log("=== 开始测试导游部分 ===");
    
    // 初始化游戏状态
    gameState.currentNpc = null;
    gameState.conversationHistory = [];
    gameState.conversationCount = 0;
    
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
    
    // 显示测试标题
    const testTitle = document.createElement('div');
    testTitle.className = 'system-message';
    testTitle.innerHTML = `
        <span style="font-weight: bold; color: #6a1b9a;">
            🧪 测试模式 - 导游 Lani 🧪<br><br>
            正在初始化导游对话...
        </span>
    `;
    chatContainer.appendChild(testTitle);
    
    // 直接调用 meetGuide（会自动设置 storyPhase = "guide"）
    await meetGuide();
    
    console.log("导游测试已启动，现在可以和 Lani 对话了！");
}

// 测试 Koa 邀请（说 byebye 后弹出选项）
window.testKoaInvitation = async function() {
    console.log("=== 开始测试 Koa 邀请 ===");
    
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
    
    // 初始化游戏状态
    gameState.locations = [];
    gameState.encounters = [];
    gameState.branches = [];
    gameState.conversationHistory = [];
    gameState.currentNpc = "Koa";
    gameState.storyPhase = "encounter";
    gameState.conversationCount = 4;  // 设置为 4，模拟已经聊了 4 轮
    gameState.koaInvitationShown = false;
    
    // 显示测试标题
    const testTitle = document.createElement('div');
    testTitle.className = 'system-message';
    testTitle.innerHTML = `
        <span style="font-weight: bold; color: #6a1b9a;">
            🧪 测试模式 - Koa 邀请 🧪<br><br>
            测试 Koa 邀请对话和选项显示...
        </span>
    `;
    chatContainer.appendChild(testTitle);
    
    // 直接显示 Koa 的邀请对话
    setTimeout(() => {
        const invitationMessage = document.createElement('div');
        invitationMessage.className = 'system-message';
        invitationMessage.innerHTML = `
            <span style="font-weight: bold; color: #6a1b9a;">
                🏄‍♂️ Koa 真诚地看着你 🏄‍️<br><br>
                "You know what? I have to say... you're absolutely stunning."<br><br>
                他的眼神温柔而真诚，海风吹起他的发丝，露出俊朗的侧脸。<br><br>
                "I was wondering... would you do me the honor of joining our beach party tonight?"<br>
                他有些紧张地搓了搓手，露出期待的笑容。<br><br>
                "It's at Duke Beach. We've got music, bonfire, and the best sunset view on the island."<br>
                他的声音带着一丝期待，"I'd really love to see you there."<br><br>
                <em style="color: #888;">（Koa 邀请你参加今晚在 Duke Beach 的海滩派对）</em>
            </span>
        `;
        chatContainer.appendChild(invitationMessage);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // 立即弹出选项
        console.log("准备显示选项...");
        if (typeof showBeachBarInvitationOptions === 'function') {
            showBeachBarInvitationOptions();
            console.log("选项已显示！");
        } else {
            console.error("showBeachBarInvitationOptions 函数未定义");
        }
        
    }, 1000);
    
    console.log("Koa 邀请测试已启动！");
}

// ========== 键盘快捷键监听 ==========

// 按 T 键打开测试菜单
document.addEventListener('keydown', function(e) {
    // 只在游戏页面且输入框未聚焦时响应
    const gamePage = document.getElementById('gamePage');
    const userInput = document.getElementById('userInput');
    
    if (gamePage && gamePage.style.display !== 'none' && 
        document.activeElement !== userInput && 
        e.key === 't' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        
        showTestMenu();
    }
});

/**
 * 显示测试菜单
 */
function showTestMenu() {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <h3>🧪 测试模式菜单</h3>
        <div style="display: flex; flex-direction: column; gap: 10px; padding: 20px;">
            <button onclick="window.testGoToBeachFunc()" style="padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 15px; color: white; font-size: 1em; font-weight: bold; cursor: pointer; transition: transform 0.2s;">
                🏖️ 直接去威基基海滩
            </button>
            <button onclick="window.testConfettiFunc()" style="padding: 15px; background: linear-gradient(135deg, #ffc8dd 0%, #bde0fe 100%); border: none; border-radius: 15px; color: #6a1b9a; font-size: 1em; font-weight: bold; cursor: pointer; transition: transform 0.2s;">
                🎉 测试撒花特效
            </button>
            <button onclick="window.testAirportEncounterFunc()" style="padding: 15px; background: linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%); border: none; border-radius: 15px; color: #2e7d32; font-size: 1em; font-weight: bold; cursor: pointer; transition: transform 0.2s;">
                ✈️ 测试机场邂逅
            </button>
            <button onclick="window.testAirportMedalFunc()" style="padding: 15px; background: linear-gradient(135deg, #ffd89b 0%, #d4fc79 100%); border: none; border-radius: 15px; color: #5d4037; font-size: 1em; font-weight: bold; cursor: pointer; transition: transform 0.2s;">
                🏅 测试机场成就
            </button>
            <button onclick="window.testHotelFunc()" style="padding: 15px; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); border: none; border-radius: 15px; color: #5d4037; font-size: 1em; font-weight: bold; cursor: pointer; transition: transform 0.2s;">
                🏨 测试酒店部分
            </button>
            <button onclick="window.testGuideFunc()" style="padding: 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border: none; border-radius: 15px; color: #01579b; font-size: 1em; font-weight: bold; cursor: pointer; transition: transform 0.2s;">
                🌺 测试导游 Lani
            </button>
            <button onclick="window.testKoaInvitationFunc()" style="padding: 15px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border: none; border-radius: 15px; color: white; font-size: 1em; font-weight: bold; cursor: pointer; transition: transform 0.2s;">
                🏄‍️ 测试 Koa 邀请（byebye）
            </button>
        </div>
        <p style="text-align: center; color: #666; font-size: 0.9em; margin-top: 15px;">
            按 <strong>T</strong> 键打开此菜单
        </p>
    `;
    
    // 显示模态框并添加 show 类以触发动画
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('show'), 10);  // 添加这一行
    
    console.log("测试菜单已显示");  // 添加调试信息
}

// 暴露测试菜单函数到全局
window.showTestMenu = showTestMenu;

// ========== 测试函数包装器（自动关闭模态框） ==========

window.testGoToBeachFunc = function() {
    closeModal();
    setTimeout(() => testGoToBeach(), 100);
};

window.testConfettiFunc = function() {
    closeModal();
    setTimeout(() => testConfetti(), 100);
};

window.testAirportEncounterFunc = async function() {
    closeModal();
    setTimeout(async () => await testAirportEncounter(), 100);
};

window.testAirportMedalFunc = async function() {
    closeModal();
    setTimeout(async () => await testAirportMedal(), 100);
};

window.testHotelFunc = async function() {
    closeModal();
    setTimeout(async () => await testHotel(), 100);
};

window.testGuideFunc = async function() {
    closeModal();
    setTimeout(async () => await testGuide(), 100);
};

window.testKoaInvitationFunc = async function() {
    closeModal();
    setTimeout(async () => await testKoaInvitation(), 100);
};

console.log("游戏测试模块已加载 ✓");
