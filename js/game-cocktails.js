// 鸡尾酒故事卡片 - 带图片版本
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
        <div style="position: relative; width: 100%; height: 320px; background: ${story.gradient}; overflow: hidden;">
            <img src="${imageUrl}" onerror="this.style.display='none'" style="position: absolute; width: 100%; height: 100%; object-fit: cover; object-position: center;" alt="${story.name}">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 100px; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);"></div>
            <button onclick="closeCocktailPopup()" style="position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.25); border: none; border-radius: 50%; width: 34px; height: 34px; cursor: pointer; color: white; font-size: 1.4em; transition: all 0.2s; backdrop-filter: blur(10px); z-index: 10;" onmouseover="this.style.background='rgba(255,255,255,0.35)'" onmouseout="this.style.background='rgba(255,255,255,0.25)'">✕</button>
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
            <button onclick="showCocktailStory(null, ${currentIndex - 1})" style="flex: 1; background: ${prevDisabled ? '#e9ecef' : 'white'}; border: 1px solid ${prevDisabled ? '#dee2e6' : '#ced4da'}; border-radius: 9px; padding: 10px 12px; cursor: ${prevDisabled ? 'not-allowed' : 'pointer'}; color: ${prevDisabled ? '#6c757d' : '#495057'}; font-weight: 600; font-size: 0.83em; transition: all 0.2s; box-shadow: ${prevDisabled ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'};" ${!prevDisabled ? `onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.05)';"` : ''}>← 上一个</button>
            <button onclick="showCocktailStory(null, ${currentIndex + 1})" style="flex: 1; background: ${story.gradient}; border: none; border-radius: 9px; padding: 10px 12px; cursor: ${nextDisabled ? 'not-allowed' : 'pointer'}; color: white; font-weight: 600; font-size: 0.83em; transition: all 0.2s; box-shadow: ${nextDisabled ? 'none' : '0 4px 12px rgba(0,0,0,0.15)'}; opacity: ${nextDisabled ? '0.6' : '1'};" ${!nextDisabled ? `onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)';"` : ''}>下一个 →</button>
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

// 显示鸡尾酒菜单（小巧横条）
window.showCocktailMenu = function() {
    const chatContainer = document.getElementById('chatContainer');
    
    // 检查是否已经添加过鸡尾酒菜单到 notebook
    const hasCocktailNotebook = gameState.notebook && gameState.notebook.some(note => 
        note.title === "🍹 特色鸡尾酒"
    );
    
    // 如果没有添加过，添加到 notebook
    if (!hasCocktailNotebook) {
        if (!gameState.notebook) {
            gameState.notebook = [];
        }
        gameState.notebook.push({
            title: "🍹 特色鸡尾酒",
            content: "Duke's Waikiki 酒吧的特色鸡尾酒：Mai Tai、Lava Flow、Blue Hawaii",
            timestamp: new Date().toLocaleString('zh-CN'),
            type: "cocktail_menu"
        });
        console.log("✅ 鸡尾酒菜单已添加到 notebook");
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
                <button onclick="showCocktailStory('mai_tai')" style="
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
                <button onclick="showCocktailStory('lava_flow')" style="
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
                <button onclick="showCocktailStory('blue_hawaii')" style="
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
};

console.log("Cocktail stories module loaded ✓");
console.log("showCocktailMenu:", typeof window.showCocktailMenu);
console.log("showCocktailStory:", typeof window.showCocktailStory);
