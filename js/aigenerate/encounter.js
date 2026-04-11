// ========== 邂逅事件生成模块 ==========

/**
 * 触发机场邂逅事件（从固定库中抽取）
 */
async function triggerAirportEncounter() {
    const chatContainer = document.getElementById('chatContainer');
    
    console.log("开始触发机场邂逅...");
    
    try {
        // 从固定 NPC 库中随机抽取一个
        if (!window.AIRPORT_NPCS || window.AIRPORT_NPCS.length === 0) {
            console.error("机场 NPC 库为空，请先加载 airport-npcs.js");
            return;
        }
        
        const encounterData = window.getRandomAirportNPC();
        
        // 获取当前一级地点名称（如果没有则默认为机场）
        const currentScene = gameState.currentPrimaryLocationData?.name || "檀香山国际机场";
        
        const encounter = {
            name: encounterData.name,
            chineseName: encounterData.chineseName,
            nationality: encounterData.nationality,
            age: encounterData.age,
            occupation: encounterData.occupation,
            emoji: encounterData.emoji,
            personality: encounterData.personality,
            background: encounterData.background,
            scene: currentScene,
            met: true
        };
        
        // 使用统一函数保存随机 NPC
        if (window.saveRandomNpcToEncounters) {
            window.saveRandomNpcToEncounters(encounter, currentScene);
        } else {
            // 兼容旧代码
            if (!window.gameState.encounters.some(e => e.name === encounterData.name)) {
                window.gameState.encounters.push(encounter);
            }
        }
        
        // 显示邂逅信息
        const encounterMessage = document.createElement('div');
        encounterMessage.className = 'encounter-message';
        encounterMessage.innerHTML = `
            <div style="font-weight: bold; font-size: 1.1em; margin-bottom: 10px;">💕 机场邂逅 💕</div>
            <div style="color: #6a1b9a; margin-bottom: 8px;">
                ${encounterData.emoji} ${encounterData.name} (${encounterData.chineseName}) | ${encounterData.age}岁 | ${encounterData.nationality}<br>
                ${encounterData.occupation}
            </div>
            <div style="color: #555;">${encounterData.personality}</div>
        `;
        chatContainer.appendChild(encounterMessage);
        
        // ========== 关键优化：开启实时对话模式 ==========
        // 设置当前 NPC 名字（字符串，不是对象）
        window.gameState.currentNpc = encounterData.name;
        window.gameState.conversationHistory = [];
        
        // 注意：不再需要动态添加 NPC 角色定义
        // getNpcRole() 会自动从 AIRPORT_NPCS 中读取
        
        // 显示 NPC 的第一句话
        const npcMessage = document.createElement('div');
        npcMessage.className = 'message npc-message';
        
        // 清理中文动作词（防御性处理）
        const firstLine = window.cleanNpcDialogue ? window.cleanNpcDialogue(encounterData.firstLine) : encounterData.firstLine;
        const translation = await window.translateToChinese(firstLine);
        
        npcMessage.innerHTML = `
            <div class="message-sender">${encounterData.emoji} ${encounterData.name}</div>
            <div>${firstLine}</div>
            <div class="translation">${translation}</div>
        `;
        chatContainer.appendChild(npcMessage);
        
        // 添加到对话历史
        window.gameState.conversationHistory.push({ role: "assistant", content: firstLine });
        
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // 设置邂逅后的状态，允许玩家回复
        window.gameState.storyPhase = "encounter";
        window.gameState.conversationCount = 0;
        
        console.log("✅ 机场邂逅已触发，开启实时对话模式");
        console.log("当前 NPC:", window.gameState.currentNpc);
        console.log("对话阶段:", window.gameState.storyPhase);
    } catch (error) {
        console.error("机场邂逅触发失败:", error);
    }
}

console.log("邂逅事件模块已加载 ✓");

// 函数定义在后面，稍后暴露到全局

/**
 * 生成冲浪店浪漫故事（Koa 邂逅）
 */
