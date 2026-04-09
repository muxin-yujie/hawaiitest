/**
 * ChatGPT 知识大挑战 - 游戏逻辑
 * 使用三张 ChatGPT 图片作为三个关卡的背景
 */

// ========== 游戏数据 ==========

// 三张夏威夷鸡尾酒图片路径
const GAME_IMAGES = [
    'pictures/ChatGPT Image 2026 年 4 月 6 日 04_40_45.png',
    'pictures/ChatGPT Image 2026 年 4 月 6 日 04_42_30.png',
    'pictures/ChatGPT Image 2026 年 4 月 6 日 04_42_45.png'
];

// 题库（每个关卡 5 道题，简单难度）
const QUESTION_BANKS = [
    // 关卡 1：Scorpion Frozen（冰冻蝎子鸡尾酒）- 简单题
    [
        {
            question: "这杯鸡尾酒是什么质地的？",
            options: ["冰沙状", "纯水状", "碳酸状", "热饮"],
            correct: 0
        },
        {
            question: "这杯酒的主要颜色是什么？",
            options: ["蓝色", "奶白色带红纹", "绿色", "紫色"],
            correct: 1
        },
        {
            question: "杯子上装饰了什么水果？",
            options: ["苹果", "菠萝", "西瓜", "葡萄"],
            correct: 1
        },
        {
            question: "这杯酒来自哪个地区？",
            options: ["北极", "夏威夷/热带", "沙漠", "高山"],
            correct: 1
        },
        {
            question: "杯子里插了什么？",
            options: ["吸管", "筷子", "勺子", "叉子"],
            correct: 0
        }
    ],
    // 关卡 2：Lava Flow（熔岩流）- 简单题
    [
        {
            question: "Lava Flow（熔岩流）的名字来自什么？",
            options: ["火山熔岩", "河流", "冰川", "沙漠"],
            correct: 0
        },
        {
            question: "这杯酒通常是什么颜色组合？",
            options: ["红白分层", "蓝绿分层", "黄紫分层", "黑白分层"],
            correct: 0
        },
        {
            question: "Lava Flow 是什么类型的饮品？",
            options: ["热咖啡", "冰镇鸡尾酒", "热茶", "温牛奶"],
            correct: 1
        },
        {
            question: "这杯酒装饰有什么？",
            options: ["薄荷叶", "菠萝和樱桃", "柠檬片", "橄榄"],
            correct: 1
        },
        {
            question: "Lava Flow 给人什么感觉？",
            options: ["寒冷", "热带热情", "苦涩", "严肃"],
            correct: 1
        }
    ],
    // 关卡 3：Blue Hawaii（蓝色夏威夷）- 简单题
    [
        {
            question: "Blue Hawaii 是什么颜色的？",
            options: ["红色", "蓝色", "绿色", "黄色"],
            correct: 1
        },
        {
            question: "Blue Hawaii 代表什么？",
            options: ["火山", "海水", "森林", "沙漠"],
            correct: 1
        },
        {
            question: "Blue Hawaii 来自哪里？",
            options: ["夏威夷", "阿拉斯加", "纽约", "伦敦"],
            correct: 0
        },
        {
            question: "Blue Hawaii 是什么类型的饮品？",
            options: ["热饮", "冷饮", "咖啡", "奶茶"],
            correct: 1
        },
        {
            question: "Blue Hawaii 给人什么感觉？",
            options: ["温暖", "清爽", "苦涩", "浓郁"],
            correct: 1
        }
    ]
];

// ========== 游戏核心类 ==========

