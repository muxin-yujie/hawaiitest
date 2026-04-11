// ========================================
// 🎮 游戏核心管理模块 (GameCore)
// ========================================
// 集中管理所有全局状态、配置和 API 调用
// 这是项目的"中枢神经"，避免全局变量乱套

const GameCore = {
    // ============= 配置 =============
    config: {
        apiKey: "sk-a0e31c0e743847eea76c53ba20fa985f",
        apiUrl: "https://api.deepseek.com/v1/chat/completions",
        defaultTemperature: 0.7
    },

    // ============= 游戏配置 =============
    gameConfig: {
        primaryLocations: [
            { name: "威基基海滩", emoji: "🏖️", description: "世界著名的海滩" },
            { name: "钻石头山", emoji: "🌋", description: "夏威夷的标志" },
            { name: "珍珠港", emoji: "⚓", description: "历史遗迹" },
            { name: "古兰尼牧场", emoji: "🏞️", description: "热带雨林风光" }
        ],
        dateLocations: [
            { name: "Waikiki Beach", activity: "surfing", time: "morning" },
            { name: "Diamond Head", activity: "hiking", time: "sunrise" },
            { name: "Hanauma Bay", activity: "snorkeling", time: "afternoon" }
        ]
    },

    // ============= 游戏状态 =============
    state: {
        player: { name: "游客" },
        currentPrimaryLocation: null,
        currentSecondaryLocation: null,
        currentNpc: null,
        conversationHistory: [],
        locations: [],
        encounters: [],
        notebook: [],
        medals: [],
        branches: [],
        completedTasks: [],
        storyPhase: "customs",
        itinerary: [],
        currentItineraryIndex: 0,
        hasEncountered: {},
        currentPrimaryIndex: 0,
        currentSecondaryIndex: 0,
        encounterProbability: 0.6,
        medalProbability: 0.6,
        dynamicNpcRoles: {},
        conversationCount: 0
    },

    // ============= 地点数据 =============
    primaryLocations: {
        airport: {
            name: "檀香山国际机场",
            emoji: "✈️",
            description: "飞机缓缓降落在檀香山国际机场，窗外是湛蓝的天空和连绵的山脉。你透过窗户看到远处的大海在阳光下闪闪发光，内心激动不已。",
            secondaryLocations: [
                { name: "海关", npc: "海关官员", emoji: "🛂" },
                { name: "到达大厅", npc: "导游 Lani", emoji: "🌺" }
            ]
        }
    },

    // ============= 其他常量 =============
    dynamicLocations: {},
    playerContext: "重要：玩家是一名 20 岁的漂亮中国女大学生，第一次来夏威夷，独自旅行，性格开朗、好奇心强，对浪漫邂逅持开放态度。请记住这个设定，不要 OOC（角色崩坏）。",

    // ============= 方法：数据管理 =============
    methods: {
        // API Key 管理
        getCurrentAPIKey() {
            const savedApiKey = localStorage.getItem('hawaii_game_api_key');
            if (savedApiKey) return savedApiKey;
            if (window.CUSTOM_API_KEY) return window.CUSTOM_API_KEY;
            return GameCore.config.apiKey;
        },

        // 玩家管理
        setPlayerName(name) {
            GameCore.state.player.name = name;
        },
        getPlayerName() {
            return GameCore.state.player.name;
        },

        // 数据管理
        addEncounter(npc) {
            if (!GameCore.state.encounters.find(e => e.name === npc.name)) {
                GameCore.state.encounters.push(npc);
            }
        },
        addMedal(medal) {
            if (!GameCore.state.medals.find(m => m.id === medal.id)) {
                GameCore.state.medals.push(medal);
            }
        },
        addLocation(location) {
            if (!GameCore.state.locations.find(l => l.name === location.name)) {
                GameCore.state.locations.push(location);
            }
        },

        // 重置游戏
        resetGameState() {
            const playerName = GameCore.state.player.name;
            GameCore.state = {
                player: { name: playerName },
                currentPrimaryLocation: null,
                currentSecondaryLocation: null,
                currentNpc: null,
                conversationHistory: [],
                locations: [],
                encounters: [],
                notebook: [],
                medals: [],
                branches: [],
                completedTasks: [],
                storyPhase: "customs",
                itinerary: [],
                currentItineraryIndex: 0,
                hasEncountered: {},
                currentPrimaryIndex: 0,
                currentSecondaryIndex: 0,
                encounterProbability: 0.6,
                medalProbability: 0.6,
                dynamicNpcRoles: {},
                conversationCount: 0
            };
        }
    },

    // ============= 方法：API 调用 =============
    api: {
        // JSON 响应解析
        parseJSONResponse(content) {
            const cleanContent = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
            try {
                return JSON.parse(cleanContent);
            } catch (error) {
                logError('GameCore.API', 'JSON 解析失败', cleanContent);
                throw error;
            }
        },

        // 通用 AI 调用（返回文本）
        async callAI(prompt, systemRole = "你是一个有帮助的助手", maxTokens = 800, temperature = 0.8) {
            try {
                const response = await fetch(GameCore.config.apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${GameCore.methods.getCurrentAPIKey()}`
                    },
                    body: JSON.stringify({
                        model: "deepseek-chat",
                        messages: [
                            { role: "system", content: systemRole },
                            { role: "user", content: prompt }
                        ],
                        max_tokens: maxTokens,
                        temperature: temperature
                    })
                });
                
                if (!response.ok) throw new Error(`API 请求失败：${response.status}`);
                const data = await response.json();
                return data.choices[0].message.content.trim();
            } catch (error) {
                logError('GameCore.AI', 'AI 调用失败', error.message);
                ErrorHandler.handleAPIError(error, 'AI 调用');
                return "";
            }
        },

        // AI 调用（返回 JSON）
        async callAI_JSON(prompt, systemRole = "你是一个专业的助手，请只返回 JSON 格式", maxTokens = 800, temperature = 0.8) {
            const content = await GameCore.api.callAI(prompt, systemRole, maxTokens, temperature);
            return GameCore.api.parseJSONResponse(content);
        },

        // 获取 NPC 回复（支持多轮对话）
        async getAIResponse(prompt, npcName, conversationHistory) {
            try {
                const npcRole = window.getNpcRole(npcName);
                
                const messages = [
                    {
                        role: "system",
                        content: npcRole
                    },
                    ...conversationHistory,
                    {
                        role: "user",
                        content: prompt
                    }
                ];
                
                const response = await fetch(GameCore.config.apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${GameCore.methods.getCurrentAPIKey()}`
                    },
                    body: JSON.stringify({
                        model: "deepseek-chat",
                        messages: messages,
                        max_tokens: 800,
                        temperature: GameCore.config.defaultTemperature
                    })
                });
                
                if (!response.ok) throw new Error(`API 请求失败：${response.status}`);
                const data = await response.json();
                return data.choices[0].message.content.trim();
            } catch (error) {
                logError('GameCore.NPC', 'AI 响应失败', error.message);
                return "I'm sorry, I couldn't respond right now.";
            }
        },

        // 翻译到中文
        async translateToChinese(text) {
            try {
                // 如果已经是中文，直接返回
                if (/[\u4e00-\u9fa5]/.test(text) && text.length > 10) {
                    return text;
                }
                
                const response = await fetch(GameCore.config.apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${GameCore.methods.getCurrentAPIKey()}`
                    },
                    body: JSON.stringify({
                        model: "deepseek-chat",
                        messages: [
                            { role: "system", content: "你是一个专业的翻译助手。请将输入的文字翻译成中文。如果输入已经是中文，直接返回原文。" },
                            { role: "user", content: `请翻译：\n\n${text}` }
                        ],
                        max_tokens: 500,
                        temperature: 0.3
                    })
                });
                
                if (!response.ok) {
                    console.warn(`翻译 API 返回状态码：${response.status}`);
                    return text; // 返回原文
                }
                
                const data = await response.json();
                const translation = data.choices[0].message.content.trim();
                
                // 如果翻译结果包含"翻译失败"或为空，返回原文
                if (!translation || translation.includes("翻译失败") || translation.includes("无法翻译")) {
                    console.warn("翻译结果为空或包含错误，返回原文");
                    return text;
                }
                
                return translation;
            } catch (error) {
                console.warn("翻译失败，返回原文:", error.message);
                // 不显示错误，直接返回原文
                return text;
            }
        },

        // 生成 NPC 对话（包含 UI 显示）
        async generateNPCDialogue(npcName, prompt) {
            const fullPrompt = GameCore.playerContext + prompt;
            const aiResponse = await GameCore.api.getAIResponse(fullPrompt, npcName, GameCore.state.conversationHistory);
            
            // 清理中文动作词（防御性处理）
            const cleanedResponse = window.cleanNpcDialogue ? window.cleanNpcDialogue(aiResponse) : aiResponse;
            
            const translation = await GameCore.api.translateToChinese(cleanedResponse);
            
            const npcMessage = document.createElement('div');
            npcMessage.className = 'message npc-message';
            npcMessage.innerHTML = `
                <div class="message-sender">${window.getNpcEmoji ? window.getNpcEmoji(npcName) : '🤖'} ${npcName}</div>
                <div>${cleanedResponse}</div>
                <div class="translation">${translation}</div>
            `;
            const chatContainer = document.getElementById('chatContainer');
            if (chatContainer) {
                chatContainer.appendChild(npcMessage);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
            
            GameCore.state.conversationHistory.push({ role: "assistant", content: cleanedResponse });
            
            // 文化提示异步生成，不阻塞对话显示
            if (Math.random() < 0.8 && window.generateAICultureTip) {
                window.generateAICultureTip(GameCore.state.currentPrimaryLocation, cleanedResponse);
            }
        }
    }
};

// ============= 向后兼容：暴露到全局 =============
// 保持原来的全局变量，确保现有代码不破坏
window.GameCore = GameCore;
window.gameState = GameCore.state;
window.CONFIG = GameCore.config;
window.gameConfig = GameCore.gameConfig;
window.playerContext = GameCore.playerContext;
window.primaryLocations = GameCore.primaryLocations;
window.dynamicLocations = GameCore.dynamicLocations;

// API 函数兼容性
window.getCurrentAPIKey = () => GameCore.methods.getCurrentAPIKey();
window.callAI = (p, s, m, t) => GameCore.api.callAI(p, s, m, t);
window.callAI_JSON = (p, s, m, t) => GameCore.api.callAI_JSON(p, s, m, t);
window.getAIResponse = (p, n, h) => GameCore.api.getAIResponse(p, n, h);
window.translateToChinese = (t) => GameCore.api.translateToChinese(t);
window.parseJSONResponse = (c) => GameCore.api.parseJSONResponse(c);
window.generateNPCDialogue = (n, p) => GameCore.api.generateNPCDialogue(n, p);

console.log("✅ GameCore 已加载 - 游戏核心管理系统就绪");