async function generateSurfShopRomance(location) {
    const chatContainer = document.getElementById('chatContainer');
    
    console.log("=== 生成冲浪店浪漫故事（Koa 邂逅）===");
    
    // ========== 设置邂逅状态 ==========
    if (window.gameState) {
        window.gameState.storyPhase = "encounter";
        window.gameState.currentNpc = "Koa";
        window.gameState.conversationHistory = [];
        window.gameState.conversationCount = 0;
    }
    
    // 生成 Koa 的人设并添加到 encounters
    const koaCharacter = {
        name: "Koa",
        chineseName: "科阿",
        nationality: "Hawaiian",
        age: 22,
        occupation: "Surf Instructor",
        emoji: "🏄‍♂️",
        personality: "阳光、真诚、热情、带点害羞",
        background: "夏威夷本地人，专业冲浪教练，热爱海洋",
        scene: location.name,
        description: "帅气的冲浪教练，在冲浪店相遇"
    };
    
    // 使用统一函数保存固定 NPC
    if (window.saveFixedNpcToEncounters) {
        window.saveFixedNpcToEncounters(koaCharacter);
    } else {
        // 兼容旧代码
        const encounter = {
            ...koaCharacter,
            hasInvitation: false,
            invitationStatus: null,
            invitationData: null,
            conversationCount: 0
        };
        
        if (window.gameState && window.gameState.encounters) {
            window.gameState.encounters.push(encounter);
        }
    }
    
    // 将 Koa 添加到动态 NPC 角色
    if (window.addToNpcRoles) {
        window.addToNpcRoles(koaCharacter);
    }
    
    console.log("Koa 人设已添加，当前 NPC:", window.gameState?.currentNpc);
    
    // 生成浪漫故事背景
    const romancePrompt = `你是旁白，讲述一个关于冲浪的浪漫故事。主角是 20 岁的中国女大学生，在夏威夷威基基海滩的冲浪店里遇到了一位帅气的冲浪教练。请用第三人称旁白的方式：
1. 描述冲浪店的环境（冲浪板、海洋气息、阳光）
2. 描述冲浪教练的外貌（古铜色皮肤、阳光笑容、蓝色眼睛）
3. 描述初次相遇的场景（他正在整理冲浪板，抬头看到她，两人目光相遇）
4. 营造浪漫的氛围（海风、海浪声、心跳加速）
5. 用生动的中文，200 字左右`;
    
    const apiKey = "sk-a0e31c0e743847eea76c53ba20fa985f";
    const apiUrl = "https://api.deepseek.com/v1/chat/completions";
    
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "你是一个浪漫的旁白叙述者，善于用优美的中文讲述浪漫的爱情故事。"
                },
                {
                    role: "user",
                    content: romancePrompt
                }
            ],
            max_tokens: 300,
            temperature: 0.7
        })
    });
    
    if (response.ok) {
        const data = await response.json();
        const romanceText = data.choices[0].message.content.trim();
        
        const romanceMessage = document.createElement('div');
        romanceMessage.className = 'system-message';
        romanceMessage.innerHTML = `
            <span style="font-weight: bold; color: #6a1b9a;">
                💕 浪漫的相遇 💕<br><br>
                ${romanceText.replace(/\n/g, '<br>')}
            </span>
        `;
        chatContainer.appendChild(romanceMessage);
    }
    
    // 显示系统消息，介绍 Koa
    const koaIntroMessage = document.createElement('div');
    koaIntroMessage.className = 'system-message';
    koaIntroMessage.innerHTML = `
        <span style="font-weight: bold; color: #6a1b9a;">
            🏄‍♂️ 遇到冲浪教练 🏄‍♂️<br><br>
            一位穿着沙滩裤、皮肤黝黑的年轻男子向你走来，手里拿着冲浪板。
        </span>
    `;
    chatContainer.appendChild(koaIntroMessage);
    
    // 然后 Koa 开始对话
    if (window.generateNPCDialogue) {
        await window.generateNPCDialogue("Koa", `作为冲浪教练 Koa，用英语热情欢迎这位中国女游客。说你叫 Koa（夏威夷名字），是这里的冲浪教练。看到她第一眼就觉得她很特别。邀请她一起学习冲浪，说今天的海浪很适合初学者。语气要阳光、真诚、带一点点害羞。`);
    }
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * 触发卢奥晚宴神秘邂逅（从固定库中抽取）
 */
