  async function generateAICultureTip(location, context) {
            try {
                // 检查已生成的文化小贴士，避免重复
                const existingTips = gameState.notebook
                    .filter(note => note.title === "🌸 文化小贴士")
                    .map(note => note.content);
                
                const existingTipsText = existingTips.length > 0 
                    ? `之前已经生成过的文化小贴士（不要重复）：${existingTips.join('; ')}` 
                    : '';
                
                const tipPrompt = `【角色】你是夏威夷文化专家，善于发现对话中的文化亮点并分享有趣的小知识

【任务】基于对话内容，从以下类别中选择一个最相关的主题，生成有趣的小贴士：

【内容类别】（每次选择一个最相关的）
🍽️ **美食类** - 当地特色食物、餐厅文化、饮食习惯
   - 如：poi（芋头泥）、kalua pig（烤猪）、poke（生鱼沙拉）、malasada（葡式甜甜圈）
   - 如：夏威夷融合菜（fusion cuisine）、餐车文化（food truck）
   
🌺 **文化类** - 传统习俗、价值观、礼仪、节日
   - 如：Aloha 精神、lei 文化、hula 舞蹈、音乐传统、ohana家庭
   - 如：家庭观念、待客之道、传统仪式
   
🗣️ **俚语/语言类** - 夏威夷语词汇、当地表达方式、发音
   - 如：Aloha（爱/问候/再见）、Mahalo（谢谢）、Ohana（家人）
   - 如：Pidgin（夏威夷克里奥尔语）、地名发音
   
🏝️ **地理/自然类** - 岛屿特色、地理知识、动植物
   - 如：火山、珊瑚礁、特有物种（海龟、僧海豹）、咖啡
   - 如：各岛屿特色、气候、地形
   
📚 **历史/传说类** - 历史事件、神话传说、名人故事
   - 如：卡美哈梅哈国王、珍珠港、传教士时代
   - 如：火山女神佩蕾、美人鱼传说
   
🏄 **活动/运动类** - 冲浪、浮潜、徒步等
   - 如：冲浪文化、传统独木舟、户外探险

🎵 **音乐/艺术类** - 乐器、歌曲、艺术形式
   - 如：ukulele（四弦琴）、slack key 吉他、传统歌曲
   - 如：草裙舞音乐、现代夏威夷音乐、当地艺术家

🛍️ **购物/手工艺类** - 纪念品、手工艺品、当地品牌
   - 如：夏威夷衬衫（Aloha Shirt）、黑珍珠、科纳咖啡
   - 如：传统编织、木雕、贝壳工艺品、当地设计师品牌

【对话上下文】
${context}

${existingTipsText}

【表达要求】
1. **内容相关性**：必须与上文对话直接相关（提到的人/事/物/场景）
2. **类别选择**：根据对话内容，自然选择最匹配的类别
3. **表达多样化**（重要！）：不要总是用同一种开头，从以下方式中自然选择：
   - 陈述事实："在夏威夷，..."、"夏威夷人相信..."
   - 趣味发现："有趣的是，..."、"很少有人知道，..."
   - 实用建议："在夏威夷旅行时，..."、"当地人通常会..."
   - 文化解读："这体现了..."、"从夏威夷文化来看，..."
   - 也可以直接开始，不需要固定开头
4. **语气**：客观叙述，像朋友聊天一样自然
5. **长度**：1-2 句话，简短有趣
6. **语言**：中文

【避免】
- ❌ 不要泛泛而谈（如"Aloha 精神很重要"）
- ❌ 不要重复之前的内容
- ❌ 不要第一人称（如"我觉得"）
- ❌ 不要动作描述（如"微笑着说"）

【好的示例】
🍽️ "poi（芋头泥）是夏威夷传统主食，发酵后的 poi 叫 poi kulana，味道更酸"
🌺 "在夏威夷，给别人送 lei 时应该亲吻对方的脸颊，这是尊重的表现"
🗣️ "夏威夷语只有 12 个字母（5 个元音 +7 个辅音），所以很多英语单词被简化了"
🏝️ "夏威夷群岛由 137 个岛屿组成，但只有 7 个岛屿有人居住"
📚 "传说火山女神佩蕾住在基拉韦厄火山，她会用熔岩惩罚不尊重自然的人"
🏄 "传统夏威夷冲浪板叫 papa he'e nalu，用珍贵的 koa 木制作，只有酋长才能使用"
🎵 "ukulele 这个名字来自夏威夷语'跳蚤'，因为它演奏时手指跳动很快"
🛍️ "真正的夏威夷衬衫（Aloha Shirt）应该是 reverse print，图案印在布料内侧"`;
                
                const tip = await callAI(
                    tipPrompt,
                    "你是一个夏威夷文化专家，善于分享有趣的文化小贴士。",
                    100,
                    0.8
                );
                
                if (tip && tip.length > 10) {
                    // 显示小贴士
                    const tipElement = document.createElement('div');
                    tipElement.className = 'culture-tip';
                    tipElement.innerHTML = `
                        <div class="culture-tip-header">🌸 文化小贴士</div>
                        <div>${tip}</div>
                    `;
                    
                    // 使用统一的 getChatContainer 函数获取当前激活的聊天窗口
                    const chatContainer = window.getChatContainer ? window.getChatContainer() : document.querySelector('.chat-window.active');
                    if (chatContainer) {
                        chatContainer.appendChild(tipElement);
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                        
                        // 保存到 notebook
                        gameState.notebook.push({
                            title: "🌸 文化小贴士",
                            content: tip,
                            date: new Date().toLocaleString('zh-CN')
                        });
                        
                        console.log("文化小贴士已保存到 notebook");
                    } else {
                        console.warn("⚠️ 聊天窗口未找到，文化小贴士无法显示");
                    }
                }
            } catch (error) {
                console.error("文化小贴士生成失败:", error);
            }
        }

