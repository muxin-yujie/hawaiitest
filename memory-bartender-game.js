/**
 * 记忆调酒师 - 记忆配料游戏
 * 基于三张夏威夷鸡尾酒图片
 */

// ========== 游戏数据 ==========

const COCKTAILS = [
    {
        name: "Mai Tai",
        chineseName: "迈泰",
        emoji: "🍹",
        image: 'pictures/Mai Tai.png',
        ingredients: ["朗姆酒", "菠萝汁", "橙汁", "杏仁糖浆", "碎冰"],
        allIngredients: [
            { name: "朗姆酒", icon: "🍶" },
            { name: "菠萝汁", icon: "🍍" },
            { name: "橙汁", icon: "🍊" },
            { name: "杏仁糖浆", icon: "🥥" },
            { name: "碎冰", icon: "🧊" },
            { name: "伏特加", icon: "🍶" },
            { name: "草莓", icon: "🍓" },
            { name: "椰奶", icon: "🥥" }
        ]
    },
    {
        name: "Lava Flow",
        chineseName: "熔岩流",
        emoji: "🌋",
        image: 'pictures/lava flow.png',
        ingredients: ["朗姆酒", "椰奶", "菠萝汁", "草莓", "碎冰"],
        allIngredients: [
            { name: "朗姆酒", icon: "🍶" },
            { name: "菠萝汁", icon: "🍍" },
            { name: "橙汁", icon: "🍊" },
            { name: "杏仁糖浆", icon: "🥥" },
            { name: "碎冰", icon: "🧊" },
            { name: "草莓", icon: "🍓" },
            { name: "椰奶", icon: "🥥" },
            { name: "柠檬汁", icon: "🍋" }
        ]
    },
    {
        name: "Blue Hawaii",
        chineseName: "蓝色夏威夷",
        emoji: "🌊",
        image: 'pictures/blue Hawaii.png',
        ingredients: ["伏特加", "蓝橙力娇酒", "菠萝汁", "柠檬汁", "碎冰"],
        allIngredients: [
            { name: "朗姆酒", icon: "🍶" },
            { name: "菠萝汁", icon: "🍍" },
            { name: "橙汁", icon: "🍊" },
            { name: "杏仁糖浆", icon: "🥥" },
            { name: "碎冰", icon: "🧊" },
            { name: "伏特加", icon: "🍶" },
            { name: "蓝橙力娇酒", icon: "🔵" },
            { name: "柠檬汁", icon: "🍋" }
        ]
    }
];

// ========== 游戏核心类 ==========

class MemoryBartenderGame {
    constructor() {
        this.currentLevel = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.totalAttempts = 0;
        this.selectedIngredients = [];
        this.countdownValue = 5;
        this.countdownTimer = null;

        this.elements = {
            memoryImage: document.getElementById('memoryImage'),
            countdown: document.getElementById('countdown'),
            memoryPhase: document.getElementById('memoryPhase'),
            ingredientsPhase: document.getElementById('ingredientsPhase'),
            ingredientsGrid: document.getElementById('ingredientsGrid'),
            feedback: document.getElementById('feedback'),
            levelDisplay: document.getElementById('levelDisplay'),
            scoreDisplay: document.getElementById('scoreDisplay'),
            accuracyDisplay: document.getElementById('accuracyDisplay'),
            startOverlay: document.getElementById('startOverlay'),
            endOverlay: document.getElementById('endOverlay'),
            finalScore: document.getElementById('finalScore'),
            finalAccuracy: document.getElementById('finalAccuracy'),
            finalMessage: document.getElementById('finalMessage')
        };

        this.init();
    }

    init() {
        console.log('🍹 记忆调酒师 初始化完成');
    }

    startGame() {
        this.currentLevel = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.totalAttempts = 0;
        
        this.elements.startOverlay.classList.add('hidden');
        this.loadLevel(0);
        
        console.log('游戏开始！');
    }

    loadLevel(index) {
        const cocktail = COCKTAILS[index];
        this.selectedIngredients = [];
        
        // 更新统计
        this.elements.levelDisplay.textContent = `${index + 1}/${COCKTAILS.length}`;
        
        // 显示记忆阶段
        this.elements.memoryPhase.style.display = 'block';
        this.elements.ingredientsPhase.style.display = 'none';
        this.elements.feedback.classList.add('hidden');
        
        // 加载图片（处理空格）
        const imageUrl = cocktail.image.replace(/ /g, '%20');
        this.elements.memoryImage.src = imageUrl;
        
        // 添加图片加载失败处理
        this.elements.memoryImage.onerror = () => {
            console.log('图片加载失败，使用渐变色');
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 400, 400);
            
            if (index === 0) {
                gradient.addColorStop(0, '#ff6b6b');
                gradient.addColorStop(1, '#f8a5c2');
            } else if (index === 1) {
                gradient.addColorStop(0, '#c44569');
                gradient.addColorStop(1, '#f78fb3');
            } else {
                gradient.addColorStop(0, '#3498db');
                gradient.addColorStop(1, '#74b9ff');
            }
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 400, 400);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 60px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(cocktail.emoji, 200, 170);
            ctx.font = '30px Arial';
            ctx.fillText(cocktail.name, 200, 250);
            
