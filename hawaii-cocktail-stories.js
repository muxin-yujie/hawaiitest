/**
 * 夏威夷酒语故事 - 浪漫休闲文化体验
 * 三杯鸡尾酒，三个浪漫故事
 */

// ========== 故事数据 ==========

const STORIES = [
    {
        name: "Mai Tai",
        chineseName: "迈泰",
        emoji: "🍹",
        image: 'pictures/Mai Tai.png',
        subtitle: "「最好的」—— 塔希提语",
        story: `1944 年，加州奥克兰市，Trader Vic's 餐厅的创始人 Victor Bergeron 正在为两位来自塔希提的朋友调制一款新鸡尾酒。

Victor 取出了珍藏的 17 年陈年朗姆酒，加入新鲜的青柠汁、橙味利口酒，以及一丝传统的杏仁糖浆（Orgeat）。

当酒液调制完成，呈现出美丽的琥珀色时，两位塔希提朋友尝了一口。他们的眼睛立刻亮了起来，用塔希提语兴奋地喊道："Mai Tai - Ainé!"

这句话的意思是："最好的！无与伦比！"

Victor 被这个反应深深打动，决定就用"Mai Tai"来命名这款鸡尾酒。

从此，这款酒成为了 Tiki 文化中最经典的代表作，至今仍在世界各地的酒吧中被调制和享用。`,
        culture: `Mai Tai 的名字在塔希提语中意为"最好的"或"无与伦比"。它是 Tiki 文化中最具代表性的鸡尾酒之一。

在夏威夷和波利尼西亚文化中，分享饮品是一种重要的社交仪式。当主人为你调制一杯 Mai Tai 时，代表着对你的尊重和欢迎。

琥珀色的酒液来自陈年朗姆酒，象征着岁月的沉淀；青柠的酸爽代表着生活的活力；杏仁糖浆的甜味则是美好回忆的载体。

如今，Mai Tai 已经成为夏威夷旅游业的文化符号，每年吸引无数游客前来品尝这款传奇鸡尾酒。`,
        ingredients: [
            { name: "朗姆酒", icon: "🍶", meaning: "热情似火" },
            { name: "青柠汁", icon: "🍋", meaning: "清新的酸楚" },
            { name: "橙味利口酒", icon: "🍊", meaning: "甜蜜的邂逅" },
            { name: "杏仁糖浆", icon: "🥥", meaning: "温暖的回忆" },
            { name: "碎冰", icon: "🧊", meaning: "纯净的心" }
        ],
        romantic: "有人说，每一杯 Mai Tai 里都藏着一个未完的故事。当你举起这杯酒时，也许能听见远方爱人的心跳。"
    },
    {
        name: "Lava Flow",
        chineseName: "熔岩流",
        emoji: "🌋",
        image: 'pictures/lava flow.png',
        subtitle: "火山与海洋的邂逅",
        story: `夏威夷大岛上的基拉韦厄火山（Kilauea），是世界上最活跃的火山之一。当炽热的熔岩缓缓流入冰冷的太平洋时，蒸汽升腾，形成了地球上最壮观的自然奇观。

在夏威夷传统神话中，这座火山是火神佩蕾（Pele）的居所。佩蕾是夏威夷最重要的神祇之一，她既是毁灭者，也是创造者。她的愤怒会带来火山喷发，但她的创造力也塑造了夏威夷群岛。

Lava Flow 鸡尾酒的创作灵感正是来自这一自然奇观。红色的草莓层象征流动的熔岩，白色的椰奶层代表太平洋的海水。当两层缓缓交融，仿佛重现了火山熔岩入海的壮观景象。

这款酒的确切创作时间和作者已不可考，但它成为了夏威夷酒吧中最受欢迎的特色鸡尾酒之一。`,
        culture: `Lava Flow 的创作灵感来自夏威夷最独特的自然景观——火山熔岩流入大海。这是真实的地质现象，也是夏威夷群岛形成的方式。

在夏威夷神话中，火山女神佩蕾（Pele）是火与火山的主宰。她性格复杂，既有 destructive 的一面，也有 creative 的一面。夏威夷人相信，她的力量既带来破坏，也带来新生。

这款鸡尾酒的分层效果在视觉上重现了熔岩入海的景象：红色象征炽热的熔岩，白色象征海水与蒸汽。这种对比也体现了夏威夷文化中自然力量的平衡与和谐。

如今，Lava Flow 已成为夏威夷旅游体验的一部分，让游客在品尝美酒的同时，感受这座火山岛屿的独特魅力。`,
        ingredients: [
            { name: "朗姆酒", icon: "🍶", meaning: "火山的炽热" },
            { name: "草莓", icon: "🍓", meaning: "流动的熔岩" },
            { name: "椰奶", icon: "🥥", meaning: "温柔的海水" },
            { name: "菠萝汁", icon: "🍍", meaning: "热带的热情" },
            { name: "碎冰", icon: "🧊", meaning: "瞬间的凝固" }
        ],
        romantic: "就像熔岩与海水相遇创造出新的土地，最美好的爱情也能让两个不同的人创造出共同的未来。"
    },
    {
        name: "Blue Hawaii",
        chineseName: "蓝色夏威夷",
        emoji: "🌊",
        image: 'pictures/Blue Hawaii.png',
        subtitle: "太平洋的蓝色情书",
        story: `1957 年，好莱坞音乐电影《Blue Hawaii》在檀香山首映，主演是当时如日中天的猫王埃尔维斯·普雷斯利（Elvis Presley）。电影中的蓝色海水、白色沙滩、还有猫王深情的歌声，让全世界都爱上了夏威夷。

为了庆祝电影的成功，檀香山皇家夏威夷酒店（Royal Hawaiian Hotel）的调酒师 Mariano Licudine 决定创作一款能代表夏威夷的鸡尾酒。

他想要捕捉那种站在钻石山巅，俯瞰太平洋时的震撼——那种无边无际的蓝。他找到了蓝橙力娇酒（Blue Curaçao），那种深邃的蓝色，就像夏威夷周围的海水。

加入朗姆酒的醇厚，菠萝汁的甜美，青柠汁的清新，一杯 Blue Hawaii 就这样诞生了。

电影上映后，无数游客来到夏威夷，在威基基海滩的酒吧里点一杯 Blue Hawaii。它迅速成为了夏威夷浪漫文化的象征。`,
        culture: `Blue Hawaii 诞生于 1957 年，是好莱坞黄金时代与夏威夷旅游文化结合的产物。它的创作者 Mariano Licudine 是当时檀香山最著名的调酒师之一。

这款酒的蓝色来自蓝橙力娇酒，这是一种用柑橘皮调制的甜味利口酒，原产于荷兰。象征着太平洋深邃的海水。

在夏威夷文化中，蓝色（尤其是海洋的蓝色）代表着永恒、忠诚和宁静。古代夏威夷人相信，海洋是连接生者与逝者的桥梁，蓝色的海水承载着祖先的祝福。

如今，Blue Hawaii 已被国际调酒师协会（IBA）列为官方鸡尾酒，成为夏威夷在全球范围内的文化使者。在威基基海滩的日落时分，点一杯 Blue Hawaii，是每对情侣必做的浪漫仪式。`,
        ingredients: [
            { name: "朗姆酒", icon: "🍶", meaning: "纯净的爱" },
            { name: "蓝橙力娇酒", icon: "🔵", meaning: "深邃的海洋" },
            { name: "菠萝汁", icon: "🍍", meaning: "热带的甜蜜" },
            { name: "青柠汁", icon: "🍋", meaning: "初恋的酸涩" },
            { name: "碎冰", icon: "🧊", meaning: "晶亮的承诺" }
        ],
        romantic: "如果你爱一个人，就带 TA 去夏威夷，在海边共饮一杯 Blue Hawaii。让太平洋的风，见证你们的爱情。"
    }
];

