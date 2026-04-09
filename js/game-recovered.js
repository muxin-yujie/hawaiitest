// ========== 1. 游戏状态和配置 ==========
// ✅ 状态已由 core.js 集中管理
// gameState、primaryLocations、dynamicLocations 已初始化并暴露到全局作用域
// 这里仅作注释说明，不再重新定义（避免重复初始化和覆盖）


/**
 * 动态生成地点信息（AI 生成）
 * @param {string} locationKey - 地点的唯一标识符
 * @returns {Promise<Object|null>} 生成的地点数据，包含 name、emoji、description、secondaryLocations
 * 
 * 用途说明：
 * - 通过 AI 生成夏威夷的真实著名景点信息
 * - 生成的数据会缓存到 dynamicLocations 对象中
 * - 目前未使用，预留用于未来的随机探索或二周目内容
 */
async function generateDynamicLocation(locationKey) {
    try {
        const prompt = `生成一个夏威夷的真实著名景点信息，格式为 JSON，包含以下字段：
- name: 景点名称（中文）
- emoji: 合适的 emoji
- description: 景点的简短描述（中文，2-3 句话）
- secondaryLocations: 2-3 个二级地点，每个包含 name（中文）、npc（NPC 身份，英文）、emoji（合适的 emoji）

请只返回 JSON，不要其他内容。`;
        
        const locationData = JSON.parse(await callAI(
            prompt, 
            "你是一个夏威夷旅游专家，熟悉所有夏威夷著名景点。请只返回 JSON 格式。",
            500,
            0.9
        ));
        
        dynamicLocations[locationKey] = locationData;
        return locationData;
    } catch (error) {
        console.error("生成地点失败:", error);
        return null;
    }
}

// ========== 5. 游戏场景 ==========
/**
 * 启动海关场景（游戏第一个场景）
 * 描述玩家抵达夏威夷机场的情景，并引入第一个 NPC 对话
 */
async function startCustomsScene() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
    
    gameState.currentPrimaryLocation = "airport";
    gameState.currentSecondaryLocation = "海关";
    gameState.currentNpc = "海关官员";
    
    addPrimaryLocation("檀香山国际机场", "✈️", "夏威夷的主要国际机场，开启美好旅程的第一站。");
    
    // 显示顶部 Toast 通知 - 音乐提示
    const musicTip = document.createElement('div');
    musicTip.className = 'toast-notification';
    musicTip.innerHTML = `
        <span class="toast-notification-icon">🎵</span>
        <div class="toast-notification-content">
            <span class="toast-notification-title">背景音乐已就绪</span>
            <span class="toast-notification-message">点击下方功能栏的 🎵 Music 按钮享受音乐！</span>
        </div>
    `;
    document.body.appendChild(musicTip);
    
    // 2 秒后自动消失
    setTimeout(() => {
        musicTip.classList.add('hide');
        setTimeout(() => {
            if (musicTip.parentNode) {
                musicTip.parentNode.removeChild(musicTip);
            }
        }, 500);
    }, 2000);
    
    // 300ms 后显示场景旁白
    setTimeout(() => {
        const systemMessage = document.createElement('div');
        systemMessage.className = 'system-message';
        systemMessage.innerHTML = `
            <span style="font-weight: bold; color: #6a1b9a; font-size: 0.95em; line-height: 1.6;">
                ✈️ 抵达夏威夷 ✈️<br><br>
                飞机缓缓降落在檀香山国际机场，窗外是湛蓝的天空和连绵的山脉。你透过窗户看到远处的大海在阳光下闪闪发光，内心激动不已。<br><br>
                走下飞机，你随着人流走向海关检查区。这是你第一次独自出国旅行，既紧张又兴奋。<br><br>
                "终于到夏威夷了！"你心里默念着，"希望能在这里收获美好的回忆和提升英语口语。"
            </span>
        `;
        chatContainer.appendChild(systemMessage);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // 场景旁白显示后立即生成 NPC 对话
        setTimeout(async () => {
            await window.generateNPCDialogue("海关官员", "作为檀香山国际机场的海关官员，用英语专业但友善地欢迎游客入境，简单询问一些轻松的入境问题（比如来夏威夷的目的），保持专业但温暖的态度。");
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 50);
    }, 300);
}


// ========== 6. 机场随机事件 ==========
async function triggerAirportRandomEvent() {
    const chatContainer = document.getElementById('chatContainer');
    
    console.log("=== 触发机场随机事件 ===");
    
    // 测试版本：100% 触发
    console.log("【测试模式】机场随机事件必定触发！");
    
    const isEncounter = Math.random() < 0.5;
    console.log("随机事件类型:", isEncounter ? "邂逅" : "成就");
    
    if (isEncounter) {
        await window.triggerAirportEncounter();
    } else {
        await window.triggerAirportMedalEvent();
    }
}


// ========== 7. 导游阶段 ==========
async function meetGuide() {
    const chatContainer = document.getElementById('chatContainer');
    
    console.log("=== 遇到导游 Lani ===");
    
    gameState.storyPhase = "guide";
    gameState.currentNpc = "导游 Lani";
    gameState.conversationHistory = [];
    gameState.conversationCount = 0;
    
    // 保存 Lani 到 encounters
    const laniCharacter = {
        name: "导游 Lani",
        chineseName: "拉妮",
        nationality: "American",
        age: 22,
        occupation: "Tour Guide",
        emoji: "🌺",
        personality: "热情友好，热爱夏威夷文化，善于分享",
        scene: "檀香山国际机场 - 到达大厅",
        description: "夏威夷本地导游，穿着传统夏威夷花裙，脖子上戴着花环"
    };
    
    // 使用统一函数保存固定 NPC
    saveFixedNpcToEncounters(laniCharacter);
    
    const arrivalText = "你走出机场到达大厅，看到一个美丽的夏威夷女孩举着写有你名字的牌子，脸上洋溢着热情的笑容。她就是你的导游 Lani，穿着传统的夏威夷花裙，脖子上戴着花环。";
    showSceneNarration("遇到导游 Lani", arrivalText);
    
    await generateInnerMonologue("哇，这就是 Lani！好热情好漂亮啊！接下来的旅程一定会很精彩！", "兴奋、期待、开心");
    
    const guideDialoguePrompt = window.PROMPTS.GUIDE_FIRST_MEET;
    await window.generateNPCDialogue("导游 Lani", guideDialoguePrompt);
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}


