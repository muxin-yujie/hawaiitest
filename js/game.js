﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿// ========== 1. 游戏开场流程 ==========

// 启动海关场景（游戏第一个场景）
async function startCustomsScene() {
    const chatContainer = getChatContainer();
    chatContainer.innerHTML = '';
    
    // 设置游戏状态
    设置状态({
        currentPrimaryLocation: "airport",
        currentSecondaryLocation: "海关",
        currentNpc: "海关官员",
        storyPhase: "customs"
    });
    
    addPrimaryLocation("檀香山国际机场", "✈️", "夏威夷的主要国际机场，开启美好旅程的第一站。");
    
    // 显示音乐就绪提示
    showToast("点击下方功能栏的 🎵 Music 按钮享受音乐", "🎵");
    
    setTimeout(() => {
        紫色场景切换 (
            '✈️',
            '抵达夏威夷',
            '飞机缓缓降落在檀香山国际机场，窗外是湛蓝的天空和连绵的山脉。你透过窗户看到远处的大海在阳光下闪闪发光，内心激动不已。<br><br>走下飞机，你随着人流走向海关检查区。这是你第一次独自出国旅行，既紧张又兴奋。<br><br>"终于到夏威夷了！"你心里默念着，"希望能在这里收获美好的回忆和提升英语口语。"'
        );
        
        setTimeout(async () => {
            await window.generateNPCDialogue("海关官员", "作为檀香山国际机场的海关官员，用英语专业但友善地欢迎游客入境，简单询问一些轻松的入境问题（比如来夏威夷的目的），保持专业但温暖的态度。");
        }, 50);
    }, 300);
}

// 机场随机事件
async function triggerAirportRandomEvent() {
    console.log("=== 触发机场随机事件 ===");

    const isEncounter = Math.random() < 0.5;
    console.log("随机事件类型:", isEncounter ? "邂逅" : "成就");
    
    if (isEncounter) {
        await window.triggerAirportEncounter();
    } else {
        await window.triggerAirportMedalEvent();
    }
}

// 遇到导游
async function meetGuide() {
    console.log("=== 遇到导游 Lani ===");
    
    // 设置游戏状态
    设置状态({
        storyPhase: "guide",
        currentNpc: "导游 Lani"
    });
    
    const laniCharacter = window.getFixedNpc("导游 Lani");
    
    saveFixedNpcToEncounters(laniCharacter);
    
    const arrivalText = "你走出机场到达大厅，看到一个美丽的夏威夷女孩举着写有你名字的牌子，脸上洋溢着热情的笑容。她就是你的导游 Lani，穿着传统的夏威夷花裙，脖子上戴着花环。";
    showSceneNarration("遇到导游 Lani", arrivalText);
    
    await generateInnerMonologue("哇，这就是 Lani！好热情好漂亮啊！接下来的旅程一定会很精彩！", "兴奋、期待、开心");
    
    const guideDialoguePrompt = window.PROMPTS.GUIDE_FIRST_MEET;
    await window.generateNPCDialogue("导游 Lani", guideDialoguePrompt);
}


// 生成行程
async function generateLocationsAndItinerary() {
    const laniEmoji = getNpcEmoji("导游 Lani");
    displayNPCMessage(`${laniEmoji} 导游 Lani`, 
        "Aloha! Now let me introduce your wonderful 4-day Hawaii itinerary! We'll visit Waikiki Beach for surfing and shopping, climb Diamond Head for panoramic views, experience Polynesian culture with traditional hula and fire knife dancing, and explore Kualoa Ranch where many Hollywood movies were filmed! I've booked you at the Waikiki Beach Hotel. Are you ready for this amazing adventure?",
        "Aloha! 现在让我为你介绍这次精彩的夏威夷 4 日游行程！我们会去：威基基海滩冲浪和购物，攀登钻石头山俯瞰全景，在波利尼西亚文化中心体验传统的草裙舞和火刀舞表演，还会去古兰尼牧场探索好莱坞电影的取景地！我已经为你预订了威基基海滩酒店。准备好开启这段美妙的冒险了吗？");
    
    setTimeout(async () => {
        await generateItinerary();
    }, 500);
}

