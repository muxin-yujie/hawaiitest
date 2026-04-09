// ========================================
// 🎮 基础游戏类 (BaseGame)
// ========================================
// 这是所有游戏的基类，提供通用的游戏管理功能
// 将来的夏威夷篇、巴黎篇等都继承这个类

class BaseGame {
    constructor(config = {}) {
        // 游戏配置
        this.config = {
            title: config.title || "未命名游戏",
            theme: config.theme || "default",
            version: config.version || "1.0.0",
            ...config
        };

        // 游戏状态（统一管理所有状态）
        this.state = this.createInitialState();

        // 初始化 API 配置
        this.apiConfig = {
            apiKey: "sk-a0e31c0e743847eea76c53ba20fa985f",
            apiUrl: "https://api.deepseek.com/v1/chat/completions",
            defaultTemperature: 0.7
        };

        console.log(`🎮 ${this.config.title} 已初始化`);
    }

    // ============= 创建初始状态 =============
    createInitialState() {
        return {
            // 玩家信息
            player: { 
                name: "游客",
                age: 20
            },
            
            // 当前位置
            currentPrimaryLocation: null,
            currentSecondaryLocation: null,
            currentNpc: null,
            
            // 游戏进度
            locations: [],          // 已访问地点
            encounters: [],         // 邂逅记录
            notebook: [],           // 旅行笔记
            medals: [],             // 成就徽章
            branches: [],           // 剧情分支
            completedTasks: [],     // 已完成任务
            photos: [],             // 照片收集
            
            // 剧情状态
            storyPhase: "customs",  // 当前剧情阶段
            itinerary: [],          // 行程
            currentItineraryIndex: 0,
            
            // 对话系统
            conversationHistory: [],
            conversationCount: 0,
            
            // 概率设置
            encounterProbability: 0.6,
            medalProbability: 0.6,
            
            // 计数器
            currentPrimaryIndex: 0,
            currentSecondaryIndex: 0,
            
            // NPC 相关
            hasEncountered: {},
            dynamicNpcRoles: {}
        };
    }

    // ============= 玩家管理 =============
    setPlayerName(name) {
        this.state.player.name = name;
        console.log(`玩家名字设置为：${name}`);
    }

    getPlayerName() {
        return this.state.player.name;
    }

    // ============= 数据管理 =============
    addEncounter(npc) {
        if (!this.state.encounters.find(e => e.name === npc.name)) {
            this.state.encounters.push(npc);
            console.log(`添加邂逅：${npc.name}`);
        }
    }

    addMedal(medal) {
        if (!this.state.medals.find(m => m.id === medal.id)) {
            this.state.medals.push(medal);
            console.log(`添加成就：${medal.name}`);
        }
    }

    addLocation(location) {
        if (!this.state.locations.find(l => l.name === location.name)) {
            this.state.locations.push(location);
            console.log(`添加地点：${location.name}`);
        }
    }

    // ============= 游戏控制 =============
    resetGame() {
        const playerName = this.state.player.name;
        this.state = this.createInitialState();
        this.state.player.name = playerName;
        console.log("游戏已重置");
    }

    saveGame(slot = 1) {
        const saveData = {
            config: this.config,
            state: this.state,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(`hawaii_save_${slot}`, JSON.stringify(saveData));
        console.log(`游戏已保存到槽位 ${slot}`);
        return saveData;
    }

    loadGame(slot = 1) {
        const saveData = localStorage.getItem(`hawaii_save_${slot}`);
        if (saveData) {
            const parsed = JSON.parse(saveData);
            this.state = parsed.state;
            console.log(`游戏已从槽位 ${slot} 加载`);
            return true;
        }
        console.warn(`槽位 ${slot} 没有存档`);
        return false;
    }

    // ============= API 调用（基础方法） =============
    async callAI(prompt, systemRole = "你是一个有帮助的助手", maxTokens = 800, temperature = 0.8) {
        try {
            const response = await fetch(this.apiConfig.apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiConfig.apiKey}`
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
            
            if (!response.ok) throw new Error("API 请求失败");
            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error("AI 调用失败:", error);
            return "";
        }
    }

    async callAI_JSON(prompt, systemRole = "你是一个专业的助手，请只返回 JSON 格式", maxTokens = 800, temperature = 0.8) {
        const content = await this.callAI(prompt, systemRole, maxTokens, temperature);
        return this.parseJSONResponse(content);
    }

    parseJSONResponse(content) {
        const cleanContent = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        try {
            return JSON.parse(cleanContent);
        } catch (error) {
            console.error("JSON 解析失败:", cleanContent);
            throw error;
        }
    }

    // ============= 翻译功能 =============
    async translateToChinese(text) {
        try {
            const response = await fetch(this.apiConfig.apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiConfig.apiKey}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        { role: "system", content: "你是一个专业的翻译助手，将英文翻译成中文" },
                        { role: "user", content: `请将以下英文翻译成中文：\n\n${text}` }
                    ],
                    max_tokens: 300,
                    temperature: 0.3
                })
            });
            
            if (!response.ok) throw new Error("API 请求失败");
            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error("翻译失败:", error);
            return "[翻译失败]";
        }
    }

    // ============= 获取游戏信息 =============
    getGameInfo() {
        return {
            title: this.config.title,
            version: this.config.version,
            theme: this.config.theme,
            locationsCount: this.state.locations.length,
            encountersCount: this.state.encounters.length,
            medalsCount: this.state.medals.length
        };
    }

    // ============= 抽象方法（子类必须实现） =============
    /**
     * 子类必须实现这个方法，返回游戏的初始场景
     */
    async startGame() {
        throw new Error("子类必须实现 startGame 方法");
    }

    /**
     * 子类必须实现这个方法，返回地点列表
     */
    getLocations() {
        throw new Error("子类必须实现 getLocations 方法");
    }

    /**
     * 子类必须实现这个方法，返回 NPC 列表
     */
    getNpcs() {
        throw new Error("子类必须实现 getNpcs 方法");
    }
}

// 暴露到全局
window.BaseGame = BaseGame;

console.log("✅ BaseGame 类已加载 - 基础游戏框架就绪");