async function triggerLuauMysteryEncounter() {
    const chatContainer = document.getElementById('chatContainer');
    
    console.log("开始触发卢奥晚宴神秘邂逅...");
    
    try {
        // ========== 第一步：生成浪漫的相遇场景 ==========
        const romancePrompt = `你是旁白，描述一个夏威夷卢奥晚宴上的浪漫相遇。
场景：酒店海滨草坪，篝火、烤猪香气、草裙舞、火刀舞
人物：20 岁中国女游客 vs 神秘高贵的男人（30 岁左右，混血，气质非凡）
要求：
1. 描述卢奥晚宴的热闹氛围（篝火、美食、舞蹈）
2. 描述他独自坐在角落，与周围热闹形成对比
3. 描述你们的目光第一次相遇的瞬间（时间仿佛静止）
4. 描述他起身走向你的优雅姿态
5. 用优美的中文，250 字左右，营造浪漫神秘的氛围`;

        const apiKey = "sk-a0e31c0e743847eea76c53ba20fa985f";
        const apiUrl = "https://api.deepseek.com/v1/chat/completions";
        
        const romanceResponse = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: "你是一个浪漫的旁白叙述者，善于用优美的中文讲述浪漫的爱情故事。"
                    },
                    {
                        role: "user",
                        content: romancePrompt
                    }
                ],
                max_tokens: 350,
                temperature: 0.8
            })
        });
        
        if (romanceResponse.ok) {
            const romanceData = await romanceResponse.json();
            const romanceText = romanceData.choices[0].message.content.trim();
            
            const romanceMessage = document.createElement('div');
            romanceMessage.className = 'system-message';
            romanceMessage.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            romanceMessage.style.color = 'white';
            romanceMessage.innerHTML = `
                <span style="font-size: 1.1em; line-height: 1.8;">
                    💫 卢奥晚宴的邂逅 💫<br><br>
                    ${romanceText.replace(/\n/g, '<br>')}
                </span>
            `;
            chatContainer.appendChild(romanceMessage);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            // 等待 2 秒让玩家感受浪漫氛围
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // ========== 第二步：从固定 NPC 库中抽取 ==========
        if (!window.LUAU_NPCS || window.LUAU_NPCS.length === 0) {
            console.error("卢奥 NPC 库为空，请先加载 luau-npcs.js");
            return;
        }
        
        const encounterData = window.getRandomLuauNPC();
        
        // 获取当前场景
        const currentScene = "卢奥晚宴";
        
        const encounter = {
            name: encounterData.name,
            chineseName: encounterData.chineseName,
            nationality: encounterData.nationality,
            age: encounterData.age,
            occupation: encounterData.occupation,
            emoji: encounterData.emoji,
            personality: encounterData.personality,
            background: encounterData.background,
            scene: currentScene,
            met: true
        };
        
        // 使用统一函数保存随机 NPC
        if (window.saveRandomNpcToEncounters) {
            window.saveRandomNpcToEncounters(encounter, currentScene);
        } else {
            // 兼容旧代码
            if (!window.gameState.encounters.some(e => e.name === encounterData.name)) {
                window.gameState.encounters.push(encounter);
            }
        }
        
        // ========== 第三步：生成 NPC 的第一句话（带 OOC 提示词） ==========
        // 先显示他走向你的动作
        const approachMessage = document.createElement('div');
        approachMessage.className = 'system-message';
        approachMessage.innerHTML = `
            <span style="font-weight: bold; color: #6a1b9a;">
                ${encounterData.emoji} 他缓缓向你走来...<br><br>
                他的步伐优雅而从容，周围喧嚣的人群仿佛成了背景。<br>
                他在你面前停下，微微一笑，眼神温柔而深邃...
            </span>
        `;
        chatContainer.appendChild(approachMessage);
        
        // 生成 NPC 的第一句话（带 OOC 提示词）
        const oocPrompt = `[OOC Note: This is your FIRST line when approaching the player at the Luau. You're at a romantic Hawaiian Luau (bonfire, traditional food, hula dancing). You're mysterious, elegant, and confident. Don't reveal too much about yourself yet. Start with a smooth, intriguing opening line that shows curiosity about her. Keep it short (1-2 sentences), natural, and slightly mysterious. No actions in parentheses!]`;
        
        const firstLinePrompt = `${oocPrompt}

【NPC 设定】
- 姓名：${encounterData.name} (${encounterData.chineseName})
- 年龄：${encounterData.age}岁
- 职业：${encounterData.occupation}
- 性格：${encounterData.personality}
- 背景：${encounterData.background}

【场景】
夏威夷卢奥晚宴，篝火、烤猪香气、草裙舞表演，浪漫神秘的氛围

【要求】
1. 用英语回复（1-2 句话）
2. 优雅、神秘、自信的开场白
3. 表达对她的好奇和兴趣
4. 不要暴露太多个人信息
5. 不要有动作描写（如*smile*）

请生成 NPC 的第一句话：`;

        try {
            const apiKey = "sk-a0e31c0e743847eea76c53ba20fa985f";
            const apiUrl = "https://api.deepseek.com/v1/chat/completions";
            
            // 完整的卢奥晚宴场景 prompt
            const scenePrompt = `【场景设定：卢奥晚宴邂逅】

🌺 **环境氛围**
- 地点：酒店海滨草坪，传统夏威夷卢奥晚宴
- 时间：夜晚，篝火点燃，星光点点
- 氛围：浪漫、神秘、充满夏威夷文化气息

🔥 **场景细节**
- 地下烤炉（imu）正在烤制整只卡鲁瓦猪，香气四溢
- 草裙舞者在舞台上表演，裙摆摇曳
- 火刀舞表演震撼人心，火星四溅
- 人们围坐在装饰着热带花卉的餐桌旁
- 海风轻拂，椰树摇曳，远处海浪声隐约可闻
- 现场播放着轻柔的夏威夷音乐

💫 **当前情境**
你注意到一个中国女孩（玩家）独自走进晚宴现场，她看起来既好奇又有些迷茫。她的目光在人群中搜寻，最后与你对视。你决定起身走向她...

【你的角色】
- 姓名：${encounterData.name} (${encounterData.chineseName})
- 年龄：${encounterData.age}岁
- 国籍：${encounterData.nationality}
- 职业：${encounterData.occupation}
- 性格：${encounterData.personality}
- 背景：${encounterData.background}
- 气质：神秘、高贵、优雅、自信、有教养

【你的身份】
你也是卢奥晚宴的**宾客**，不是工作人员或导游！
你是一位见多识广、有品味的上流社会人士，来夏威夷参加慈善活动/寻找灵感/度假。
你对夏威夷文化有欣赏和了解，但不会像导游一样讲解，而是以个人视角分享感受。

【对话要求】
1. 使用英语（1-2 句话）
2. 第一句话要自然、优雅，能引起她的兴趣
3. 可以提及周围的场景（篝火、舞蹈、美食、音乐等），但要以宾客的视角
4. 展现你的教养和见识，但不要卖弄知识
5. 保持神秘感，说话有分寸和深度
6. 表达友善和好奇，像老朋友一样自然
7. 不要有动作描写（如*smile*、*walk over*等）

【示例开场白】（符合宾客身份）
- "Good evening. The sunset tonight is quite remarkable, isn't it? I've attended galas around the world, but there's something uniquely captivating about a Hawaiian Luau."
- "The fire dancers remind me of ancient Polynesian legends... Is this your first time experiencing traditional Hawaiian culture?"
- "The ocean breeze tonight carries a certain magic, doesn't it? I noticed you taking in all the sights and sounds - you have the look of someone discovering Hawaii for the first time."
- "Listen to the rhythm of the waves mixed with the drums... it's like nature's own symphony. Beautiful, isn't it?"`;
            
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: scenePrompt
                        },
                        {
                            role: "user",
                            content: `你是${encounterData.name}，现在请生成你走向她时说的第一句话。记住：优雅、神秘、自然，符合卢奥晚宴的浪漫氛围。`
                        }
                    ],
                    max_tokens: 100,
                    temperature: 0.85
                })
            });
            
            let firstLine;
            if (response.ok) {
                const data = await response.json();
                firstLine = data.choices[0].message.content.trim();
                // 清理可能的动作描写
                firstLine = window.cleanNpcDialogue ? window.cleanNpcDialogue(firstLine) : firstLine;
            } else {
                // API 失败时使用预设台词
                console.warn("AI 生成失败，使用预设台词");
                firstLine = encounterData.firstLine;
            }
            
            // 显示 NPC 的第一句话
            const npcMessage = document.createElement('div');
            npcMessage.className = 'message npc-message';
            
            const translation = await window.translateToChinese(firstLine);
            
            npcMessage.innerHTML = `
                <div class="message-sender">${encounterData.emoji} ${encounterData.name}</div>
                <div>${firstLine}</div>
                <div class="translation">${translation}</div>
            `;
            chatContainer.appendChild(npcMessage);
            
            // 添加到对话历史
            window.gameState.conversationHistory.push({ role: "assistant", content: firstLine });
            
            chatContainer.scrollTop = chatContainer.scrollHeight;
        } catch (error) {
            console.error("生成 NPC 第一句话失败:", error);
            // 使用预设台词
            const npcMessage = document.createElement('div');
            npcMessage.className = 'message npc-message';
            const firstLine = encounterData.firstLine;
            const translation = await window.translateToChinese(firstLine);
            npcMessage.innerHTML = `
                <div class="message-sender">${encounterData.emoji} ${encounterData.name}</div>
                <div>${firstLine}</div>
                <div class="translation">${translation}</div>
            `;
            chatContainer.appendChild(npcMessage);
            window.gameState.conversationHistory.push({ role: "assistant", content: firstLine });
        }
        
        // ========== 第四步：设置邂逅后的状态 ==========
        window.gameState.currentNpc = encounterData.name;
        window.gameState.conversationHistory = [];
        window.gameState.storyPhase = "luau_encounter";
        window.gameState.conversationCount = 0;
        
        // 注意：不再需要动态添加 NPC 角色定义
        // getNpcRole() 会自动从 LUAU_NPCS 中读取
        
        console.log("✅ 卢奥晚宴神秘邂逅已触发，开启实时对话模式");
        console.log("当前 NPC:", window.gameState.currentNpc);
        console.log("对话阶段:", window.gameState.storyPhase);
    } catch (error) {
        console.error("卢奥晚宴邂逅触发失败:", error);
    }
}

