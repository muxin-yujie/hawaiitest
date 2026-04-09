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
                    document.getElementById('chatContainer').appendChild(tipElement);
                    document.getElementById('chatContainer').scrollTop = document.getElementById('chatContainer').scrollHeight;
                    
                    // 保存到 notebook
                    gameState.notebook.push({
                        title: "🌸 文化小贴士",
                        content: tip,
                        date: new Date().toLocaleString('zh-CN')
                    });
                    
                    console.log("文化小贴士已保存到 notebook");
                }
            } catch (error) {
                console.error("文化小贴士生成失败:", error);
            }
        }

console.log("文化小贴士模块已加载 ✓");

// 暴露到全局作用域
window.generateAICultureTip = generateAICultureTip;