console.log("文化小贴士模块已加载 ✓");

// 暴露到全局作用域
window.generateAICultureTip = generateAICultureTip;

// ============================================================================
// 鸡尾酒故事卡片功能
// ============================================================================

window.showCocktailStory = function(cocktailId, currentIndex = 0) {
    const cocktails = ['mai_tai', 'lava_flow', 'blue_hawaii'];
    const stories = {
        'mai_tai': {
            name: "Mai Tai",
            emoji: "🍹",
            image: "pictures/Mai Tai.png",
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            accent: "#f093fb",
            origin: "1944 · Trader Vic's · 加州奥克兰",
            story: "Victor Bergeron 为塔希提朋友特调，客人品尝后高呼'Mai Tai - Roe Ae!'（塔希提语：最好的！）",
            ingredients: [
                { name: "陈年朗姆酒", emoji: "🥃" },
                { name: "青柠汁", emoji: "🍋" },
                { name: "橙皮利口酒", emoji: "🍊" },
                { name: "杏仁糖浆", emoji: "🌰" }
            ],
            culture: "塔希提语'最好的'，波利尼西亚文化对美国鸡尾酒文化的经典贡献",
            romantic: "每一杯 Mai Tai 里都藏着一个未完的故事"
        },
        'lava_flow': {
            name: "Lava Flow",
            emoji: "🌋",
            image: "pictures/lava flow.png",
            gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            accent: "#ff9a9e",
            origin: "夏威夷火山地质灵感",
            story: "灵感来自基拉韦厄火山岩浆入海的奇观，草莓红如熔岩，椰奶白似蒸汽，蓝酒代表海洋",
            ingredients: [
                { name: "草莓", emoji: "🍓" },
                { name: "椰奶", emoji: "🥥" },
                { name: "蓝色柑橘酒", emoji: "💙" },
                { name: "菠萝汁", emoji: "🍍" }
            ],
            culture: "夏威夷群岛由火山形成，火山女神 Pele 掌管创造与毁灭",
            romantic: "品尝的是夏威夷千万年的地质史诗"
        },
        'blue_hawaii': {
            name: "Blue Hawaii",
            emoji: "💙",
            image: "pictures/blue Hawaii.png",
            gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            accent: "#84ffff",
            origin: "1957 · 皇家夏威夷酒店 · Mariano Licudine",
            story: "为电影《Blue Hawaii》创作，天然柑橘提取物呈现深邃蓝色，随电影热映风靡全球",
            ingredients: [
                { name: "伏特加", emoji: "🍶" },
                { name: "蓝柑橘酒", emoji: "🔵" },
                { name: "椰奶", emoji: "🥥" },
                { name: "菠萝汁", emoji: "🍍" }
            ],
            culture: "蓝色来自天然柑橘，象征夏威夷在太平洋的独特地位",
            romantic: "夕阳染红海面，杯中保持着深邃的蓝，如夏威夷神秘的夜"
        }
    };
    
    if (typeof cocktailId === 'string') {
        currentIndex = cocktails.indexOf(cocktailId);
    }
    
    if (currentIndex < 0 || currentIndex >= cocktails.length) {
        currentIndex = 0;
    }
    
    const currentId = cocktails[currentIndex];
    const story = stories[currentId];
    if (!story) return;
    
    if (window.currentCocktailPopup) {
        window.currentCocktailPopup.storyDiv.remove();
    }
    
    const prevDisabled = currentIndex === 0;
    const nextDisabled = currentIndex === cocktails.length - 1;
    const imageUrl = story.image.replace(/ /g, '%20');
    
    const storyDiv = document.createElement('div');
    storyDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 20px;
        padding: 0;
        width: 90%;
        max-width: 400px;
        max-height: 85vh;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        z-index: 10000;
        animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    storyDiv.innerHTML = `
        <div style="position: relative; width: 100%; height: 260px; background: white; overflow: hidden;">
            <img src="${imageUrl}" onerror="this.style.display='none'" style="position: absolute; width: 100%; height: 100%; object-fit: contain; object-position: center; padding: 20px;" alt="${story.name}">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 120px; background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);"></div>
            <button onclick="window.closeCocktailPopup()" style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.15); border: none; border-radius: 50%; width: 34px; height: 34px; cursor: pointer; color: #333; font-size: 1.4em; transition: all 0.2s; backdrop-filter: blur(10px); z-index: 10;" onmouseover="this.style.background='rgba(0,0,0,0.25)'; this.style.color='#000';" onmouseout="this.style.background='rgba(0,0,0,0.15)'; this.style.color='#333';">✕</button>
            <div style="position: absolute; bottom: 14px; left: 18px; right: 18px; color: white; z-index: 5;">
                <h3 style="margin: 0; font-size: 1.5em; font-weight: 700; text-shadow: 0 2px 8px rgba(0,0,0,0.4);">${story.emoji} ${story.name}</h3>
                <div style="font-size: 0.72em; opacity: 0.95; margin-top: 5px; text-shadow: 0 1px 3px rgba(0,0,0,0.3);">${story.origin}</div>
            </div>
        </div>
        
        <div style="padding: 16px 18px 14px 18px; background: white;">
            <div style="font-size: 0.88em; line-height: 1.6; color: #333; margin-bottom: 14px;">${story.story}</div>
            
            <div style="margin-bottom: 14px;">
                <div style="font-size: 0.72em; font-weight: 600; color: #666; margin-bottom: 8px; letter-spacing: 1px;">🌿 配料</div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 7px;">
                    ${story.ingredients.map(ing => `
                        <div style="background: linear-gradient(135deg, rgba(106, 27, 154, 0.04), rgba(106, 27, 154, 0.07)); border: 1px solid rgba(106, 27, 154, 0.1); border-radius: 9px; padding: 9px 11px; font-size: 0.8em; display: flex; align-items: center; gap: 7px; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">
                            <span style="font-size: 1.3em;">${ing.emoji}</span>
                            <span style="line-height: 1.2; font-weight: 500; color: #444;">${ing.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="background: ${story.gradient}; border-radius: 10px; padding: 11px 13px; margin-bottom: 10px; font-size: 0.8em; line-height: 1.6; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.15);">
                <span style="font-weight: 600; margin-right: 5px; font-size: 1.05em;">📚</span>${story.culture}
            </div>
            
            <div style="background: linear-gradient(135deg, rgba(106, 27, 154, 0.04), rgba(106, 27, 154, 0.05)); border-left: 3px solid ${story.accent}; border-radius: 0 9px 9px 0; padding: 9px 12px; font-style: italic; font-size: 0.8em; line-height: 1.6; color: #666;">
                <span style="margin-right: 5px; font-size: 1.05em;">💭</span>${story.romantic}
            </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 12px 18px; display: flex; gap: 9px; border-top: 1px solid #e9ecef;">
            <button onclick="window.showCocktailStory(null, ${currentIndex - 1})" style="flex: 1; background: ${prevDisabled ? '#e9ecef' : 'white'}; border: 1px solid ${prevDisabled ? '#dee2e6' : '#ced4da'}; border-radius: 9px; padding: 10px 12px; cursor: ${prevDisabled ? 'not-allowed' : 'pointer'}; color: ${prevDisabled ? '#6c757d' : '#495057'}; font-weight: 600; font-size: 0.83em; transition: all 0.2s; box-shadow: ${prevDisabled ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'};" ${!prevDisabled ? `onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.05)';"` : ''}>← 上一个</button>
            <button onclick="window.showCocktailStory(null, ${currentIndex + 1})" style="flex: 1; background: ${story.gradient}; border: none; border-radius: 9px; padding: 10px 12px; cursor: ${nextDisabled ? 'not-allowed' : 'pointer'}; color: white; font-weight: 600; font-size: 0.83em; transition: all 0.2s; box-shadow: ${nextDisabled ? 'none' : '0 4px 12px rgba(0,0,0,0.15)'}; opacity: ${nextDisabled ? '0.6' : '1'};" ${!nextDisabled ? `onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)';"` : ''}>下一个 →</button>
        </div>
    `;
    
    document.body.appendChild(storyDiv);
    window.currentCocktailPopup = { storyDiv };
    
    const style = document.createElement('style');
    style.textContent = `@keyframes slideIn {from {opacity: 0; transform: translate(-50%, -60%); box-shadow: 0 10px 30px rgba(0,0,0,0.1);} to {opacity: 1; transform: translate(-50%, -50%); box-shadow: 0 20px 60px rgba(0,0,0,0.25);}}`;
    document.head.appendChild(style);
};

window.closeCocktailPopup = function() {
    if (window.currentCocktailPopup) {
        window.currentCocktailPopup.storyDiv.remove();
        window.currentCocktailPopup = null;
    }
};

window.showCocktailMenu = function() {
    // 使用统一的 getChatContainer 函数获取当前激活的聊天窗口
    const chatContainer = window.getChatContainer ? window.getChatContainer() : document.querySelector('.chat-window.active');
    
    if (!chatContainer) {
        console.error('❌ 聊天容器未找到！');
        return;
    }
    
    const menuDiv = document.createElement('div');
    menuDiv.className = 'system-message';
    menuDiv.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 12px 15px;
            margin: 10px 0;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            display: inline-block;
        ">
            <div style="display: flex; gap: 8px; align-items: center;">
                <span style="color: white; font-weight: bold; font-size: 0.9em;">🍹 特色鸡尾酒:</span>
                <button onclick="window.showCocktailStory('mai_tai')" style="
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    border: none;
                    border-radius: 6px;
                    padding: 6px 12px;
                    cursor: pointer;
                    color: white;
                    font-size: 0.85em;
                    font-weight: bold;
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">
                    🍹 Mai Tai
                </button>
                <button onclick="window.showCocktailStory('lava_flow')" style="
                    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
                    border: none;
                    border-radius: 6px;
                    padding: 6px 12px;
                    cursor: pointer;
                    color: white;
                    font-size: 0.85em;
                    font-weight: bold;
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">
                    🌋 Lava Flow
                </button>
                <button onclick="window.showCocktailStory('blue_hawaii')" style="
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    border: none;
                    border-radius: 6px;
                    padding: 6px 12px;
                    cursor: pointer;
                    color: white;
                    font-size: 0.85em;
                    font-weight: bold;
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">
                    💙 Blue Hawaii
                </button>
            </div>
        </div>
    `;
    
    chatContainer.appendChild(menuDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // 保存到 notebook - 只保存简洁条目
    const cocktailsNotebook = {
        title: "🍹 夏威夷鸡尾酒指南",
        content: `探索夏威夷最具代表性的三款经典鸡尾酒，每一杯都承载着独特的历史与文化`,
        date: new Date().toLocaleString('zh-CN')
    };
    
    gameState.notebook.push(cocktailsNotebook);
    console.log("鸡尾酒指南已保存到 notebook ✓");
};

console.log("鸡尾酒模块已加载 ✓");

// ============================================================================
// 卢奥晚宴文化指南功能
// ============================================================================

window.showLuauCultureGuide = function() {
    if (window.currentLuauPopup) {
        window.currentLuauPopup.storyDiv.remove();
    }
    
    const luauData = {
        title: "卢奥晚宴",
        emoji: "🌺",
        image: "pictures/luau-feast.png",
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        accent: "#ff9a9e",
        subtitle: "夏威夷传统盛宴 · 古老文化的传承",
        introduction: "卢奥（Luau）是夏威夷最盛大的传统宴会，起源于古代夏威夷的皇家祭祀仪式。如今，它已成为家人朋友欢聚、庆祝重要时刻的文化象征。",
        elements: [
            {
                icon: "🔥",
                title: "地下烤炉（Imu）",
                description: "传统的夏威夷烹饪方式，在地下挖坑，放入烧热的火山石，将整只猪包裹在香蕉叶中慢烤 6-8 小时，肉质鲜嫩多汁，带有独特的烟熏香气。"
            },
            {
                icon: "🐷",
                title: "卡鲁瓦猪（Kalua Pig）",
                description: "卢奥晚宴的主角，用海盐涂抹整只猪，放入 imu 中慢烤。烹饪过程本身就是一种仪式，象征着夏威夷人的热情好客。"
            },
            {
                icon: "🍠",
                title: "波伊（Poi）",
                description: "由芋头（kalo）捣碎制成的传统主食，呈紫色糊状。夏威夷人相信 kalo 是他们的祖先，因此 poi 在文化中具有神圣地位。口感独特，初尝者可能需要适应。"
            },
            {
                icon: "💃",
                title: "草裙舞（Hula）",
                description: "古老的波利尼西亚舞蹈，每个动作都讲述着夏威夷的神话、历史和传说。舞者通过手势、眼神和身体语言，传承着祖先的智慧和故事。"
            },
            {
                icon: "🔥",
                title: "火刀舞（Fire Knife Dance）",
                description: "萨摩亚传统舞蹈的现代演变，舞者手持燃烧的火刀，在鼓点中旋转跳跃，火星四溅，展现勇气与技巧，是卢奥晚宴最震撼的表演。"
            },
            {
                icon: "🥥",
                title: "豪皮亚（Haupia）",
                description: "传统的椰子布丁甜点，用椰奶、糖和玉米淀粉制成，口感滑嫩，清凉解腻，为丰盛的卢奥晚宴画上完美的句号。"
            }
        ],
        culture: "卢奥晚宴不仅是美食盛宴，更是夏威夷文化传承的载体。从 imu 的烹饪仪式到 hula 的古老舞步，从 ohana（家庭）的团聚到 aloha（爱）的传递，每一道菜、每一个表演都承载着夏威夷人的信仰、历史和价值观。",
        romantic: "在篝火摇曳的夜晚，与重要的人共享卢奥盛宴，品尝的是千年文化的味道，聆听的是岛屿传承的故事，感受的是 aloha 精神的永恒温暖。"
    };
    
    const storyDiv = document.createElement('div');
    storyDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 20px;
        padding: 0;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        z-index: 10000;
        animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    const imageUrl = luauData.image.replace(/ /g, '%20');
    
    storyDiv.innerHTML = `
        <div style="position: relative; width: 100%; height: 280px; background: white; overflow: hidden;">
            <img src="${imageUrl}" onerror="this.style.display='none'" style="position: absolute; width: 100%; height: 100%; object-fit: cover; object-position: center; padding: 0;" alt="${luauData.title}">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 140px; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);"></div>
            <button onclick="window.closeLuauCultureGuide()" style="position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.9); border: 2px solid rgba(0,0,0,0.2); border-radius: 50%; width: 40px; height: 40px; cursor: pointer; color: #333; font-size: 1.6em; font-weight: bold; transition: all 0.2s; backdrop-filter: blur(10px); z-index: 100; display: flex; align-items: center; justify-content: center; line-height: 1;" onmouseover="this.style.background='rgba(255,255,255,1)'; this.style.transform='scale(1.1)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.2)';" onmouseout="this.style.background='rgba(255,255,255,0.9)'; this.style.transform='scale(1)'; this.style.boxShadow='none';">✕</button>
            <div style="position: absolute; bottom: 14px; left: 18px; right: 18px; color: white; z-index: 5;">
                <h3 style="margin: 0; font-size: 1.6em; font-weight: 700; text-shadow: 0 2px 8px rgba(0,0,0,0.4);">${luauData.emoji} ${luauData.title}</h3>
                <div style="font-size: 0.75em; opacity: 0.95; margin-top: 5px; text-shadow: 0 1px 3px rgba(0,0,0,0.3);">${luauData.subtitle}</div>
            </div>
        </div>
        
        <div style="padding: 20px 22px 18px 22px; background: white;">
            <div style="font-size: 0.9em; line-height: 1.7; color: #555; margin-bottom: 18px; padding: 14px 16px; background: linear-gradient(135deg, rgba(240, 147, 251, 0.08), rgba(245, 87, 108, 0.08)); border-left: 4px solid #f093fb; border-radius: 10px;">
                ${luauData.introduction}
            </div>
            
            <div style="margin-bottom: 18px;">
                <div style="font-size: 0.85em; font-weight: 600; color: #666; margin-bottom: 12px; letter-spacing: 1px; display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 1.2em;">🌺</span> 卢奥盛宴元素
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                    ${luauData.elements.map(elem => `
                        <div style="background: linear-gradient(135deg, rgba(240, 147, 251, 0.05), rgba(245, 87, 108, 0.05)); border: 1px solid rgba(240, 147, 251, 0.15); border-radius: 12px; padding: 14px; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.08)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                            <div style="font-size: 2em; margin-bottom: 8px;">${elem.icon}</div>
                            <div style="font-size: 0.85em; font-weight: 600; color: #f093fb; margin-bottom: 6px;">${elem.title}</div>
                            <div style="font-size: 0.78em; line-height: 1.5; color: #666;">${elem.description}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="background: ${luauData.gradient}; border-radius: 14px; padding: 16px 18px; margin-bottom: 14px; font-size: 0.85em; line-height: 1.7; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.15);">
                <span style="font-weight: 600; margin-right: 6px; font-size: 1.1em;">📚</span>${luauData.culture}
            </div>
            
            <div style="background: linear-gradient(135deg, rgba(240, 147, 251, 0.06), rgba(245, 87, 108, 0.06)); border-left: 4px solid ${luauData.accent}; border-radius: 0 12px 12px 0; padding: 14px 16px; font-style: italic; font-size: 0.85em; line-height: 1.7; color: #666;">
                <span style="margin-right: 6px; font-size: 1.1em;">💭</span>${luauData.romantic}
            </div>
        </div>
    `;
    
    document.body.appendChild(storyDiv);
    window.currentLuauPopup = { storyDiv };
    
    const style = document.createElement('style');
    style.textContent = `@keyframes slideIn {from {opacity: 0; transform: translate(-50%, -60%); box-shadow: 0 10px 30px rgba(0,0,0,0.1);} to {opacity: 1; transform: translate(-50%, -50%); box-shadow: 0 20px 60px rgba(0,0,0,0.25);}}`;
    document.head.appendChild(style);
};

window.closeLuauCultureGuide = function() {
    if (window.currentLuauPopup) {
        window.currentLuauPopup.storyDiv.remove();
        window.currentLuauPopup = null;
    }
};

window.showLuauMenu = function() {
    // 使用统一的 getChatContainer 函数获取当前激活的聊天窗口
    const chatContainer = window.getChatContainer ? window.getChatContainer() : document.querySelector('.chat-window.active');
    
    if (!chatContainer) {
        console.error('❌ 聊天容器未找到！');
        return;
    }
    
    const menuDiv = document.createElement('div');
    menuDiv.className = 'system-message';
    menuDiv.innerHTML = '<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; padding: 12px 15px; margin: 10px 0; box-shadow: 0 3px 10px rgba(0,0,0,0.2); display: inline-block;"><div style="display: flex; gap: 8px; align-items: center;"><span style="color: white; font-weight: bold; font-size: 0.9em;">🌺 卢奥文化指南:</span><button onclick="window.showLuauCultureGuide()" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer; color: white; font-size: 0.85em; font-weight: bold; transition: transform 0.2s;" onmouseover="this.style.transform=\'scale(1.08)\'" onmouseout="this.style.transform=\'scale(1)\'">🌺 探索卢奥文化</button></div></div>';
    
    chatContainer.appendChild(menuDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // 保存到 notebook - 只保存简洁条目
    const luauNotebook = {
        title: "🌺 卢奥晚宴文化指南",
        content: "探索夏威夷最盛大的传统宴会，从地下烤炉到草裙舞，从卡鲁瓦猪到火刀舞，每一道菜、每一个表演都承载着千年的文化传承",
        date: new Date().toLocaleString('zh-CN')
    };
    
    gameState.notebook.push(luauNotebook);
    console.log("卢奥晚宴指南已保存到 notebook ✓");
};

console.log("卢奥晚宴文化模块已加载 ✓");
console.log("🌺 卢奥文化指南功能已就绪：window.showLuauCultureGuide()");
console.log("🌺 卢奥菜单功能已就绪：window.showLuauMenu()");