// ========== 暴露到全局作用域 ==========
window.triggerAirportEncounter = triggerAirportEncounter;
window.generateSurfShopRomance = generateSurfShopRomance;
window.triggerSurfInvitation = triggerSurfInvitation;
window.triggerLuauMysteryEncounter = triggerLuauMysteryEncounter;

// ========== 卢奥晚宴剧情事件函数 ==========

/**
 * 触发火刀舞表演事件
 */
async function triggerLuauFireDanceEvent() {
    const chatContainer = document.getElementById('chatContainer');
    
    console.log("=== 触发火刀舞表演事件 ===");
    
    // 显示事件场景
    const eventMessage = document.createElement('div');
    eventMessage.className = 'system-message';
    eventMessage.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #f06595 100%)';
    eventMessage.style.color = 'white';
    eventMessage.innerHTML = `
        <span style="font-size: 1.05em; line-height: 1.8;">
            🔥 火刀舞表演 🔥<br><br>
            突然，周围的鼓点变得急促。<br>
            一位火刀舞者手持燃烧的长棍，在人群中旋转跳跃。<br>
            火花四溅，人群发出阵阵惊呼。<br><br>
            下意识地，他靠近你，轻轻护住你的肩膀。<br>
            "Don't worry, you're safe." 他的声音在你耳边响起，温热的气息让你心跳加速。<br><br>
            那一刻，火光照亮了他的侧脸，你看到他深邃的眼眸中倒映着火焰和你的身影...
        </span>
    `;
    chatContainer.appendChild(eventMessage);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // 等待玩家感受氛围，然后 NPC 继续对话
    setTimeout(async () => {
        if (window.generateNPCDialogue) {
            await window.generateNPCDialogue(gameState.currentNpc, `作为神秘男人，刚才火刀舞表演时你下意识保护了她。现在用英语温柔地问她是否还好，说刚才的场景让你想起一个古老的夏威夷传说。语气要温柔、关心。`);
        }
    }, 2000);
}

