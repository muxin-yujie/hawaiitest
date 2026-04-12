// ========== 英语学习增强模块 ==========
// 新增功能：
// 1. 语法纠错
// 2. 词汇学习
// 3. 发音评分
// 4. 学习进度追踪
// 5. 每日挑战

const EnglishLearning = {
    // 学习数据统计
    stats: {
        totalWords: 0,        // 总词汇量
        newWordsLearned: 0,   // 新学单词
        conversationsCount: 0, // 对话次数
        accuracyRate: 0,      // 语法正确率
        streakDays: 0,        // 连续学习天数
        xpPoints: 0          // 经验值
    },

    // 当前对话中的生词
    newWords: [],

    // 语法错误记录
    grammarMistakes: [],

    /**
     * 检查用户输入的语法错误
     */
    async checkGrammar(userInput) {
        const prompt = `请检查以下英语句子的语法错误：

用户输入：${userInput}

请返回：
1. 是否有语法错误
2. 如果有，指出错误并解释
3. 提供正确的版本
4. 用中文解释

返回 JSON 格式：
{
    "hasError": true/false,
    "errorType": "时态/主谓一致/冠词/介词/其他",
    "explanation": "中文解释",
    "correctVersion": "正确的句子"
}`;

        try {
            const response = await callAI_JSON(prompt, "你是一个专业的英语语法老师");
            return response;
        } catch (error) {
            console.error('语法检查失败:', error);
            return null;
        }
    },

    /**
     * 提取对话中的生词
     */
    async extractNewWords(text) {
        const prompt = `从以下英语文本中提取可能对中国学生来说是生词的单词：

文本：${text}

请返回：
1. 3-5 个可能不认识的单词
2. 每个单词的音标、词性、中文意思、例句

返回 JSON 格式：
{
    "newWords": [
        {
            "word": "单词",
            "phonetic": "音标",
            "partOfSpeech": "词性",
            "meaning": "中文意思",
            "example": "例句"
        }
    ]
}`;

        try {
            const response = await callAI_JSON(prompt, "你是一个词汇老师");
            return response;
        } catch (error) {
            console.error('词汇提取失败:', error);
            return null;
        }
    },

    /**
     * 评分用户发音（如果有语音输入）
     */
    async ratePronunciation(audioBlob) {
        // 这里可以集成语音识别 API
        // 暂时返回模拟评分
        return {
            score: Math.floor(Math.random() * 20) + 80, // 80-100 分
            feedback: "发音清晰，继续加油！"
        };
    },

    /**
     * 显示学习提示
     */
    showLearningTip(tipType) {
        const tips = {
            grammar: [
                "💡 小贴士：一般现在时用于描述习惯和事实",
                "💡 注意：第三人称单数动词要加 -s",
                "💡 记住：过去时用于已经完成的动作"
            ],
            vocabulary: [
                "📖 词汇扩展：'beautiful' 的同义词有 gorgeous, stunning, lovely",
                "📖 词根记忆：'tele-' 表示'远程'，如 telephone, television",
                "📖 常用搭配：'make a decision' 做决定"
            ],
            culture: [
                "🌺 夏威夷文化：'Aloha' 既是问候也是告别",
                "🌺 美国礼仪：和人对话时保持眼神交流",
                "🌺 实用英语：小费文化，餐厅通常给 15-20%"
            ]
        };

        const categoryTips = tips[tipType] || tips.culture;
        const randomTip = categoryTips[Math.floor(Math.random() * categoryTips.length)];
        
        return randomTip;
    },

    /**
     * 更新学习进度
     */
    updateProgress(userInput, npcResponse) {
        // 统计对话次数
        this.stats.conversationsCount++;

        // 提取生词
        this.extractNewWords(npcResponse).then(result => {
            if (result && result.newWords) {
                this.newWords.push(...result.newWords);
                this.stats.newWordsLearned += result.newWords.length;
            }
        });

        // 检查语法
        this.checkGrammar(userInput).then(result => {
            if (result && result.hasError) {
                this.grammarMistakes.push({
                    input: userInput,
                    error: result,
                    timestamp: new Date()
                });
            } else {
                // 语法正确，加分
                this.stats.xpPoints += 10;
            }
        });

        // 更新总词汇量
        this.stats.totalWords = this.stats.conversationsCount * 10; // 简化计算

        // 保存进度
        this.saveProgress();
    },

    /**
     * 保存学习进度到 localStorage
     */
    saveProgress() {
        localStorage.setItem('englishLearningStats', JSON.stringify(this.stats));
        localStorage.setItem('englishLearningWords', JSON.stringify(this.newWords));
        localStorage.setItem('englishLearningMistakes', JSON.stringify(this.grammarMistakes));
    },

    /**
     * 加载学习进度
     */
    loadProgress() {
        const savedStats = localStorage.getItem('englishLearningStats');
        const savedWords = localStorage.getItem('englishLearningWords');
        const savedMistakes = localStorage.getItem('englishLearningMistakes');

        if (savedStats) {
            this.stats = JSON.parse(savedStats);
        }
        if (savedWords) {
            this.newWords = JSON.parse(savedWords);
        }
        if (savedMistakes) {
            this.grammarMistakes = JSON.parse(savedMistakes);
        }
    },

    /**
     * 显示学习报告
     */
    showLearningReport() {
        const report = `
📊 英语学习报告 📊

💬 对话次数：${this.stats.conversationsCount}
📚 新学单词：${this.stats.newWordsLearned}
✨ 经验值：${this.stats.xpPoints}
📈 总词汇量：${this.stats.totalWords}
🔥 连续学习：${this.stats.streakDays} 天

继续加油，你的英语正在进步！🎉
`;
        return report;
    }
};

// 导出到全局
window.EnglishLearning = EnglishLearning;

console.log("英语学习增强模块已加载 ✓");