// ========== 游戏核心类 ==========

class CocktailStories {
    constructor() {
        this.currentIndex = 0;
        this.elements = {
            storyCard: document.getElementById('storyCard'),
            progressDots: document.getElementById('progressDots'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            loveQuote: document.getElementById('loveQuote')
        };
        
        this.init();
    }

    init() {
        this.loadStory(0);
        this.updateNavigation();
        console.log('🌺 夏威夷酒语故事 加载完成');
    }

    loadStory(index) {
        const story = STORIES[index];
        
        // 处理图片路径
        const imageUrl = story.image.replace(/ /g, '%20');
        
        // 生成卡片内容
        this.elements.storyCard.innerHTML = `
            <img class="card-image" src="${imageUrl}" alt="${story.name}" 
                 onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(135deg, #ff6b6b, #f8a5c2)'">
            <div class="card-content">
                <h2 class="card-title">${story.emoji} ${story.name}</h2>
                <p class="card-subtitle">${story.subtitle}</p>
                
                <div class="story-section">
                    <h3>📖 浪漫故事</h3>
                    ${story.story.split('\n\n').map(p => `<p>${p}</p>`).join('')}
                </div>
                
                <div class="culture-box">
                    <h4> 文化知识</h4>
                    <p>${story.culture}</p>
                </div>
                
                <h3>🍹 配料与寓意</h3>
                <div class="ingredients-list">
                    ${story.ingredients.map(ing => `
                        <div class="ingredient-item">
                            <span class="ingredient-icon">${ing.icon}</span>
                            <span class="ingredient-name">${ing.name}</span>
                            <span style="font-size: 0.8em; color: #666;">${ing.meaning}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // 更新浪漫语录
        this.elements.loveQuote.textContent = story.romantic;
        
        // 更新进度点
        this.updateProgressDots(index);
        
        // 更新导航按钮
        this.updateNavigation();
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    nextStory() {
        if (this.currentIndex < STORIES.length - 1) {
            this.currentIndex++;
            this.loadStory(this.currentIndex);
        }
    }

    prevStory() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.loadStory(this.currentIndex);
        }
    }

    updateProgressDots(index) {
        const dots = this.elements.progressDots.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    updateNavigation() {
        this.elements.prevBtn.disabled = this.currentIndex === 0;
        this.elements.nextBtn.textContent = this.currentIndex === STORIES.length - 1 ? '完成 🎉' : '下一篇 →';
    }
}

// ========== 启动应用 ==========

const game = new CocktailStories();
window.cocktailStories = game;