/**
 * 触发海边漫步事件
 */
async function triggerLuauBeachWalkEvent() {
    const chatContainer = document.getElementById('chatContainer');
    
    console.log("=== 触发海边漫步事件 ===");
    
    // 显示事件场景
    const eventMessage = document.createElement('div');
    eventMessage.className = 'system-message';
    eventMessage.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    eventMessage.style.color = 'white';
    eventMessage.innerHTML = `
        <span style="font-size: 1.05em; line-height: 1.8;">
            🌊 海边漫步 🌊<br><br>
            "Would you like to take a walk with me?" 他轻声问道。<br><br>
            你们离开喧闹的晚宴，来到附近的海滩。<br>
            月光洒在海面上，波光粼粼。<br>
            海浪轻柔地拍打着沙滩，四周只有你们两个人。<br><br>
            他走在你身边，偶尔你们的肩膀会不经意地碰到一起。<br>
            空气中弥漫着海盐和他的雪松香气。<br><br>
            "This is my favorite spot." 他停下脚步，望向大海，<br>
            "When I'm here, I feel... connected to something greater."
        </span>
    `;
    chatContainer.appendChild(eventMessage);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // 等待玩家感受氛围，然后 NPC 继续对话
    setTimeout(async () => {
        if (window.generateNPCDialogue) {
            await window.generateNPCDialogue(gameState.currentNpc, `作为神秘男人，在海边漫步时分享一个关于你自己的小故事或秘密。说你很少告诉别人这件事，但不知道为什么想告诉她。语气要真诚、带点脆弱感。`);
        }
    }, 2000);
}