            this.elements.memoryImage.src = canvas.toDataURL();
        };
        
        // 开始倒计时
        this.startCountdown();
    }

    startCountdown() {
        this.countdownValue = 10;  // 增加观察时间：5 秒 → 10 秒
        this.elements.countdown.textContent = this.countdownValue;
        
        this.countdownTimer = setInterval(() => {
            this.countdownValue--;
            this.elements.countdown.textContent = this.countdownValue;
            
            if (this.countdownValue <= 0) {
                clearInterval(this.countdownTimer);
                this.showIngredientsPhase();
            }
        }, 1000);
    }

    showIngredientsPhase() {
        this.elements.memoryPhase.style.display = 'none';
        this.elements.ingredientsPhase.style.display = 'block';
        
        const cocktail = COCKTAILS[this.currentLevel];
        this.displayIngredients(cocktail);
    }

    displayIngredients(cocktail) {
        this.elements.ingredientsGrid.innerHTML = '';
        
        // 随机打乱配料顺序
        const shuffled = [...cocktail.allIngredients].sort(() => Math.random() - 0.5);
        
        shuffled.forEach(ingredient => {
            const btn = document.createElement('div');
            btn.className = 'ingredient-btn';
            btn.innerHTML = `
                <span class="ingredient-icon">${ingredient.icon}</span>
                <span class="ingredient-name">${ingredient.name}</span>
            `;
            btn.onclick = () => this.toggleIngredient(ingredient.name, btn);
            this.elements.ingredientsGrid.appendChild(btn);
        });
    }

    toggleIngredient(name, btnElement) {
        const index = this.selectedIngredients.indexOf(name);
        
        if (index > -1) {
            // 取消选择
            this.selectedIngredients.splice(index, 1);
            btnElement.classList.remove('selected');
        } else {
            // 选择
            this.selectedIngredients.push(name);
            btnElement.classList.add('selected');
        }
    }

    clearSelection() {
        this.selectedIngredients = [];
        const btns = this.elements.ingredientsGrid.querySelectorAll('.ingredient-btn');
        btns.forEach(btn => btn.classList.remove('selected'));
        this.elements.feedback.classList.add('hidden');
    }

    submitAnswer() {
        if (this.selectedIngredients.length === 0) {
            this.showMessage('⚠️ 请至少选择一个配料！', 'error');
            return;
        }
        
        const cocktail = COCKTAILS[this.currentLevel];
        const correctIngredients = cocktail.ingredients;
        
        // 检查答案
        let correct = 0;
        let wrong = 0;
        
        this.selectedIngredients.forEach(ing => {
            if (correctIngredients.includes(ing)) {
                correct++;
            } else {
                wrong++;
            }
        });
        
        // 计算遗漏的配料
        const missed = correctIngredients.filter(ing => !this.selectedIngredients.includes(ing)).length;
        
        // 评分
        const totalCorrect = correctIngredients.length;
        const accuracy = Math.round((correct / totalCorrect) * 100);
        
        // 更新统计
        this.totalAttempts++;
        if (accuracy >= 80) {
            this.correctAnswers++;
            this.score += accuracy * 10;
        }
        
        // 显示反馈
        this.showFeedback(correct, wrong, missed, accuracy);
        
        // 更新统计显示
        this.elements.scoreDisplay.textContent = this.score;
        this.elements.accuracyDisplay.textContent = `${Math.round((this.correctAnswers / this.totalAttempts) * 100)}%`;
        
        // 1.5 秒后进入下一关
        setTimeout(() => {
            if (this.currentLevel < COCKTAILS.length - 1) {
                this.currentLevel++;
                this.loadLevel(this.currentLevel);
            } else {
                this.endGame();
            }
        }, 3000);
    }

    showFeedback(correct, wrong, missed, accuracy) {
        this.elements.feedback.classList.remove('hidden');
        
        let message = '';
        if (accuracy >= 100) {
            message = `🎉 完美！全部正确！+${accuracy * 10}分`;
            this.elements.feedback.className = 'feedback success';
        } else if (accuracy >= 80) {
            message = `✅ 很好！正确 ${correct} 个，错误 ${wrong} 个，遗漏 ${missed} 个 +${accuracy * 10}分`;
            this.elements.feedback.className = 'feedback success';
        } else {
            message = `😅 继续加油！正确 ${correct} 个，错误 ${wrong} 个，遗漏 ${missed} 个`;
            this.elements.feedback.className = 'feedback error';
        }
        
        this.elements.feedback.textContent = message;
    }

    showMessage(message, type) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#f44336' : '#4CAF50'};
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 1.1em;
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 2000;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 2000);
    }

    endGame() {
        this.elements.finalScore.textContent = this.score;
        
        const accuracy = Math.round((this.correctAnswers / this.totalAttempts) * 100);
        this.elements.finalAccuracy.textContent = `正确率：${accuracy}%`;
        
        let message = '';
        if (accuracy >= 100) {
            message = '🏆 太厉害了！你是记忆大师！';
        } else if (accuracy >= 80) {
            message = '🎉 非常棒！对鸡尾酒很了解！';
        } else if (accuracy >= 60) {
            message = '👍 不错哦！继续努力！';
        } else {
            message = '📚 多多练习，你会更棒！';
        }
        
        this.elements.finalMessage.textContent = message;
        this.elements.endOverlay.classList.remove('hidden');
        
        console.log(`游戏结束！得分：${this.score}, 正确率：${accuracy}%`);
    }

    restartGame() {
        this.elements.endOverlay.classList.add('hidden');
        this.startGame();
    }
}

// ========== 启动游戏 ==========

const game = new MemoryBartenderGame();
window.memoryGame = game;