async function generateItinerary() {
    const itineraryData = ITINERARY_DATA;
    
    gameState.primaryLocationsList = itineraryData.primaryLocations;
    gameState.secondaryLocationsPerPrimary = itineraryData.secondaryLocationsPerPrimary;
    gameState.currentPrimaryLocationData = itineraryData.primaryLocations[0];
    gameState.hotel = itineraryData.hotel;
    gameState.secondaryLocations = itineraryData.secondaryLocationsPerPrimary[0].map((loc, i) => ({
        ...loc,
        type: i === 0 ? "hotel" : "random",
    }));
    
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
    
    紫色场景切换 ('📋', '行程安排', itineraryText);
    
    // 显示选项
    选择 (
        '🏨 先去酒店办理入住',
        async () => { await goToHotel(); },
        '🏖️ 先去海滩看看',
        async () => { await goToBeachFirst(); }
    );
}


// 去酒店
async function goToHotel() {
    const primaryName = gameState.currentPrimaryLocationData.name;
    const primaryEmoji = gameState.currentPrimaryLocationData.emoji;
    const primaryDesc = gameState.currentPrimaryLocationData.description;
    addPrimaryLocation(primaryName, primaryEmoji, primaryDesc);
    
    const hotel = gameState.hotel;
    const hotelEmoji = hotel.emoji || getLocationEmoji("酒店");
    addSecondaryLocation(primaryName, hotel.name, hotelEmoji, hotel.description);
    
    const hotelWithEmoji = {
        ...hotel,
        emoji: hotelEmoji,
        type: "hotel"
    };
    
    // 更新场景名称
    更新场景名 (hotelWithEmoji.emoji, hotelWithEmoji.name);
    
    setTimeout(() => {
        紫色场景切换(
            '🏨',
            `到达 ${hotelWithEmoji.name}`,
            '离开檀香山国际机场，沿着卡拉卡瓦大道行驶，繁华的威基基街区逐渐映入眼帘。高大的棕榈树在街道两旁摇曳，时尚的商店和餐厅林立。当你抵达酒店大堂时，清新的海风从敞开的窗户吹进来，带着淡淡的热带花香。前台工作人员微笑着迎接你，准备为你办理入住手续。'
        );
    }, 100);
    
    window.generateNPCDialogue("导游 Lani", `作为导游 Lani，用英语兴奋地告诉游客我们现在就去酒店办理入住。说酒店已经准备好了，办理完入住后可以好好休息一下，然后开始探索${gameState.currentPrimaryLocationData.name}。保持热情和期待的语气！`);
    
    setTimeout(async () => {
        await startHotelCheckIn();
    }, 500);
}

