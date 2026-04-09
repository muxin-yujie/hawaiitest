/**
 * 夏威夷调酒师 - 互动调酒游戏
 * 作为夏威夷冒险主游戏的文化小游戏
 */

// ========== 游戏数据 ==========

const COCKTAILS = [
    {
        name: "Mai Tai",
        chineseName: "迈泰",
        emoji: "🍹",
        image: 'pictures/Mai Tai.png',
        description: "经典的夏威夷鸡尾酒，琥珀色液体加冰块，装饰着菠萝、樱桃和小纸伞，充满热带风情。",
        cultureNote: "Mai Tai 是波利尼西亚文化中最具代表性的鸡尾酒，起源于 1944 年。它的名字在塔希提语中意为'最好的'或'远离尘世'。这款酒以其完美的酸甜平衡和浓郁的朗姆酒风味闻名，是夏威夷 Tiki 文化的象征。",
        ingredients: [
            { name: "朗姆酒", amount: "60ml", icon: "🍶" },
            { name: "菠萝汁", amount: "90ml", icon: "🍍" },
            { name: "橙汁", amount: "60ml", icon: "🍊" },
            { name: "杏仁糖浆", amount: "15ml", icon: "🥥" },
            { name: "碎冰", amount: "1 杯", icon: "🧊" },
            { name: "菠萝角", amount: "1 块", icon: "🍍" },
            { name: "红樱桃", amount: "1 颗", icon: "🍒" }
        ],
        steps: [
            "将朗姆酒、菠萝汁、橙汁倒入搅拌杯",
            "加入杏仁糖浆",
            "加入大量碎冰",
            "用搅拌机打成冰沙状",
            "倒入飓风杯",
            "用菠萝角和樱桃装饰"
        ],
        tips: "关键是要打成冰沙状，不要太稀也不要太稠。装饰要漂亮，体现热带风情！"
    },
    {
        name: "Lava Flow",
        chineseName: "熔岩流",
        emoji: "🌋",
        image: 'pictures/lava flow.png',
        description: "红白分层的冰沙鸡尾酒，象征夏威夷火山熔岩流入大海的壮观景象。",
        cultureNote: "Lava Flow 的灵感来自夏威夷大岛上的基拉韦厄火山，当红色草莓层像熔岩一样缓缓流下时，仿佛重现了火山喷发的壮观场景。这是夏威夷最具代表性的鸡尾酒之一。",
        ingredients: [
            { name: "朗姆酒", amount: "45ml", icon: "🍶" },
            { name: "椰奶", amount: "60ml", icon: "🥥" },
            { name: "菠萝汁", amount: "90ml", icon: "🍍" },
            { name: "草莓", amount: "4-5 颗", icon: "🍓" },
            { name: "碎冰", amount: "2 杯", icon: "🧊" },
            { name: "菠萝角", amount: "1 块", icon: "🍍" },
            { name: "红樱桃", amount: "1 颗", icon: "🍒" }
        ],
        steps: [
            "制作白色层：混合椰奶、菠萝汁、朗姆酒和冰块",
            "打成冰沙，倒入杯中至 2/3 满",
            "制作红色层：混合草莓、少量朗姆酒和冰块",
            "打成冰沙",
            "缓慢倒在白色层上，形成分层效果",
            "用菠萝和樱桃装饰"
        ],
        tips: "分层是关键！倒红色层时要慢，让它自然流下形成熔岩效果。"
    },
    {
        name: "Blue Hawaii",
        chineseName: "蓝色夏威夷",
        emoji: "🌊",
        image: 'pictures/blue Hawaii.png',
        description: "标志性的蓝色鸡尾酒，象征太平洋的蓝色海水，清爽怡人。",
        cultureNote: "Blue Hawaii 创作于 1957 年，是为了宣传电影《蓝色夏威夷》而设计的。它的蓝色来自蓝橙力娇酒，象征着夏威夷周围清澈的太平洋海水。这款酒迅速成为夏威夷的象征之一。",
        ingredients: [
            { name: "伏特加", amount: "30ml", icon: "🍶" },
            { name: "蓝橙力娇酒", amount: "30ml", icon: "🔵" },
            { name: "菠萝汁", amount: "90ml", icon: "🍍" },
            { name: "柠檬汁", amount: "15ml", icon: "🍋" },
            { name: "碎冰", amount: "1 杯", icon: "🧊" },
            { name: "菠萝角", amount: "1 块", icon: "🍍" },
            { name: "红樱桃", amount: "1 颗", icon: "🍒" },
            { name: "小纸伞", amount: "1 把", icon: "☂️" }
        ],
        steps: [
            "在摇酒壶中加入伏特加",
            "加入蓝橙力娇酒",
            "加入菠萝汁和柠檬汁",
            "加入冰块，摇匀",
            "倒入装有碎冰的飓风杯",
            "用菠萝、樱桃和小纸伞装饰"
        ],
        tips: "蓝色要鲜艳才漂亮！装饰要完整，小纸伞是 Tiki 文化的标志。"
    }
];