// ========== 8. 行程生成 ==========
async function generateLocationsAndItinerary() {
    const laniEmoji = getNpcEmoji("导游 Lani");
    displayNPCMessage(`${laniEmoji} 导游 Lani`, 
        "Aloha! Now let me introduce the wonderful itinerary for your Hawaii trip! I've prepared 4 must-visit attractions for you, guaranteed to make your trip unforgettable!",
        "Aloha! 现在让我为你介绍这次夏威夷之旅的精彩行程！我已经为你准备了 4 个必去的景点，保证让你不虚此行！");
    
    setTimeout(async () => {
        await generateItinerary();
    }, 500);
}

async function generateItinerary() {
    const chatContainer = document.getElementById('chatContainer');
    
    const prompt = `为玩家生成一个完整的夏威夷 4 日游行程，选择 4 个夏威夷著名景点（威基基海滩必选作为第一个），用 JSON 格式返回，包含：
- primaryLocations: 4 个一级地点数组，每个包含 name（景点名称，中文）、emoji（emoji）、description（简短描述，中文）
- hotel: {name: 酒店名称（中文）, description: 酒店的简短描述（中文）, npc: "前台接待员"}
- secondaryLocationsPerPrimary: 每个一级地点的二级地点数组，每个一级地点对应 3 个二级地点（第一个是酒店，另外 2 个是随机地点），每个二级地点包含 name（中文）、npc（NPC 身份，英文）、emoji（合适的 emoji）

请只返回 JSON，不要其他内容。`;
    
    let itineraryData;
    try {
        itineraryData = await callAI_JSON(
            prompt,
            "你是一个夏威夷旅游专家，善于规划行程。请只返回 JSON 格式。",
            400,
            0.9
        );
    } catch (error) {
        console.error("JSON 解析失败:", error);
        itineraryData = null;
    }
    
    // 验证 AI 返回的数据结构
    if (!itineraryData || !itineraryData.primaryLocations || !Array.isArray(itineraryData.primaryLocations) || 
        itineraryData.primaryLocations.length === 0 || !itineraryData.primaryLocations[0].name) {
        console.warn("AI 返回的数据格式不正确，使用预设行程");
        itineraryData = {
            primaryLocations: [
                { name: "威基基海滩", emoji: "🏖️", description: "世界著名的海滩，冲浪和日光浴的天堂" },
                { name: "钻石头山", emoji: "🌋", description: "夏威夷的标志性地标，可俯瞰全景" },
                { name: "珍珠港", emoji: "⚓", description: "历史遗迹，二战纪念馆" },
                { name: "古兰尼牧场", emoji: "🏞️", description: "热带雨林和山谷风光" }
            ],
            hotel: { name: "威基基海滩酒店", description: "位于海滩边的豪华酒店", npc: "前台接待员" },
            secondaryLocationsPerPrimary: [
                [{ name: "威基基海滩酒店", emoji: "🏨", npc: "前台接待员" }, { name: "冲浪店", emoji: "🏄", npc: "酷酷的女孩" }, { name: "海边餐厅", emoji: "🍹", npc: "餐厅服务员" }],
                [{ name: "观景台", emoji: "📸" }, { name: "登山步道", emoji: "🥾" }, { name: "纪念品店", emoji: "🎁" }],
                [{ name: "博物馆", emoji: "🏛️" }, { name: "游客中心", emoji: "ℹ️" }, { name: "码头", emoji: "⚓" }],
                [{ name: "探险中心", emoji: "🏕️" }, { name: "骑马场", emoji: "🐎" }, { name: "瀑布观景点", emoji: "💦" }]
            ]
        };
    }
    
    console.log("行程已生成，等待到达后添加到 Location 面板");
    console.log("第一个一级地点数据:", itineraryData.primaryLocations[0]);
    
    if (!itineraryData.hotel.npc) {
        itineraryData.hotel.npc = "前台接待员";
    }
    
    gameState.primaryLocationsList = itineraryData.primaryLocations;
    gameState.secondaryLocationsPerPrimary = itineraryData.secondaryLocationsPerPrimary;
    gameState.currentPrimaryLocationData = itineraryData.primaryLocations[0];
    gameState.hotel = itineraryData.hotel;
    gameState.secondaryLocations = itineraryData.secondaryLocationsPerPrimary[0].map((loc, i) => ({
        ...loc,
        type: i === 0 ? "hotel" : "random",
    }));
    
    // 验证 currentPrimaryLocationData 是否正确设置
    if (!gameState.currentPrimaryLocationData || !gameState.currentPrimaryLocationData.name) {
        console.error("currentPrimaryLocationData 设置失败！", gameState.currentPrimaryLocationData);
        gameState.currentPrimaryLocationData = { name: "威基基海滩", emoji: "🏖️", description: "世界著名的海滩，冲浪和日光浴的天堂" };
    }
    
    gameState.currentPrimaryIndex = 0;
    gameState.currentSecondaryIndex = 0;
    gameState.conversationCount = 0;
    
    let itineraryText = "🗺️ 你的夏威夷之旅 🗺️<br><br>";
    itineraryData.primaryLocations.forEach((loc, i) => {
        itineraryText += `${i + 1}. ${loc.emoji} ${loc.name}<br>`;
    });
    itineraryText += `<br>📍 第一站：${itineraryData.primaryLocations[0].name}<br><br>`;
    itineraryText += itineraryData.primaryLocations[0].description + "<br><br>";
    itineraryText += `🏨 入住酒店：${itineraryData.hotel.name}<br>`;
    itineraryText += itineraryData.hotel.description + "<br><br>";
    itineraryText += "接下来我们还会探索附近的其他精彩地点！";
    
    const systemMessage = document.createElement('div');
    systemMessage.className = 'system-message';
    systemMessage.innerHTML = `<span style="font-weight: bold; color: #6a1b9a;">${itineraryText}</span>`;
    chatContainer.appendChild(systemMessage);
    
    console.log("=== 生成行程，准备进入第一个一级地点 ===");
    console.log("第一个一级地点:", itineraryData.primaryLocations[0].name);
    
    showOptions([
        { 
            text: '🏨 先去酒店办理入住', 
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            onClick: async () => {
                await goToHotel();
            }
        },
        { 
            text: '🏖️ 先去海滩看看', 
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            onClick: async () => {
                await goToBeachFirst();
            }
        }
    ]);
}