async function goToBeachFirst() {
    addPrimaryLocation(gameState.currentPrimaryLocationData.name, gameState.currentPrimaryLocationData.emoji, gameState.currentPrimaryLocationData.description);
    
    const beachLocation = gameState.secondaryLocationsPerPrimary[0][1];
    const beachEmoji = beachLocation.emoji || getLocationEmoji("海滩");
    addSecondaryLocation(
        gameState.currentPrimaryLocationData.name,
        beachLocation.name,
        beachEmoji,
        beachLocation.description
    );
    
    更新场景名 (beachEmoji, beachLocation.name);
    
    setTimeout(() => {
        紫色场景切换 (
            '🏖️',
            '到达威基基海滩',
            '离开檀香山国际机场，沿着卡拉卡瓦大道行驶，蔚蓝的太平洋逐渐映入眼帘。当你踏上威基基海滩时，金色的阳光洒在细腻的白沙上，椰子树在微风中轻轻摇曳。远处，冲浪者在碧波荡漾的海面上乘风破浪，空气中弥漫着淡淡的海盐和鸡蛋花香。'
        );
    }, 100);
    
    window.generateNPCDialogue("导游 Lani", `作为导游 Lani，用英语惊喜地说游客真会选，${gameState.currentPrimaryLocationData.name}现在确实很美。说可以先去海滩逛逛，然后再去酒店办理入住。保持兴奋和理解的语气！`);
    
    // 显示 3 个地点选项，让玩家选择
    setTimeout(() => {
        showOptions([
            { text: '🏄‍♀️ 去冲浪店看看', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', onClick: async () => await visitBeachLocation("冲浪店") },
            { text: '🌺 去花环编织店逛逛', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', onClick: async () => await visitBeachLocation("热带花环编织店") },
            { text: '🎵 去尤克里里音乐教室', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', onClick: async () => await visitBeachLocation("尤克里里音乐教室") }
        ]);
    }, 1000);
}

// ========== 2. 海滩地点相关 ==========

/**
 * 访问海滩的三级地点（玩家选择的地点）
 * @param {string} locationName - 地点名称
 */
async function visitBeachLocation(locationName) {
    const chatContainer = getChatContainer();
    
    if (!gameState.secondaryLocationsPerPrimary || !gameState.secondaryLocationsPerPrimary[0]) {
        const itineraryData = window.ITINERARY_DATA;
        if (itineraryData) {
            gameState.secondaryLocationsPerPrimary = itineraryData.secondaryLocationsPerPrimary;
        } else {
            logError('Game.visitBeachLocation', '无法获取行程数据');
            ErrorHandler.showToast('行程数据加载失败', 'error');
            return;
        }
    }
    
    const beachData = gameState.secondaryLocationsPerPrimary[0][1];
    const allTertiaryLocations = beachData?.tertiaryLocations || [];
    
    const selectedLocation = allTertiaryLocations.find(loc => loc.name === locationName);
    
    addTertiaryLocation(
        beachData.name,
        selectedLocation.name,
        selectedLocation.emoji,
        selectedLocation.description
    );
    
    设置状态 ({
        currentTertiaryLocation: selectedLocation.name,
        currentNpc: selectedLocation.npc,
        storyPhase: selectedLocation.hasStory ? "surfShop" : "tertiary_visit"
    });
    
    紫色场景切换 (
        selectedLocation.emoji,
        selectedLocation.name,
        `你走进了这家${selectedLocation.name}。<br>${selectedLocation.description}。<br>你决定进去看看...`
    );
    
    const npcCharacter = window.getFixedNpc(selectedLocation.npc);
    saveFixedNpcToEncounters(npcCharacter);
    
    if (selectedLocation.name === "冲浪店") {
        setTimeout(async () => {
            await enterSurfShop();
        }, 500);
    } else {
        setTimeout(async () => {
            const prompt = `作为${selectedLocation.npcTitle} ${selectedLocation.npc}，用英语热情欢迎这位独自来到${selectedLocation.name}的游客。
            介绍一下你的${selectedLocation.name}，然后询问游客想体验什么。
            语气要${selectedLocation.name === "热带花环编织店" ? "温柔、有艺术气质" : "阳光、幽默"}。`;
            
            await window.generateNPCDialogue(selectedLocation.npc, prompt);
        }, 500);
    }
}

// 处理三级地点访问结束，触发 Koa 邂逅
async function handleTertiaryVisitEnd() {
    if (gameState.koaEncounterTriggered) {
        return;
    }
    gameState.koaEncounterTriggered = true;
    
    if (window.generateSurfShopRomance) {
        await window.generateSurfShopRomance({ name: "威基基海滩" });
    }
}

// ========== 3. Koa 约会相关 ==========

// 显示海边酒吧邀请选项
function showBeachBarInvitationOptions() {
    选择 (
        '✨ 好啊，听起来很有趣！',
        async () => { await acceptBeachBarInvitation(); },
        '🌊 谢谢，不过我还有别的安排',
        async () => { await declineBeachBarInvitation(); },
        {
            gradient2: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
        }
    );
}

// 接受海边酒吧邀请
async function acceptBeachBarInvitation() {
    // 恢复输入框
    恢复输入框 ();
    
    // 显示接受后的场景
    const acceptMessage = document.createElement('div');
    acceptMessage.className = 'system-message';
    acceptMessage.innerHTML = `
        <span style="font-weight: bold; color: #6a1b9a;">
            🍹 Duke's Waikiki 🍹<br><br>
            "Awesome!" Koa 的眼睛亮了起来，露出灿烂的笑容。<br><br>
            他掏出手机，"Let me text you the address. It's right on the beach, you can't miss it."<br><br>
            收到他的短信后，你看了看时间，准备稍后前往。<br><br>
            <em style="color: #888;">（前往 Duke's Waikiki 海边酒吧）</em>
        </span>
    `;
    chatContainer.appendChild(acceptMessage);
    
    // 进入 Duke's Waikiki 约会
    setTimeout(async () => {
        await dukesWaikikiDate();
    }, 1500);
}

// 拒绝海边酒吧邀请
async function declineBeachBarInvitation() {
    // 恢复输入框
    恢复输入框 ();
    
    // 显示拒绝后的场景
    const declineMessage = document.createElement('div');
    declineMessage.className = 'system-message';
    declineMessage.innerHTML = `
        <span style="font-weight: bold; color: #6a1b9a;">
            🌺 婉拒邀请 🌺<br><br>
            "No worries! Maybe another time." Koa 依然保持着友好的笑容，<br>
            虽然眼中闪过一丝不易察觉的失落。<br><br>
            他挥挥手，"Enjoy the rest of your day!"<br><br>
            你微笑着告别，继续在威基基海滩漫步...<br><br>
            <em style="color: #888;">（继续海滩探索）</em>
        </span>
    `;
    chatContainer.appendChild(declineMessage);
    
    // 拒绝后：显示美食地点选项（烤虾车/刨冰店二选一）
    setTimeout(() => {
        showOptions([
            { text: '🍦 去彩虹刨冰店', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', onClick: async () => await enterFoodTruckMedal(gameState.secondaryLocationsPerPrimary[0][1].tertiaryLocations.find(loc => loc.name === "彩虹刨冰店")) },
            { text: '🍤 去阿罗哈烤虾车', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', onClick: async () => await enterFoodTruckMedal(gameState.secondaryLocationsPerPrimary[0][1].tertiaryLocations.find(loc => loc.name === "阿罗哈烤虾车")) }
        ]);
    }, 1000);
}

// Duke's Waikiki 海边酒吧约会
async function dukesWaikikiDate() {
    // 设置游戏状态
    设置状态 ({
        currentTertiaryLocation: "Duke's Waikiki",
        currentNpc: "Koa",
        storyPhase: "Duke's Waikiki"
    });
    gameState.dateConversationCount = 0;
    
    紫色场景切换 (
        '🍹',
        "Duke's Waikiki",
        '傍晚时分，你来到了位于威基基海滩的 Duke\'s Waikiki。<br>夕阳将海面染成金红色，海风轻拂，棕榈树在微风中摇曳。<br><br>酒吧里已经热闹非凡，现场乐队演奏着轻松的夏威夷音乐，<br>空气中弥漫着热带鸡尾酒和烤海鲜的香气。<br><br>你一眼就看到了站在露台上的 Koa，<br>他穿着休闲的夏威夷衬衫，手里拿着两杯色彩缤纷的饮料，<br>看到你到来，他的脸上绽放出灿烂的笑容...<br><br><em style="color: #888;">一场浪漫的海边约会即将开始</em>'
    );
    
    // 显示鸡尾酒菜单（延迟一点，等场景切换完成）
    setTimeout(() => {
        if (window.showCocktailMenu) {
            window.showCocktailMenu();
        }
    }, 1500);
    
    // 注意：Koa 的第一条对话由 controlDukesDate() 在用户第一次输入后生成
    // 这样可以避免连续生成两条的问题
}

/**
 * Duke's Waikiki 约会对话控制（控制对话轮数和剧情进展）
 * 基于用户输入生成自然的回应，同时引导剧情发展
 */
async function controlDukesDate(userInput, npcResponse) {
    // 如果是第 0 轮（刚开始约会），让 Koa 主动开场
    if (gameState.dateConversationCount === 0) {
        setTimeout(async () => {
            await window.generateNPCDialogue("Koa", `作为 Koa，看到主角如约而至，用英语兴奋地打招呼。说你很高兴对方能来，递上一杯蓝色的夏威夷鸡尾酒（Blue Hawaii），说这是你最喜欢的饮料。然后邀请对方到露台上欣赏日落。语气要开心、热情、真诚。`);
        }, 1000);
        gameState.dateConversationCount++;
        return;
    }
    
    gameState.dateConversationCount++;
    console.log("=== Duke's Waikiki 约会对话 ===");
    console.log("当前对话轮数:", gameState.dateConversationCount);
    console.log("用户输入:", userInput);
    
    // 检查是否应该结束约会（第 6 轮后检测告别）
    if (gameState.dateConversationCount >= 6) {
        const endCheck = shouldEndConversation(npcResponse, userInput, {
            currentTurns: gameState.dateConversationCount,
            minTurns: 6,
            maxTurns: 10,
            requireFarewell: true
        });
        
        if (endCheck.shouldEnd) {
            console.log("Duke's Waikiki 约会结束，回酒店");
            
            // 禁用输入框
            const userInputEl = document.getElementById('userInput');
            const sendButton = document.querySelector('.send-btn');
            if (userInputEl) {
                userInputEl.disabled = true;
                userInputEl.placeholder = "";
            }
            if (sendButton) {
                sendButton.disabled = true;
                sendButton.style.opacity = "0.5";
                sendButton.style.cursor = "not-allowed";
            }
            
            // 显示加载动画
            const chatContainer = document.getElementById('chatContainer');
            const loadingMessage = document.createElement('div');
            loadingMessage.className = 'system-message';
            loadingMessage.id = 'transitionLoading';
            loadingMessage.innerHTML = `
                <div style="display: inline-block; width: 24px; height: 24px; border: 3px solid #e0e0e0; border-top-color: #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            `;
            chatContainer.appendChild(loadingMessage);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            setTimeout(async () => {
                设置状态 ({
                    currentNpc: null
                });
                
                console.log("Duke's Waikiki 约会结束，回酒店房间");
                
                await returnToHotelRoom();
            }, 1000);
            return;
        }
    }
    
    // 基于用户输入生成自然回应，同时引导话题
    // Koa 会先回应用户的话，然后自然地引入新话题
    setTimeout(async () => {
        let prompt = '';
        
        // 第 1-2 轮：轻松破冰，聊饮料、景色、音乐
        if (gameState.dateConversationCount <= 2) {
            prompt = `作为 Koa，在和主角约会时轻松愉快地聊天。话题可以包括：
- Blue Hawaii 鸡尾酒的味道
- Duke's Waikiki 的美景和氛围
- 现场乐队演奏的夏威夷音乐
- 夏威夷的文化
先回应用户刚才说的话，然后自然地聊聊这些话题中的一个。语气开心、热情、真诚，像在和朋友聊天。`;
        }
        // 第 3-4 轮：引入冲浪比赛邀请
        else if (gameState.dateConversationCount <= 4) {
            prompt = `作为 Koa，在和主角聊天时兴奋地提到：明天在威基基海滩有一场冲浪比赛！
- 说你会参加比赛
- 邀请主角来看比赛
- 描述比赛会有很棒的浪，还有很多来自世界各地的冲浪高手
先回应用户刚才说的话，然后自然地引出冲浪比赛的话题。语气兴奋、期待、带点紧张和邀请的意味。`;
        }
        // 第 5 轮及以后：聊夏威夷美食、旅行经历等
        else {
            prompt = `作为 Koa，和主角继续愉快的约会对话。话题可以包括：
- 夏威夷的美食（poke 生鱼饭、kalua pork 烤猪肉、shave ice 刨冰等）
- 主角的旅行经历（是不是第一次来夏威夷，喜欢什么）
- 夏威夷的其他好玩的地方
先回应用户刚才说的话，然后自然地聊聊这些话题。语气像老朋友一样自然、真诚、好奇。`;
        }
        
        await window.generateNPCDialogue("Koa", prompt);
    }, 500);
}

/**
 * 进入邀约地点（三级地点）
 */
async function enterInvitationLocation(invitationData) {
    // 设置状态
    设置状态({
        currentTertiaryLocation: invitationData.scene,
        currentNpc: gameState.encounters.find(e => e.hasInvitation && e.invitationStatus === 'accepted')?.name || null,
        storyPhase: "Duke's Waikiki"
    });
    gameState.dateConversationCount = 0;
    
    // 显示场景描写
    紫色场景切换(
        '📍',
        invitationData.scene,
        `你来到了${invitationData.scene}，这里${invitationData.activity === '海边酒吧派对' ? '热闹非凡，音乐声和欢笑声交织在一起，空气中弥漫着热带鸡尾酒的香气' : '充满了夏威夷的独特魅力'}。<br>${invitationData.time === '待会' ? '派对即将开始，人们陆续到场，气氛越来越热烈' : '时间慢慢接近约定时间'}，你开始期待即将到来的约会...`
    );
    
    // NPC 出现并开始对话
    if (gameState.currentNpc) {
        const npcEmoji = getNpcEmoji(gameState.currentNpc);
        setTimeout(async () => {
            await window.generateNPCDialogue(gameState.currentNpc, `作为${gameState.currentNpc}，看到主角如约而至，用英语兴奋地打招呼。说你很高兴对方能来，然后开始今天的${invitationData.activity}。语气要开心、热情、充满期待。`);
        }, 500);
    }
}

// ========== 4. 美食成就相关 ==========

// 进入烤虾车并触发 Medal 事件
async function enterFoodTruckMedal(foodTruckData) {
    // 设置游戏状态
    设置状态({
        currentNpc: foodTruckData.npc,
        storyPhase: "foodTruckMedal"
    });
    
    紫色场景切换(
        foodTruckData.emoji,
        foodTruckData.name,
        '一辆色彩鲜艳的餐车停在路边，车身上画着可爱的虾子图案。<br>烤虾的香气在空气中弥漫，让人垂涎欲滴。<br>几个当地人正围在餐车旁，边吃边聊，笑声不断。<br><br>一位穿着花衬衫、皮肤黝黑的大叔正在忙碌着。<br>他看到你来了，露出灿烂的笑容，露出一口洁白的牙齿。<br>"Aloha! Welcome to my shrimp truck!"'
    );
    
    // 老板出现并对话
    setTimeout(async () => {
        await window.generateNPCDialogue(foodTruckData.npc, `作为夏威夷烤虾车老板 Uncle Kimo，用英语热情欢迎这位独自来用餐的客人。说你的烤虾是用最新鲜的本地虾和最祖传的蒜香黄油配方制作的，想要请 TA 品尝最美味的夏威夷街头美食。语气要热情、幽默、像老朋友一样。`);
    }, 500);
}

// ========== 5. 冲浪店剧情相关 ==========

// 进入冲浪店
async function enterSurfShop() {
    // 设置游戏状态
    设置状态({
        currentSecondaryLocation: "冲浪店",
        currentNpc: "Maya",
        storyPhase: "surfShop"
    });
    
    紫色场景切换(
        '🏄‍♀️',
        '冲浪店',
        '你走进海滩边的一家小冲浪店，店里摆满了各式各样的冲浪板。<br>空气中弥漫着海洋的气息和蜡的味道。<br>阳光透过玻璃窗洒进来，墙上挂着冲浪比赛的照片。<br><br>柜台后面，一个年轻女孩正在整理冲浪装备。<br>她抬起头，露出阳光般的笑容。'
    );
    
    // 设置 Maya 人设
    const mayaCharacter = {
        name: "Maya",
        chineseName: "玛雅",
        nationality: "American",
        age: 20,
        occupation: "Surf Shop Assistant",
        emoji: "🏄‍♀️",
        personality: "随和友好，热爱冲浪，阳光开朗",
        scene: "冲浪店",
        description: "冲浪店打工女孩，对冲浪很有研究"
    };
    
    // 保存固定 NPC
    saveFixedNpcToEncounters(mayaCharacter);
    
    // 显示 Maya 的欢迎对话
    await window.generateNPCDialogue("Maya", `作为冲浪店的打工女孩 Maya，用英语随意友好地欢迎这位游客。说你在这里工作，对冲浪和冲浪装备都很在行。如果有任何问题都可以问你。语气要随和、阳光、像朋友一样。`);
}

// 回酒店房间，结束一天
async function returnToHotelRoom() {
    console.log("=== 回酒店房间，结束一天 ===");
    
    // 显示回酒店场景描写（特殊样式：渐变背景）
    紫色场景切换(
        '🌙',
        '回到酒店房间',
        `夜幕降临，你回到了威基基海滩酒店。<br>躺在床上，回想着今天的经历：<br>${gameState.storyPhase === "Duke's Waikiki" ? '和 Koa 在海边酒吧派对的欢乐时光，音乐、舞蹈、美食，还有那美丽的日落...' : '品尝夏威夷地道美食的美好体验，无论是彩虹刨冰还是蒜香烤虾，都让人回味无穷...'}<br><br>海风从窗外吹进来，带着淡淡的海盐味。<br>你闭上眼睛，期待着明天的冒险...<br><br><span style="font-size: 1.3em;">🌺 Day 1 结束 🌺</span>`,
        {
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }
    );
    
    // 设置游戏状态
    gameState.storyPhase = "hotelRoom";
    gameState.currentDay = 1;
    
    // 禁用输入框
    const userInputEl = document.getElementById('userInput');
    const sendButton = document.querySelector('.send-btn');
    if (userInputEl) {
        userInputEl.disabled = true;
        userInputEl.placeholder = "第一天结束，敬请期待后续...";
    }
    if (sendButton) {
        sendButton.disabled = true;
        sendButton.style.opacity = "0.3";
        sendButton.style.cursor = "not-allowed";
    }
    
    // 移除加载动画
    const loadingEl = document.getElementById('transitionLoading');
    if (loadingEl) {
        loadingEl.remove();
    }
}

// ========== 6. 酒店相关 ==========

// 酒店入住流程
async function startHotelCheckIn() {
    gameState.currentSecondaryLocation = gameState.secondaryLocations[0];
    gameState.currentNpc = gameState.hotel.npc;
    gameState.conversationHistory = [];
    gameState.storyPhase = "hotelCheckIn";
    
    await generateInnerMonologue("终于到酒店了，看起来真不错！期待接下来的冒险！", "开心、期待、有点累但兴奋");
    
    // 从 FIXED_NPCS 读取前台接待员的 rolePrompt
    const receptionist = window.getFixedNpc("前台接待员");
    const hotelDialoguePrompt = receptionist.rolePrompt.replace('Waikiki Beach Hotel', gameState.hotel.name);
    await window.generateNPCDialogue(gameState.hotel.npc, hotelDialoguePrompt);
}

// 卢奥晚宴邀约
async function showLuauInvitation() {
    const receptionistEmoji = getNpcEmoji("前台接待员");
    displayNPCMessage(`${receptionistEmoji} 前台接待员`,
        "Aloha! By the way, we have a traditional Hawaiian Luau tonight! It starts at 6 PM on the beachfront lawn. You'll experience authentic Hawaiian culture - we roast a whole Kalua pig in the traditional underground imu oven, and you can enjoy poi, lomi lomi salmon, and haupia. There will be live Hawaiian music and hula dancing performances too! Many guests say it's the highlight of their trip. Would you like to join us? It's $89 per person, includes the full dinner feast and entertainment.",
        "Aloha！对了，我们今晚有传统的夏威夷卢奥晚宴！晚上 6 点在海滨草坪举办。您将体验地道的夏威夷文化——我们用传统的地下烤炉（imu）烤制整只卡鲁瓦猪，还可以享用芋头泥（poi）、罗密罗密三文鱼（lomi lomi salmon）和椰子布丁（haupia）。现场还有夏威夷音乐和草裙舞（hula）表演！很多客人都说这是他们旅行的亮点。您想参加吗？每位 89 美元，包含完整的晚宴和娱乐表演。");
    
    showLuauOptions();
}

function showLuauOptions() {
    选择 (
        '🌺 留下来参加卢奥晚宴',
        async () => { await acceptLuauInvitation(); },
        '🏖️ 去海滩逛逛',
        async () => { await declineLuauInvitation(); },
        {
            gradient1: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            gradient2: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }
    );
}

async function acceptLuauInvitation() {
    // 记录分支
    if (!gameState.branches) {
        gameState.branches = [];
    }
    gameState.branches.push({
        title: "夏威夷卢奥晚宴",
        description: "在卢奥晚宴上遇到了一位神秘高贵的男人，度过了一个难忘的夜晚",
        status: "active",
        startTime: new Date().toLocaleString('zh-CN'),
        location: "酒店海滨草坪"
    });
    
    // 设置故事阶段为卢奥晚宴邂逅
    gameState.storyPhase = "luau_encounter";
    gameState.conversationCount = 0;
    
    // 显示场景描写
    紫色场景切换(
        '🌺',
        '卢奥晚宴',
        '夜幕降临，你来到了酒店的海滨草坪。<br>篝火熊熊燃烧，空气中弥漫着烤猪的香气和热带花朵的芬芳。<br>草裙舞者随着夏威夷音乐翩翩起舞，火刀舞表演即将开始。<br><br>在人群中，你注意到一个气质非凡的男人独自坐着。<br>他穿着考究，眼神深邃，举手投足间散发着神秘高贵的气息。<br>似乎感受到了你的目光，他微微抬头，与你四目相对...<br><br><em style="color: #888;">一场神秘的邂逅即将开始...</em>'
    );
    
    // 延迟 1 秒后触发邂逅
    setTimeout(async () => {
        if (window.triggerLuauMysteryEncounter) {
            await window.triggerLuauMysteryEncounter();
        }
    }, 1000);
}

async function declineLuauInvitation() {
    const receptionistEmoji2 = getNpcEmoji("前台接待员");
    displayNPCMessage(`${receptionistEmoji2} 前台接待员`,
        "No problem! The beach is just a short walk from here. Enjoy your time at Waikiki Beach! If you change your mind about the Luau, it's still going on until 9 PM.",
        "没问题！海滩离这里很近。祝你在威基基海滩玩得开心！");
    
    setTimeout(async () => {
        // 添加威基基海滩到二级地点
        const beachLocation = gameState.secondaryLocationsPerPrimary[0][1];
        
        // 使用封装函数添加到面板
        添加二级地点 (
            gameState.currentPrimaryLocationData.name,
            beachLocation.name,
            beachLocation.emoji || getLocationEmoji("海滩"),
            beachLocation.description
        );
        
        // 更新场景名称为威基基海滩
        更新场景名 (beachLocation.emoji, beachLocation.name);
        
        // 显示到达海滩的旁白
        const arrivalMessage = document.createElement('div');
        arrivalMessage.className = 'system-message';
        arrivalMessage.innerHTML = `
            <span style="font-weight: bold; color: #6a1b9a; font-size: 0.95em; line-height: 1.6;">
                🏖️ 威基基海滩 🏖️<br><br>
                你从酒店出来，沿着卡拉卡瓦大道步行几分钟，蔚蓝的太平洋逐渐映入眼帘。金色的阳光洒在细腻的白沙上，椰子树在微风中轻轻摇曳。远处，冲浪者在碧波荡漾的海面上乘风破浪，空气中弥漫着淡淡的海盐和鸡蛋花香。<br><br>
                你在海滩边漫步，享受着温暖的海风和美丽的景色...
            </span>
        `;
        const chatContainer = document.getElementById('chatContainer');
        chatContainer.appendChild(arrivalMessage);
        
        // 直接在海边遇到 Koa（跳过冲浪店和 Maya）
        // 防止重复触发 Koa 邂逅
        if (gameState.koaEncounterTriggered) {
            console.log("Koa 邂逅已触发，跳过");
            return;
        }
        gameState.koaEncounterTriggered = true;
        
        // 使用 encounter.js 中的 generateSurfShopRomance 函数
        if (window.generateSurfShopRomance) {
            await window.generateSurfShopRomance({ name: "威基基海滩" });
        }
    }, 500);
}

console.log("Game module loaded ✓");