class QuizGame {
    constructor() {
        // 游戏状态
        this.currentLevel = 0;
        this.currentQuestion = 0;
        this.score = 0;
        this.timeLeft = 30;
        this.timerInterval = null;
        this.isAnswering = false;

        // DOM 元素
        this.elements = {
            gameImage: document.getElementById('gameImage'),
            questionText: document.getElementById('questionText'),
            optionsContainer: document.getElementById('optionsContainer'),
            levelDisplay: document.getElementById('levelDisplay'),
            scoreDisplay: document.getElementById('scoreDisplay'),
            timerDisplay: document.getElementById('timerDisplay'),
            timerBar: document.getElementById('timerBar'),
            progressFill: document.getElementById('progressFill'),
            feedback: document.getElementById('feedback'),
            levelIndicator: document.getElementById('levelIndicator'),
            startOverlay: document.getElementById('startOverlay'),
            endOverlay: document.getElementById('endOverlay'),
            finalScore: document.getElementById('finalScore'),
            finalMessage: document.getElementById('finalMessage')
        };

        // 初始化
        this.init();
    }

    init() {
        console.log('🎮 ChatGPT 知识大挑战 初始化完成');
    }

    startGame() {
        // 重置游戏状态
        this.currentLevel = 0;
        this.currentQuestion = 0;
        this.score = 0;
        
        // 隐藏开始界面
        this.elements.startOverlay.classList.add('hidden');
        
        // 加载第一关
        this.loadLevel(0);
        
        console.log('游戏开始！');
    }

    loadLevel(levelIndex) {
        this.currentLevel = levelIndex;
        this.currentQuestion = 0;
        
        // 更新背景图片
        this.elements.gameImage.src = GAME_IMAGES[levelIndex];
        
        // 添加图片加载失败处理
        this.elements.gameImage.onerror = () => {
            console.log(`图片加载失败：${GAME_IMAGES[levelIndex]}`);
            // 使用渐变色背景替代
            this.elements.gameImage.style.display = 'none';
            const colors = [
                'linear-gradient(135deg, #ff6b6b, #f8a5c2)',
                'linear-gradient(135deg, #c44569, #f78fb3)',
                'linear-gradient(135deg, #3498db, #74b9ff)'
            ];
            this.elements.imageContainer = this.elements.gameImage.parentElement;
            this.elements.imageContainer.style.background = colors[levelIndex];
        };
        
        // 更新关卡显示
        this.elements.levelDisplay.textContent = `${levelIndex + 1}/3`;
        this.elements.levelIndicator.textContent = `关卡 ${levelIndex + 1}`;
        
        console.log(`加载关卡 ${levelIndex + 1}`);
        
        // 加载第一道题
        this.loadQuestion();
    }