// ========== 9. 场景选择：酒店或海滩 ==========
async function goToHotel() {
    const chatContainer = document.getElementById('chatContainer');
    
    addPrimaryLocation(gameState.currentPrimaryLocationData.name, gameState.currentPrimaryLocationData.emoji, gameState.currentPrimaryLocationData.description);
    const hotelEmoji = getLocationEmoji("酒店");
    addSecondaryLocation(gameState.currentPrimaryLocationData.name, gameState.hotel.name, hotelEmoji, gameState.hotel.description);
    
    // 确保 hotel 有 emoji
    const hotelWithEmoji = {
        ...gameState.hotel,
        emoji: hotelEmoji,
        type: "hotel"
    };
    
    // 更新场景名称
    document.querySelector('.scene-name').innerHTML = `
        <span>${hotelWithEmoji.emoji}</span>
        <span>${hotelWithEmoji.name}</span>
        <span>🌸</span>
    `;
    
    // 显示到达旁白
    setTimeout(() => {
        const systemMessage = document.createElement('div');
        systemMessage.className = 'system-message';
        systemMessage.innerHTML = `
            <span style="font-weight: bold; color: #6a1b9a; font-size: 0.95em; line-height: 1.6;">
                🏨 到达 ${hotelWithEmoji.name} 🏨<br><br>
                离开檀香山国际机场，沿着卡拉卡瓦大道行驶，蔚蓝的太平洋逐渐映入眼帘。当你踏上威基基海滩时，金色的阳光洒在细腻的白沙上，椰子树在微风中轻轻摇曳。远处，冲浪者在碧波荡漾的海面上乘风破浪，空气中弥漫着淡淡的海盐和鸡蛋花香。
            </span>
        `;
        chatContainer.appendChild(systemMessage);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
    
    window.generateNPCDialogue("导游 Lani", `作为导游 Lani，用英语兴奋地告诉游客我们现在就去酒店办理入住。说酒店已经准备好了，办理完入住后可以好好休息一下，然后开始探索${gameState.currentPrimaryLocationData.name}。保持热情和期待的语气！`);
    
    setTimeout(async () => {
        await startHotelCheckIn();
    }, 500);
}

async function goToBeachFirst() {
    const chatContainer = document.getElementById('chatContainer');
    
    addPrimaryLocation(gameState.currentPrimaryLocationData.name, gameState.currentPrimaryLocationData.emoji, gameState.currentPrimaryLocationData.description);
    
    // 更新场景名称
    document.querySelector('.scene-name').innerHTML = `
        <span>${gameState.currentPrimaryLocationData.emoji}</span>
        <span>${gameState.currentPrimaryLocationData.name}</span>
        <span>🌸</span>
    `;
    
    // 显示到达旁白
    setTimeout(() => {
        const systemMessage = document.createElement('div');
        systemMessage.className = 'system-message';
        systemMessage.innerHTML = `
            <span style="font-weight: bold; color: #6a1b9a; font-size: 0.95em; line-height: 1.6;">
                🏖️ 到达 ${gameState.currentPrimaryLocationData.name} 🏖️<br><br>
                离开檀香山国际机场，沿着卡拉卡瓦大道行驶，蔚蓝的太平洋逐渐映入眼帘。当你踏上威基基海滩时，金色的阳光洒在细腻的白沙上，椰子树在微风中轻轻摇曳。远处，冲浪者在碧波荡漾的海面上乘风破浪，空气中弥漫着淡淡的海盐和鸡蛋花香。
            </span>
        `;
        chatContainer.appendChild(systemMessage);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
    
    window.generateNPCDialogue("导游 Lani", `作为导游 Lani，用英语惊喜地说游客真会选，${gameState.currentPrimaryLocationData.name}现在确实很美。说可以先去海滩逛逛，然后再去酒店办理入住。保持兴奋和理解的语气！`);
    
    setTimeout(async () => {
        await enterSecondaryLocation(1);
    }, 500);
}

async function goToNextPrimaryLocation() {
    const chatContainer = document.getElementById('chatContainer');
    const nextPrimaryIndex = gameState.currentPrimaryIndex + 1;
    
    if (nextPrimaryIndex >= gameState.primaryLocationsList.length) {
        return;
    }
    
    const nextPrimaryLocation = gameState.primaryLocationsList[nextPrimaryIndex];
    const prevPrimaryLocation = gameState.primaryLocationsList[gameState.currentPrimaryIndex];
    
    gameState.currentPrimaryIndex = nextPrimaryIndex;
    gameState.currentPrimaryLocationData = nextPrimaryLocation;
    gameState.secondaryLocations = gameState.secondaryLocationsPerPrimary[nextPrimaryIndex].map((loc, i) => ({
        ...loc,
        type: i === 0 ? "hotel" : "random",
        encounterProb: i === 0 ? 0.5 : (i === 1 ? 0.7 : 0.5),
        medalProb: i === 0 ? 0.5 : (i === 1 ? 0.7 : 0.5)
    }));
    gameState.currentSecondaryIndex = 0;
    gameState.conversationCount = 0;
    gameState.storyPhase = "toHotel";
    
    addPrimaryLocation(nextPrimaryLocation.name, nextPrimaryLocation.emoji, nextPrimaryLocation.description);
    
    document.querySelector('.scene-name').innerHTML = `
        <span>${nextPrimaryLocation.emoji}</span>
        <span>${nextPrimaryLocation.name}</span>
        <span>🌸</span>
    `;
    
    try {
        const arrivalPrompt = `你是旁白，描述主角到达${nextPrimaryLocation.name}的场景。主角是 20 岁的中国女大学生，第一次来夏威夷。请用第三人称旁白的方式：
1. 简单描述从${prevPrimaryLocation.name}到${nextPrimaryLocation.name}的旅程
2. 重点描述到达${nextPrimaryLocation.name}后看到的第一印象和美丽景色
3. 用生动的中文，让玩家有画面感
4. 不要包含人物对话，只是场景描述和旁白`;
        
        const arrivalText = await callAI(
            arrivalPrompt,
            "你是一个旁白叙述者，善于用生动的语言描绘美丽的夏威夷景色和场景转换。用第三人称旁白的方式描述。",
            300,
            0.9
        );
        
        const arrivalMessage = document.createElement('div');
        arrivalMessage.className = 'system-message';
        arrivalMessage.innerHTML = `
            <span style="font-weight: bold; color: #6a1b9a;">
                ${nextPrimaryLocation.emoji || '📍'} 到达${nextPrimaryLocation.name || '目的地'} ${nextPrimaryLocation.emoji || '📍'}<br><br>
                ${arrivalText.replace(/\n/g, '<br>')}
            </span>
        `;
        chatContainer.appendChild(arrivalMessage);
    } catch (error) {
        console.error("生成到达旁白失败:", error);
        const arrivalMessage = document.createElement('div');
        arrivalMessage.className = 'system-message';
        arrivalMessage.innerHTML = `
            <span style="font-weight: bold; color: #6a1b9a;">
                ${nextPrimaryLocation.emoji} 到达${nextPrimaryLocation.name} ${nextPrimaryLocation.emoji}<br><br>
                离开${prevPrimaryLocation.name}，经过一段美丽的旅程，你终于到达了${nextPrimaryLocation.name}！<br><br>
                ${nextPrimaryLocation.description}
            </span>
        `;
        chatContainer.appendChild(arrivalMessage);
    }
    
    await generateInnerMonologue(`终于到${nextPrimaryLocation.name}了！这里太美了！好期待接下来的冒险！`, "兴奋、期待、惊喜");
    
    const hotelForNext = gameState.secondaryLocations[0];
    addSecondaryLocation(nextPrimaryLocation.name, hotelForNext.name, hotelForNext.emoji, `${hotelForNext.name}，在${nextPrimaryLocation.name}附近的好住处。`);
    
    await window.generateNPCDialogue("导游 Lani", `作为导游 Lani，用英语兴奋地告诉游客我们已经到达${nextPrimaryLocation.name}了！惊叹一下这里的美景，然后说我们先去${hotelForNext.name}办理入住。保持热情和期待的语气！`);
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}


// ========== 11. 酒店入住流程 ==========
async function startHotelCheckIn() {
    const chatContainer = document.getElementById('chatContainer');
    gameState.currentSecondaryLocation = gameState.secondaryLocations[0];
    gameState.currentNpc = gameState.hotel.npc;
    gameState.conversationHistory = [];
    gameState.storyPhase = "hotelCheckIn";
    
    // 删除重复的场景描写，因为 goToHotel() 已经显示过了
    
    await generateInnerMonologue("终于到酒店了，看起来真不错！期待接下来的冒险！", "开心、期待、有点累但兴奋");
    const hotelDialoguePrompt = window.PROMPTS.HOTEL_CHECKIN_DIALOGUE.replace('[酒店名]', gameState.hotel.name);
    await window.generateNPCDialogue(gameState.hotel.npc, hotelDialoguePrompt);
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}


// ========== 12. 卢奥晚宴邀约 ==========
async function showLuauInvitation() {
    const chatContainer = document.getElementById('chatContainer');
    
    const receptionistEmoji = getNpcEmoji("前台接待员");
    displayNPCMessage(`${receptionistEmoji} 前台接待员`,
        "Aloha! By the way, we have a traditional Hawaiian Luau tonight! It starts at 6 PM on the beachfront lawn. You'll experience authentic Hawaiian culture - we roast a whole Kalua pig in the traditional underground imu oven, and you can enjoy poi, lomi lomi salmon, and haupia. There will be live Hawaiian music and hula dancing performances too! Many guests say it's the highlight of their trip. Would you like to join us? It's $89 per person, includes the full dinner feast and entertainment.",
        "Aloha！对了，我们今晚有传统的夏威夷卢奥晚宴！晚上 6 点在海滨草坪举办。您将体验地道的夏威夷文化——我们用传统的地下烤炉（imu）烤制整只卡鲁瓦猪，还可以享用芋头泥（poi）、罗密罗密三文鱼（lomi lomi salmon）和椰子布丁（haupia）。现场还有夏威夷音乐和草裙舞（hula）表演！很多客人都说这是他们旅行的亮点。您想参加吗？每位 89 美元，包含完整的晚宴和娱乐表演。");
    
    showLuauOptions();
}

function showLuauOptions() {
    showOptions([
        { 
            text: '🌺 留下来参加卢奥晚宴', 
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            onClick: async () => {
                await acceptLuauInvitation();
            }
        },
        { 
            text: '🏖️ 去海滩逛逛', 
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            onClick: async () => {
                await declineLuauInvitation();
            }
        }
    ]);
}

async function acceptLuauInvitation() {
    const chatContainer = document.getElementById('chatContainer');
    
    gameState.storyPhase = "dinner";
    gameState.conversationCount = 0;
    gameState.branchName = "夏威夷卢奥晚宴";
    gameState.currentLocationName = gameState.hotel.name;
    
    if (!gameState.branches) {
        gameState.branches = [];
    }
    gameState.branches.push({
        title: "夏威夷卢奥晚宴",
        description: "在传统的夏威夷卢奥晚宴上体验地道的文化和美食",
        status: "active",
        startTime: new Date().toLocaleString('zh-CN'),
        location: gameState.hotel.name
    });
    
    const message = document.createElement('div');
    message.className = 'system-message';
    message.innerHTML = `
        <span style="font-weight: bold; color: #6a1b9a;">
            🌺 卢奥晚宴 🌺<br><br>
            你选择了参加卢奥晚宴，体验夏威夷传统文化。<br><br>
            <em style="color: #888;">（晚宴功能开发中...）</em>
        </span>
    `;
    chatContainer.appendChild(message);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function declineLuauInvitation() {
    const chatContainer = document.getElementById('chatContainer');
    
    const receptionistEmoji2 = getNpcEmoji("前台接待员");
    displayNPCMessage(`${receptionistEmoji2} 前台接待员`,
        "No problem! The beach is just a short walk from here. Enjoy your time at Waikiki Beach! If you change your mind about the Luau, it's still going on until 9 PM.",
        "没问题！海滩离这里很近。祝你在威基基海滩玩得开心！如果你改变主意参加卢奥晚宴，它会一直持续到晚上 9 点。");
    
    setTimeout(async () => {
        if (!gameState.secondaryLocations || gameState.secondaryLocations.length === 0) {
            console.error("错误：secondaryLocations 未初始化");
            const errorMessage = document.createElement('div');
            errorMessage.className = 'system-message';
            errorMessage.innerHTML = `
                <span style="font-weight: bold; color: red;">
                    ⚠️ 错误：无法进入冲浪店<br><br>
                    请刷新页面重试。
                </span>
            `;
            chatContainer.appendChild(errorMessage);
            return;
        }
        
        await enterSecondaryLocation(1);
    }, 500);
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}


// ========== 13. 二级地点探索 ==========
async function enterSecondaryLocation(index) {
    const chatContainer = document.getElementById('chatContainer');
    
    if (!gameState.secondaryLocations || !gameState.secondaryLocations[index]) {
        console.error("错误：secondaryLocations 不存在或索引超出范围");
        console.log("gameState.secondaryLocations:", gameState.secondaryLocations);
        console.log("index:", index);
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'system-message';
        errorMessage.innerHTML = `
            <span style="font-weight: bold; color: red;">
                ⚠️ 错误：无法进入该地点<br><br>
                请刷新页面重试，或联系开发者。
            </span>
        `;
        chatContainer.appendChild(errorMessage);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return;
    }
    
    const location = gameState.secondaryLocations[index];
    const prevLocation = gameState.secondaryLocations[gameState.currentSecondaryIndex];
    
    console.log("进入二级地点:", location.name);
    console.log("location:", location);
    
    gameState.currentSecondaryIndex = index;
    gameState.currentSecondaryLocation = location;
    gameState.currentNpc = location.npc;
    gameState.conversationHistory = [];
    gameState.encounterProbability = location.encounterProb;
    gameState.medalProbability = location.medalProb;
    gameState.storyPhase = "secondaryLocation";
    
    const isSurfShop = location.name.includes('冲浪') || location.npc.toLowerCase().includes('surfer');
    
    console.log("=== 进入二级地点调试信息 ===");
    console.log("地点名称:", location.name);
    console.log("NPC 名称:", location.npc);
    console.log("是否冲浪店:", isSurfShop);
    console.log("storyPhase:", gameState.storyPhase);
    
    if (gameState.currentPrimaryLocationData) {
        addSecondaryLocation(
            gameState.currentPrimaryLocationData.name, 
            location.name, 
            location.emoji, 
            `${location.name}，可以和${location.npc}交流互动的好地方。`
        );
    }
    
    const systemMessage = document.createElement('div');
    systemMessage.className = 'system-message';
    systemMessage.innerHTML = `
        <span style="font-weight: bold; color: #6a1b9a;">
            ${location.emoji} ${location.name} ${location.emoji}<br><br>
            你来到了${location.name}，这里充满了夏威夷的独特魅力！
        </span>
    `;
    chatContainer.appendChild(systemMessage);
    
    await generateInnerMonologue(`来到了${location.name}，感觉这里好棒！不知道会遇到什么有趣的事情呢？`, "好奇、兴奋、期待");
    
    if (location.name === "冲浪店") {
        if (Math.random() < gameState.medalProbability) {
            await window.triggerSurfShopMedalEvent();
        }
    } else {
        if (Math.random() < gameState.medalProbability) {
            await triggerLocationMedal(location);
        }
    }
    
    if (isSurfShop) {
        gameState.storyPhase = "surfShopGirl";
        gameState.conversationCount = 0;
        
        const mayaCharacter = {
            name: "Maya",
            chineseName: "玛雅",
            nationality: "American",
            age: 20,
            occupation: "Surf Shop Assistant",
            emoji: "🏄‍♀️",
            personality: "随和友好，热爱冲浪，阳光开朗",
            scene: location.name,
            description: "冲浪店打工女孩，对冲浪很有研究"
        };
        
        // 使用统一函数保存固定 NPC
        saveFixedNpcToEncounters(mayaCharacter);
        
        gameState.currentNpc = "Maya";
        gameState.conversationHistory = [];
        
        addToNpcRoles(mayaCharacter);
        
        await window.generateNPCDialogue("Maya", `作为冲浪店的打工女孩 Maya，用英语随意友好地欢迎这位游客。说你在这里工作，对冲浪和冲浪装备都很在行。如果有任何问题都可以问你。语气要随和、阳光、像朋友一样。`);
    } else {
        await window.generateNPCDialogue(location.npc, `作为${location.name}的${location.npc}，用英语热情欢迎游客来到这里。介绍一下这个地方，然后询问游客想做什么或想看什么。保持友好、热情的态度。最后，可以自然地提到附近还有其他好玩的地方可以探索。`);
    }
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}


// ========== 14. 邀约系统（已移至 aigenerate/invitation.js）==========
// generateInvitation, selectBestLocation, saveInvitation, displayInvitation 已移至 invitation.js


// ========== 15. 剧情进度检查 ==========
async function checkStoryProgress(userInput, npcResponse) {
    if (gameState.storyPhase === "invitation_date") {
        gameState.dateConversationCount++;
        console.log("约会阶段 - 对话计数:", gameState.dateConversationCount);
        
        if (gameState.dateConversationCount >= 3) {
            const shouldEnd = gameState.dateConversationCount >= 5 || 
                             (gameState.dateConversationCount >= 3 && Math.random() < 0.5);
            
            if (shouldEnd) {
                console.log("约会结束");
                setTimeout(async () => {
                    await completeDate();
                }, 1000);
            }
        }
        return;
    }
    
    if (gameState.storyPhase === "guide") {
        console.log("导游阶段 - 对话计数:", gameState.conversationCount);
        if (gameState.conversationCount >= 1) {
            console.log("第一轮对话结束，准备生成行程");
            setTimeout(async () => {
                await generateLocationsAndItinerary();
            }, 1000);
        }
        return;
    }
    
    if (gameState.storyPhase === "hotelCheckIn") {
        console.log("酒店入住阶段 - 对话计数:", gameState.conversationCount);
        if (gameState.conversationCount >= 2 && !gameState.luauInvitationShown) {
            console.log("酒店对话达到 2 轮，准备介绍卢奥晚宴");
            gameState.luauInvitationShown = true;
            setTimeout(async () => {
                if (!gameState.secondaryLocations || gameState.secondaryLocations.length === 0) {
                    const itineraryData = {
                        primaryLocations: [
                            { name: "威基基海滩", emoji: "🏖️", description: "世界著名的海滩，冲浪和日光浴的天堂" },
                            { name: "钻石头山", emoji: "🌋", description: "夏威夷的标志性地标，可俯瞰全景" },
                            { name: "珍珠港", emoji: "⚓", description: "历史遗迹，二战纪念馆" },
                            { name: "古兰尼牧场", emoji: "🏞️", description: "热带雨林和山谷风光" }
                        ],
                        hotel: { name: "威基基海滩酒店", description: "位于海滩边的豪华酒店", npc: "前台接待员" },
                        secondaryLocationsPerPrimary: [
                            [{ name: "威基基海滩酒店", emoji: "🏨", npc: "前台接待员" }, { name: "冲浪店", emoji: "🏄", npc: "酷酷的女孩" }, { name: "海边餐厅", emoji: "🍹", npc: "餐厅服务员" }],
                            [{ name: "观景台", emoji: "📸" }, { name: "登山步道", emoji: "🥾" }, { name: "纪念品店", emoji: "🎁" }],
                            [{ name: "博物馆", emoji: "🏛️" }, { name: "游客中心", emoji: "ℹ️" }, { name: "码头", emoji: "⚓" }],
                            [{ name: "探险中心", emoji: "🏕️" }, { name: "骑马场", emoji: "🐎" }, { name: "瀑布观景点", emoji: "💦" }]
                        ]
                    };
                    
                    console.log("使用 fallback 数据，第一个一级地点:", itineraryData.primaryLocations[0]);
                    
                    gameState.primaryLocationsList = itineraryData.primaryLocations;
                    gameState.secondaryLocationsPerPrimary = itineraryData.secondaryLocationsPerPrimary;
                    gameState.currentPrimaryLocationData = itineraryData.primaryLocations[0];
                    gameState.hotel = itineraryData.hotel;
                    gameState.secondaryLocations = itineraryData.secondaryLocationsPerPrimary[0].map((loc, i) => ({
                        ...loc,
                        type: i === 0 ? "hotel" : "random",
                        encounterProb: i === 0 ? 1.0 : (i === 1 ? 1.0 : 0),
                        medalProb: i === 0 ? 0 : (i === 1 ? 0.7 : 1.0)
                    }));
                    
                    // 验证 currentPrimaryLocationData 是否正确设置
                    if (!gameState.currentPrimaryLocationData || !gameState.currentPrimaryLocationData.name) {
                        console.error("fallback 时 currentPrimaryLocationData 设置失败！", gameState.currentPrimaryLocationData);
                        gameState.currentPrimaryLocationData = { name: "威基基海滩", emoji: "🏖️", description: "世界著名的海滩，冲浪和日光浴的天堂" };
                    }
                }
                
                await showLuauInvitation();
            }, 1000);
        }
        return;
    }
    
    if (isQuestion(npcResponse)) {
        return;
    }
    
    const playerFarewellKeywords = [
        'bye', 'goodbye', 'see you', 'later', 'take care',
        '拜拜', '再见', '先走了', '下次见', '回见'
    ];
    
    // ========== 全局对话结束检测 ==========
    // 使用统一的 shouldEndConversation 函数
    const endCheck = window.shouldEndConversation(npcResponse, userInput, {
        currentTurns: gameState.conversationCount,
        minTurns: 0,
        maxTurns: 6,
        requireFarewell: false
    });
    
    console.log("全局对话结束检测:", endCheck);
    
    if (gameState.storyPhase === "customs") {
        if (endCheck.shouldEnd) {
            // 显示带省略号动画的加载提示
            const chatContainer = document.getElementById('chatContainer');
            const loadingMessage = document.createElement('div');
            loadingMessage.className = 'system-message';
            loadingMessage.id = 'airportLoading';
            loadingMessage.style.cssText = `
                background: transparent;
                border: none;
                box-shadow: none;
                padding: 10px 0;
                text-align: center;
            `;
            loadingMessage.innerHTML = `
                <span id="loadingDots" style="display: inline-block; font-size: 24px; font-weight: bold; color: #6a1b9a;"></span>
            `;
            chatContainer.appendChild(loadingMessage);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            // 省略号动画
            let dotCount = 0;
            const dotAnimation = setInterval(() => {
                dotCount = (dotCount + 1) % 7;
                const dotsElement = document.getElementById('loadingDots');
                if (dotsElement) {
                    const maxDots = 6;
                    const displayDots = dotCount <= maxDots ? dotCount : maxDots - (dotCount - maxDots);
                    dotsElement.textContent = '.'.repeat(displayDots);
                }
            }, 400);
            
            // 海关结束后触发机场事件，减少延迟
            setTimeout(async () => {
                await triggerAirportRandomEvent();
                
                // 停止省略号动画并移除加载提示
                clearInterval(dotAnimation);
                const loadingEl = document.getElementById('airportLoading');
                if (loadingEl) {
                    loadingEl.remove();
                }
            }, 100);  // 从 500ms 减少到 100ms
        }
    } else if (gameState.storyPhase === "guide") {
        console.log("导游阶段 - 对话计数:", gameState.conversationCount);
        if (gameState.conversationCount >= 3) {
            console.log("对话达到 3 轮，准备生成行程");
            setTimeout(async () => {
                console.log("开始生成行程...");
                await generateItinerary();
            }, 500);
        }
    } else if (gameState.storyPhase === "encounter") {
        // 邂逅对话：使用增强的全局检测
        console.log("=== 邂逅对话阶段（使用全局检测）===");
        console.log("当前对话轮数:", gameState.conversationCount);
        console.log("当前 NPC:", gameState.currentNpc);
        
        if (gameState.conversationCount < 1) {
            console.log("对话轮数不足，继续对话");
            return;
        }
        
        // 使用增强的邂逅检测配置
        const encounterEndCheck = window.shouldEndConversation(npcResponse, userInput, {
            currentTurns: gameState.conversationCount,
            minTurns: 1,
            maxTurns: 6,
            requireFarewell: true  // 邂逅需要告别词
        });
        
        console.log("邂逅对话检测:", encounterEndCheck);
        
        // 检测到告别，准备结束邂逅
        if (encounterEndCheck.shouldEnd) {
            console.log("检测到告别，准备结束邂逅");
            console.log("结束原因:", encounterEndCheck.reason);
            console.log("详细信息:", encounterEndCheck.details);
            
            // 保存 NPC 姓名用于后续发送邀约短信
            const npcName = gameState.currentNpc;
            
            // 方案 1：立即禁用输入框
            const userInput = document.getElementById('userInput');
            const sendButton = document.querySelector('.send-btn');
            if (userInput) {
                userInput.disabled = true;
                userInput.placeholder = "";
            }
            if (sendButton) {
                sendButton.disabled = true;
                sendButton.style.opacity = "0.5";
                sendButton.style.cursor = "not-allowed";
            }
            
            // 方案 2：显示优雅的加载动画（转圈圈）
            const chatContainer = document.getElementById('chatContainer');
            const loadingMessage = document.createElement('div');
            loadingMessage.className = 'system-message';
            loadingMessage.id = 'transitionLoading';
            loadingMessage.style.cssText = `
                background: transparent;
                border: none;
                box-shadow: none;
                padding: 10px 0;
                text-align: center;
            `;
            loadingMessage.innerHTML = `
                <div style="display: inline-block; width: 24px; height: 24px; border: 3px solid #e0e0e0; border-top-color: #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            `;
            chatContainer.appendChild(loadingMessage);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            setTimeout(async () => {
                gameState.currentNpc = null;
                
                console.log("机场邂逅结束，遇到导游");
                await meetGuide();
                
                // 恢复输入框
                if (userInput) {
                    userInput.disabled = false;
                    userInput.placeholder = "输入消息...";
                    userInput.focus();
                }
                if (sendButton) {
                    sendButton.disabled = false;
                    sendButton.style.opacity = "1";
                    sendButton.style.cursor = "pointer";
                }
                
                // 移除加载动画
                const loadingEl = document.getElementById('transitionLoading');
                if (loadingEl) {
                    loadingEl.remove();
                }
                
                // 延迟 2 秒后发送邀约短信
                setTimeout(async () => {
                    const npcEncounter = gameState.encounters.find(e => e.name === npcName);
                    await window.triggerEncounterInvitationSMS(npcEncounter, gameState.conversationHistory);
                }, 2000);
            }, 1000);
            
            return;
        }
        
        // 如果没有满足结束条件，继续正常对话
        console.log("继续邂逅对话...");
    } else if (gameState.storyPhase === "medal") {
        // 成就事件对话：使用和邂逅一样的逻辑（需要告别词）
        console.log("=== 成就事件对话阶段 ===");
        console.log("当前对话轮数:", gameState.conversationCount);
        console.log("当前 NPC:", gameState.currentNpc);
        
        if (gameState.conversationCount < 1) {
            console.log("对话轮数不足，继续对话");
            return;
        }
        
        // 使用邂逅检测配置
        const medalEndCheck = window.shouldEndConversation(npcResponse, userInput, {
            currentTurns: gameState.conversationCount,
            minTurns: 1,
            maxTurns: 6,
            requireFarewell: true  // 需要告别词
        });
        
        console.log("成就事件对话检测:", medalEndCheck);
        
        // 检测到告别，准备结束成就事件
        if (medalEndCheck.shouldEnd) {
            console.log("检测到告别，准备结束成就事件");
            console.log("结束原因:", medalEndCheck.reason);
            
            // 方案 1：立即禁用输入框
            const userInput = document.getElementById('userInput');
            const sendButton = document.querySelector('.send-btn');
            if (userInput) {
                userInput.disabled = true;
                userInput.placeholder = "";
            }
            if (sendButton) {
                sendButton.disabled = true;
                sendButton.style.opacity = "0.5";
                sendButton.style.cursor = "not-allowed";
            }
            
            // 方案 2：显示优雅的加载动画（转圈圈）
            const chatContainer = document.getElementById('chatContainer');
            const loadingMessage = document.createElement('div');
            loadingMessage.className = 'system-message';
            loadingMessage.id = 'transitionLoading';
            loadingMessage.style.cssText = `
                background: transparent;
                border: none;
                box-shadow: none;
                padding: 10px 0;
                text-align: center;
            `;
            loadingMessage.innerHTML = `
                <div style="display: inline-block; width: 24px; height: 24px; border: 3px solid #e0e0e0; border-top-color: #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            `;
            chatContainer.appendChild(loadingMessage);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            setTimeout(async () => {
                gameState.currentNpc = null;
                
                console.log("成就事件结束，遇到导游");
                await meetGuide();
                
                // 恢复输入框
                if (userInput) {
                    userInput.disabled = false;
                    userInput.placeholder = "输入消息...";
                    userInput.focus();
                }
                if (sendButton) {
                    sendButton.disabled = false;
                    sendButton.style.opacity = "1";
                    sendButton.style.cursor = "pointer";
                }
                
                // 移除加载动画
                const loadingEl = document.getElementById('transitionLoading');
                if (loadingEl) {
                    loadingEl.remove();
                }
                
                // 延迟 2 秒后发送邀约短信
                setTimeout(async () => {
                    const npcEncounter = gameState.encounters.find(e => e.name === npcName);
                    await window.triggerEncounterInvitationSMS(npcEncounter, conversationHistory);
                }, 2000);
            }, 1000);
            
            return;
        }
        
        // 如果没有满足结束条件，继续正常对话
        console.log("继续成就事件对话...");
    } else if (gameState.storyPhase === "toHotel") {
        if (endCheck.shouldEnd) {
            setTimeout(async () => {
                await startHotelCheckIn();
            }, 1000);
        }
    } else if (gameState.storyPhase === "hotelCheckIn") {
        if (endCheck.shouldEnd && gameState.conversationCount >= 3) {
            setTimeout(async () => {
                const nextLocation = gameState.secondaryLocations[1];
                await enterSecondaryLocation(1);
            }, 100);
        }
    } else if (gameState.storyPhase === "secondaryLocation") {
        // 使用全局检测，配置：最小 4 轮，最大 6 轮
        const locationEndCheck = window.shouldEndConversation(npcResponse, userInput, {
            currentTurns: gameState.conversationCount,
            minTurns: 4,
            maxTurns: 6,
            requireFarewell: false
        });
        
        if (locationEndCheck.shouldEnd) {
            console.log("二级地点对话结束检测:", locationEndCheck);
            const nextSecondaryIndex = gameState.currentSecondaryIndex + 1;
            if (nextSecondaryIndex < gameState.secondaryLocations.length) {
                setTimeout(async () => {
                    await enterSecondaryLocation(nextSecondaryIndex);
                }, 100);
            } else {
                console.log("所有二级地点探索完毕，旅程结束");
                const endMessage = document.createElement('div');
                endMessage.className = 'system-message';
                endMessage.innerHTML = `
                    <span style="font-weight: bold; color: #6a1b9a;">
                        🌺 旅程结束 🌺<br><br>
                        你的夏威夷之旅已经圆满完成！你探索了美丽的景点，遇到了有趣的人，收获了珍贵的回忆。<br><br>
                        希望这次旅行不仅让你提升了英语口语能力，也让你感受到了夏威夷的独特魅力。期待你下次再来！
                    </span>
                `;
                document.getElementById('chatContainer').appendChild(endMessage);
                document.getElementById('chatContainer').scrollTop = document.getElementById('chatContainer').scrollHeight;
            }
        }
    }
}

// ========== 主页功能 ==========
/**
 * 显示主页面板
 */
function showHome() {
    const homePanel = document.getElementById('homePanel');
    if (!homePanel) {
        console.error('Home panel not found');
        return;
    }
    
    const homePlayerName = document.getElementById('homePlayerName');
    const visitedCount = document.getElementById('visitedCount');
    const encounterCount = document.getElementById('encounterCount');
    const notebookCount = document.getElementById('notebookCount');
    const medalCount = document.getElementById('medalCount');
    const gameProgressBar = document.getElementById('gameProgressBar');
    const gameProgressText = document.getElementById('gameProgressText');
    const currentLocationInfo = document.getElementById('currentLocationInfo');
    
    // 更新玩家名字
    if (homePlayerName && gameState.player) {
        homePlayerName.textContent = gameState.player.name || "游客";
    }
    
    // 更新统计数据
    if (visitedCount) visitedCount.textContent = gameState.locations ? gameState.locations.length : 0;
    if (encounterCount) encounterCount.textContent = gameState.encounters ? gameState.encounters.length : 0;
    if (notebookCount) notebookCount.textContent = gameState.notebook ? gameState.notebook.length : 0;
    if (medalCount) medalCount.textContent = gameState.medals ? gameState.medals.length : 0;
    
    // 计算游戏进度（基于已访问的主要地点数量）
    const totalPrimaryLocations = 5; // 假设总共有 5 个主要地点
    const progressPercentage = Math.min(100, Math.round((gameState.currentPrimaryIndex / totalPrimaryLocations) * 100));
    if (gameProgressBar) {
        gameProgressBar.style.width = progressPercentage + '%';
    }
    
    // 更新进度文字
    let progressText = "刚刚开始";
    if (progressPercentage === 0) {
        progressText = "刚刚开始";
    } else if (progressPercentage <= 20) {
        progressText = "探索中...";
    } else if (progressPercentage <= 40) {
        progressText = "渐入佳境";
    } else if (progressPercentage <= 60) {
        progressText = "半途而废？不存在的！";
    } else if (progressPercentage <= 80) {
        progressText = "接近尾声";
    } else {
        progressText = "即将完成！";
    }
    if (gameProgressText) {
        gameProgressText.textContent = progressText;
    }
    
    // 更新当前位置
    let currentLocationEmoji = "🌺";
    let currentLocationName = "尚未开始";
    
    if (gameState.currentSecondaryLocation) {
        currentLocationName = gameState.currentSecondaryLocation;
        // 根据地点名称设置 emoji
        if (gameState.currentSecondaryLocation.includes("海关")) {
            currentLocationEmoji = "🛂";
        } else if (gameState.currentSecondaryLocation.includes("大厅")) {
            currentLocationEmoji = "🌺";
        } else if (gameState.currentSecondaryLocation.includes("海滩")) {
            currentLocationEmoji = "🏖️";
        } else if (gameState.currentSecondaryLocation.includes("酒店")) {
            currentLocationEmoji = "🏨";
        } else if (gameState.currentSecondaryLocation.includes("机场")) {
            currentLocationEmoji = "✈️";
        }
    } else if (gameState.currentPrimaryLocation) {
        currentLocationName = primaryLocations[gameState.currentPrimaryLocation]?.name || "未知地点";
    }
    
    if (currentLocationInfo) {
        currentLocationInfo.innerHTML = `
            <span class="location-emoji">${currentLocationEmoji}</span>
            <span class="location-name">${currentLocationName}</span>
        `;
    }
    
    // 显示主页面板
    homePanel.style.display = 'flex';
}

/**
 * 关闭主页面板
 */
function closeHome() {
    const homePanel = document.getElementById('homePanel');
    homePanel.style.display = 'none';
}

// 监听 ESC 键关闭主页
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const homePanel = document.getElementById('homePanel');
        if (homePanel && homePanel.style.display !== 'none') {
            closeHome();
        }
    }
});

console.log("Game module loaded ✓");
