// ========== 成就事件提示词 ==========

/**
 * 成就事件提示词模块
 * 用于生成机场/各地触发的小插曲和成就徽章事件
 */

const MEDAL_PROMPTS = {
    /**
     * 冲浪店成就事件生成提示词
     * 用于在冲浪店触发小插曲和成就事件
     */
    GENERATE_SURF_SHOP_MEDAL: `为夏威夷冒险游戏生成一个冲浪店成就事件，用 JSON 格式返回。

【事件类型（随机选择其一）】
1. **修理冲浪板**：帮助 Maya 修理损坏的冲浪板（板面裂缝、脚绳断裂、尾舵松动等）
2. **整理货架**：帮助 Maya 整理杂乱的冲浪装备（冲浪板、脚绳、冲浪蜡、防晒泥等）
3. **接待顾客**：帮助 Maya 接待一个难缠的顾客（语言不通、挑剔商品、犹豫不决等）

【返回格式】
{
  "scene": "场景描述（中文，1-2 句话，生动具体，有画面感，描述事件起因）",
  "npc": {
    "name": "Maya",
    "emoji": "🏄‍♀️",
    "firstLine": "Maya 见到主角说的第一句话（英文，带动作描述，请求帮助或描述问题）",
    "thankYouLine": "事件完成后 Maya 感谢的话（英文，真诚友好）"
  },
  "medal": {
    "icon": "合适的 emoji（冲浪、帮助、友谊相关）",
    "name": "徽章名称（中文，3-5 个字，有创意）",
    "description": "徽章描述（中文，1-2 句话，与冲浪店和事件相关）"
  }
}

【创作原则】
1. **场景具体**：创造可感知的冲浪店场景（冲浪板、装备、海盐味、阳光等）
2. **情感真实**：展现 Maya 的真实情感（焦急、感激、开心等）
3. **情节有趣**：避免陈词滥调，创造有趣、温暖的情节
4. **徽章创意**：徽章名称和描述要有创意
5. **对话自然**：Maya 的对话要符合冲浪店打工女孩的身份（随和、阳光、友好）

【示例输出】
{
  "scene": "Maya 正在修理一块冲浪板，板面有一道明显的裂缝，她皱着眉头试图用树脂修补，但看起来有些手忙脚乱。",
  "npc": {
    "name": "Maya",
    "emoji": "🏄‍♀️",
    "firstLine": "*holding a cracked surfboard with a worried expression* Oh no... this customer's board got damaged. Can you help me hold this while I apply the resin? It's kind of tricky to do alone.",
    "thankYouLine": "You're a lifesaver! I couldn't have done it without you. Thanks for helping me out during the rush!"
  },
  "medal": {
    "icon": "🏄‍♀️",
    "name": "冲浪助手",
    "description": "在冲浪店帮助 Maya 修理冲浪板，展现了乐于助人的精神和对冲浪文化的热爱"
  }
}

请只返回 JSON，不要任何其他文字。确保 JSON 格式正确。`
};

// 导出到全局
window.PROMPTS = window.PROMPTS || {};
window.PROMPTS.MEDAL = MEDAL_PROMPTS;

console.log("成就事件提示词模块已加载 ✓");