/**
 * 触发赠送礼物事件
 */
async function triggerLuauGiftEvent() {
    const chatContainer = document.getElementById('chatContainer');
    
    console.log("=== 触发赠送礼物事件 ===");
    
    // 显示事件场景
    const eventMessage = document.createElement('div');
    eventMessage.className = 'system-message';
    eventMessage.style.background = 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
    eventMessage.style.color = '#333';
    eventMessage.innerHTML = `
        <span style="font-size: 1.05em; line-height: 1.8; color: #333;">
            🐚 神秘的礼物 🐚<br><br>
            他突然停下话语，从口袋里拿出一个小物件。<br><br>
            "I want you to have this." 他把一个精致的贝壳放在你手心。<br><br>
            你低头看去——那是一个完美的白色贝壳，<br>
            上面刻着古老的夏威夷图腾，在月光下泛着温柔的光泽。<br><br>
            "This shell has been with me for a long time."<br>
            "It carries the spirit of Aloha."<br><br>
            他轻轻合上你的手指，指尖相触的瞬间，一股电流穿过全身。<br><br>
            "Whenever you miss this night, look at it."<br>
            "And maybe... think of me."
        </span>
    `;
    chatContainer.appendChild(eventMessage);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // 等待玩家感受氛围，然后 NPC 继续对话
    setTimeout(async () => {
        if (window.generateNPCDialogue) {
            await window.generateNPCDialogue(gameState.currentNpc, `作为神秘男人，送完礼物后温柔地看着她，说今晚很特别，感谢她的陪伴。语气要温柔、真诚、带点不舍。`);
        }
    }, 2000);
}

// 调试：确认函数已暴露
console.log("邂逅事件模块已加载 ✓");
console.log("window.triggerAirportEncounter:", typeof window.triggerAirportEncounter);
console.log("window.generateSurfShopRomance:", typeof window.generateSurfShopRomance);
console.log("window.triggerSurfInvitation:", typeof window.triggerSurfInvitation);
console.log("window.triggerLuauMysteryEncounter:", typeof window.triggerLuauMysteryEncounter);
console.log("window.triggerLuauFireDanceEvent:", typeof window.triggerLuauFireDanceEvent);
console.log("window.triggerLuauBeachWalkEvent:", typeof window.triggerLuauBeachWalkEvent);
console.log("window.triggerLuauGiftEvent:", typeof window.triggerLuauGiftEvent);
console.log("window.triggerLuauPoolPartyTransition:", typeof window.triggerLuauPoolPartyTransition);
console.log("window.controlPoolParty:", typeof window.controlPoolParty);