// ========== 游戏核心类 ==========

class BartenderGame {
    constructor() {
        this.currentLevel = 0;
        this.score = 0;
        this.completedCocktails = 0;
        this.currentStep = 0;
        this.addedIngredients = [];
        this.isMixed = false;
        this.hasIce = false;

        this.elements = {
            cocktailImage: document.getElementById('cocktailImage'),
            cocktailName: document.getElementById('cocktailName'),
            cocktailDescription: document.getElementById('cocktailDescription'),
            cultureNote: document.getElementById('cultureNote'),
            ingredientsList: document.getElementById('ingredientsList'),
            progressFill: document.getElementById('progressFill'),
            tipsSection: document.getElementById('tipsSection'),
            tipsContent: document.getElementById('tipsContent'),
            levelDisplay: document.getElementById('levelDisplay'),
            scoreDisplay: document.getElementById('scoreDisplay'),
            completedDisplay: document.getElementById('completedDisplay'),
            startOverlay: document.getElementById('startOverlay'),
            completeOverlay: document.getElementById('completeOverlay'),
            finalScore: document.getElementById('finalScore'),
            finalMessage: document.getElementById('finalMessage')
        };

        this.init();
    }

    init() {
        console.log('🍹 夏威夷调酒师 初始化完成');
    }

    startGame() {
        this.currentLevel = 0;
        this.score = 0;
        this.completedCocktails = 0;
        
        this.elements.startOverlay.classList.add('hidden');
        this.loadCocktail(0);
        
        console.log('游戏开始！');
    }

    loadCocktail(index) {
        const cocktail = COCKTAILS[index];
        this.currentStep = 0;
        this.addedIngredients = [];
        this.isMixed = false;
        this.hasIce = false;

        // 使用 URL 编码处理文件名中的空格
        const imageUrl = cocktail.image.replace(/ /g, '%20');
        this.elements.cocktailImage.src = imageUrl;
        
        // 图片加载处理
        this.elements.cocktailImage.onerror = () => {
            console.log('图片加载失败，使用占位图');
            // 创建渐变色占位图
            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');
            
            // 渐变色背景
            const gradient = ctx.createLinearGradient(0, 0, 300, 300);
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
            ctx.fillRect(0, 0, 300, 300);
            
            // 添加文字
            ctx.fillStyle = 'white';
            ctx.font = 'bold 40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(cocktail.emoji, 150, 120);
            ctx.font = '24px Arial';
            ctx.fillText(cocktail.name, 150, 180);
            
            this.elements.cocktailImage.src = canvas.toDataURL();
            this.elements.cocktailImage.style.display = 'block';
        };
        
        this.elements.cocktailImage.onload = () => {
            this.elements.cocktailImage.style.display = 'block';
        };

        // 更新信息
        this.elements.cocktailName.textContent = `${cocktail.emoji} ${cocktail.name}`;
        this.elements.cocktailDescription.textContent = cocktail.description;
        this.elements.cultureNote.textContent = `📖 ${cocktail.cultureNote}`;
        
        // 显示配方
        this.displayIngredients(cocktail);
        
        // 显示提示
        this.elements.tipsContent.textContent = cocktail.tips;
        this.elements.tipsSection.classList.remove('hidden');
        
        // 更新统计
        this.elements.levelDisplay.textContent = `${index + 1}/${COCKTAILS.length}`;
        this.updateProgress();
        
        console.log(`加载鸡尾酒：${cocktail.name}`);
    }

    displayIngredients(cocktail) {
        this.elements.ingredientsList.innerHTML = '';
        
        cocktail.ingredients.forEach((ingredient, index) => {
            const item = document.createElement('div');
            item.className = 'ingredient-item';
            item.id = `ingredient-${index}`;
            item.innerHTML = `
                <span class="ingredient-name">${ingredient.icon} ${ingredient.name}</span>
                <span class="ingredient-amount">${ingredient.amount}</span>
            `;
            this.elements.ingredientsList.appendChild(item);
        });
    }