    loadQuestion() {
        const questions = QUESTION_BANKS[this.currentLevel];
        const question = questions[this.currentQuestion];
        
        // 更新问题文本
        this.elements.questionText.textContent = question.question;
        
        // 生成选项
        this.elements.optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.onclick = () => this.selectAnswer(index);
            this.elements.optionsContainer.appendChild(button);
        });
        
        // 重置反馈
        this.elements.feedback.classList.add('hidden');
        
        // 重置计时器
        this.resetTimer();
        
        // 更新进度条
        const totalQuestions = QUESTION_BANKS.length * 5;
        const currentProgress = (this.currentLevel * 5 + this.currentQuestion) / totalQuestions * 100;
        this.elements.progressFill.style.width = `${currentProgress}%`;
        
        this.isAnswering = true;
        console.log(`加载问题 ${this.currentQuestion + 1}`);
    }

    resetTimer() {
        // 清除之前的计时器
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // 重置时间（增加到 45 秒）
        this.timeLeft = 45;
        this.elements.timerDisplay.textContent = this.timeLeft;
        this.elements.timerBar.style.width = '100%';
        
        // 启动新计时器
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.elements.timerDisplay.textContent = this.timeLeft;
            this.elements.timerBar.style.width = `${(this.timeLeft / 45) * 100}%`;
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    selectAnswer(selectedIndex) {
        if (!this.isAnswering) return;
        this.isAnswering = false;
        
        // 清除计时器
        clearInterval(this.timerInterval);
        
        const questions = QUESTION_BANKS[this.currentLevel];
        const question = questions[this.currentQuestion];
        const isCorrect = selectedIndex === question.correct;
        
        // 更新选项样式
        const buttons = this.elements.optionsContainer.querySelectorAll('.option-btn');
        buttons.forEach((button, index) => {
            button.disabled = true;
            if (index === question.correct) {
                button.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                button.classList.add('wrong');
            }
        });
        
        // 显示反馈
        this.elements.feedback.classList.remove('hidden');
        if (isCorrect) {
            const points = 10 + Math.floor(this.timeLeft / 5); // 答对得 10 分，剩余时间加分
            this.score += points;
            this.elements.feedback.textContent = `✅ 正确！+${points}分`;
            this.elements.feedback.className = 'feedback correct';
        } else {
            this.score = Math.max(0, this.score - 2); // 答错只扣 2 分
            this.elements.feedback.textContent = '❌ 错误！-2 分';
            this.elements.feedback.className = 'feedback wrong';
        }
        
        // 更新得分
        this.elements.scoreDisplay.textContent = this.score;
        
        // 1 秒后进入下一题
        setTimeout(() => {
            this.nextQuestion();
        }, 1500);
    }

    timeUp() {
        if (!this.isAnswering) return;
        this.isAnswering = false;
        
        // 清除计时器
        clearInterval(this.timerInterval);
        
        // 显示正确答案
        const questions = QUESTION_BANKS[this.currentLevel];
        const question = questions[this.currentQuestion];
        
        const buttons = this.elements.optionsContainer.querySelectorAll('.option-btn');
        buttons.forEach((button, index) => {
            button.disabled = true;
            if (index === question.correct) {
                button.classList.add('correct');
            }
        });
        
        // 显示反馈
        this.elements.feedback.classList.remove('hidden');
        this.elements.feedback.textContent = '⏰ 时间到！-5 分';
        this.elements.feedback.className = 'feedback wrong';
        
        // 扣分（减少）
        this.score = Math.max(0, this.score - 2);
        this.elements.scoreDisplay.textContent = this.score;
        
        // 1 秒后进入下一题
        setTimeout(() => {
            this.nextQuestion();
        }, 1500);
    }

    nextQuestion() {
        this.currentQuestion++;
        
        const questions = QUESTION_BANKS[this.currentLevel];
        
        if (this.currentQuestion < questions.length) {
            // 还有问题，继续当前关卡
            this.loadQuestion();
        } else {
            // 当前关卡完成
            if (this.currentLevel < QUESTION_BANKS.length - 1) {
                // 进入下一关
                setTimeout(() => {
                    this.loadLevel(this.currentLevel + 1);
                }, 500);
            } else {
                // 游戏结束
                this.endGame();
            }
        }
    }

    endGame() {
        // 清除计时器
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // 更新进度条
        this.elements.progressFill.style.width = '100%';
        
        // 显示最终得分
        this.elements.finalScore.textContent = this.score;
        
        // 根据得分给出评价（降低标准）
        let message = '';
        if (this.score >= 100) {
            message = '🏆 太厉害了！你是夏威夷酒文化专家！';
        } else if (this.score >= 70) {
            message = '🎉 非常棒！对夏威夷鸡尾酒很了解！';
        } else if (this.score >= 40) {
            message = '👍 不错哦！已经掌握基础知识！';
        } else {
            message = '📚 继续了解夏威夷文化，你会更棒！';
        }
        
        this.elements.finalMessage.textContent = message;
        
        // 显示结束界面
        this.elements.endOverlay.classList.remove('hidden');
        
        console.log(`游戏结束！最终得分：${this.score}`);
    }

    restartGame() {
        // 隐藏结束界面
        this.elements.endOverlay.classList.add('hidden');
        
        // 重新开始
        this.startGame();
    }
}

// ========== 启动游戏 ==========

// 创建游戏实例
const game = new QuizGame();

// 导出到全局（方便调试）
window.quizGame = game;