    addIngredient() {
        const cocktail = COCKTAILS[this.currentLevel];
        
        if (this.currentStep < cocktail.ingredients.length - 2) {
            // 标记已添加的配料
            const ingredientEl = document.getElementById(`ingredient-${this.currentStep}`);
            if (ingredientEl) {
                ingredientEl.style.background = '#d4edda';
                ingredientEl.style.borderColor = '#28a745';
            }
            
            this.addedIngredients.push(this.currentStep);
            this.currentStep++;
            
            // 更新进度
            this.updateProgress();
            
            // 检查是否完成配料
            if (this.currentStep >= cocktail.ingredients.length - 2) {
                this.showMessage('✅ 配料已加完！现在可以搅拌或加冰了！');
            }
        } else {
            this.showMessage('⚠️ 配料已经加完了！');
        }
    }

    addIce() {
        if (this.hasIce) {
            this.showMessage('⚠️ 已经加过冰了！');
            return;
        }
        
        this.hasIce = true;
        this.currentStep++;
        this.updateProgress();
        this.showMessage('🧊 加入了冰块！');
    }

    mixCocktail() {
        if (this.isMixed) {
            this.showMessage('⚠️ 已经搅拌过了！');
            return;
        }
        
        const cocktail = COCKTAILS[this.currentLevel];
        const requiredIngredients = cocktail.ingredients.length - 2; // 减去装饰
        
        if (this.addedIngredients.length < requiredIngredients) {
            this.showMessage(`⚠️ 还需要添加 ${requiredIngredients - this.addedIngredients.length} 种配料！`);
            return;
        }
        
        this.isMixed = true;
        this.currentStep++;
        this.updateProgress();
        
        // 播放搅拌动画效果
        this.elements.cocktailImage.style.transform = 'rotate(360deg)';
        this.elements.cocktailImage.style.transition = 'transform 1s ease';
        
        setTimeout(() => {
            this.elements.cocktailImage.style.transform = 'rotate(0deg)';
        }, 1000);
        
        this.showMessage('🥄 搅拌完成！鸡尾酒已调制好！');
    }

    serveCocktail() {
        const cocktail = COCKTAILS[this.currentLevel];
        const requiredSteps = cocktail.ingredients.length;
        
        if (this.currentStep < requiredSteps - 1) {
            this.showMessage(`⚠️ 还需要完成 ${requiredSteps - 1 - this.currentStep} 个步骤！`);
            return;
        }
        
        // 完成本关
        this.score += 100;
        this.completedCocktails++;
        
        // 更新统计
        this.elements.scoreDisplay.textContent = this.score;
        this.elements.completedDisplay.textContent = `${this.completedCocktails}/${COCKTAILS.length}`;
        
        this.showMessage(`🎉 ${cocktail.name} 完成！+100 分！`);
        
        // 进入下一关
        setTimeout(() => {
            if (this.currentLevel < COCKTAILS.length - 1) {
                this.currentLevel++;
                this.loadCocktail(this.currentLevel);
            } else {
                this.completeGame();
            }
        }, 2000);
    }

    updateProgress() {
        const cocktail = COCKTAILS[this.currentLevel];
        const progress = Math.min(100, Math.floor((this.currentStep / cocktail.ingredients.length) * 100));
        this.elements.progressFill.style.width = `${progress}%`;
        this.elements.progressFill.textContent = `${progress}%`;
    }

    showMessage(message) {
        // 创建临时消息提示
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #ff6b6b, #f8a5c2);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 1.1em;
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 2000;
            animation: slideDown 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }

    completeGame() {
        this.elements.finalScore.textContent = this.score;
        
        let message = '';
        if (this.score >= 300) {
            message = '🏆 太厉害了！你是专业的夏威夷调酒师！';
        } else if (this.score >= 200) {
            message = '🎉 非常棒！你已经掌握了夏威夷鸡尾酒文化！';
        } else {
            message = '👍 不错哦！继续练习会成为调酒大师！';
        }
        
        this.elements.finalMessage.textContent = message;
        this.elements.completeOverlay.classList.remove('hidden');
        
        console.log(`游戏完成！最终得分：${this.score}`);
    }

    restartGame() {
        this.elements.completeOverlay.classList.add('hidden');
        this.startGame();
    }
}

// ========== 启动游戏 ==========

const game = new BartenderGame();
window.bartenderGame = game;
