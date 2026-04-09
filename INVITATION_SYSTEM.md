# 📱 邀约系统实现机制详解

## 🎯 什么是邀约系统？

邀约系统是游戏中的一个特色功能：当玩家在机场邂逅某个 NPC 并结束对话后，NPC 会通过**手机短信**的方式向玩家发送邀约邀请，邀请玩家一起去某个地方游玩。

---

## 📊 完整流程图

```
玩家与 NPC 对话
    ↓
玩家说"bye"等告别词
    ↓
系统检测到对话结束
    ↓
等待 1 秒（显示加载动画）
    ↓
延迟 2 秒后触发邀约
    ↓
生成邀约内容（2 层策略）
    ├→ Layer 1: 从对话提取地点（AI）
    └→ Layer 2: 默认模板回退
    ↓
显示短信通知（从顶部滑出）
    ↓
玩家点击"接受"或"婉拒"
    ↓
处理邀约结果
```

---

## 📁 相关文件

### 核心文件
- `js/aigenerate/invitation.js` - **邀约系统主逻辑**（最重要！）
- `js/game.js` - 剧情流程控制（触发邀约的时机）
- `js/core.js` - 游戏状态管理（gameState）
- `css/style.css` - 短信通知的样式

---

## 🔍 核心实现机制

### 1️⃣ **触发时机**（game.js）

**位置**：`js/game.js` 第 899-903 行

```javascript
// 当检测到 NPC 对话结束（玩家说了 bye 等告别词）
setTimeout(async () => {
    const npcEncounter = gameState.encounters.find(e => e.name === npcName);
    await window.triggerEncounterInvitationSMS(npcEncounter, gameState.conversationHistory);
}, 2000);  // 延迟 2 秒后触发
```

**触发条件**：
1. ✅ 邂逅事件结束（玩家或 NPC 说了告别词）
2. ✅ 对话轮数达到要求（至少 1 轮）
3. ✅ 当前剧情阶段是 `encounter`

---

## 🎯 邀约生成 - 2 层策略

### 架构概览

```javascript
generateInvitation(npcEncounter, chatHistory)
├─ Layer 1: extractLocationFromChat(chatHistory)
│   └─ 从对话中提取 NPC 提到的地点（置信度 > 0.5 则使用）
│
└─ Layer 2: generateDefaultInvitation(npcEncounter)
    └─ selectBestLocation(npc, DEFAULT_LOCATIONS)
```

---

### 2️⃣ **Layer 1: 地点提取（AI 驱动）**

**函数**：`extractLocationFromChat(chatHistory)`

**作用**：分析对话历史，提取 NPC 提到的夏威夷地点

**AI 提示词要求返回的 JSON 格式**：
```json
{
    "location": "地点名称（英文）",
    "locationCN": "地点名称（中文）",
    "activity": "活动（中文）",
    "activityEn": "活动（英文）",
    "time": "时间（中文）",
    "timeEn": "时间（英文）",
    "reason": "为什么选择这个地点",
    "confidence": 0.8  // 置信度 0-1
}
```

**返回格式**：
```javascript
{
    name: "Diamond Head",
    scene: "钻石山",
    activity: "看日出徒步",
    activityEn: "hiking at sunrise",
    time: "明天清晨",
    timeEn: "early tomorrow morning",
    reason: "NPC 提到'我经常去那里拍日出'",
    confidence: 0.85
}
```

**使用条件**：只有当 `confidence > 0.5` 时才使用提取的地点

---

### 3️⃣ **Layer 2: 默认模板（智能匹配）**

**函数**：`generateDefaultInvitation(npcEncounter)`

**预设地点库**：`DEFAULT_LOCATIONS`（10 个地点）

```javascript
const DEFAULT_LOCATIONS = [
    { 
        name: "Waikiki Beach", 
        activity: "冲浪课程", 
        activityEn: "surfing lesson", 
        time: "明天早上", 
        timeEn: "tomorrow morning", 
        scene: "威基基海滩" 
    },
    { 
        name: "Diamond Head", 
        activity: "看日出徒步", 
        activityEn: "hiking at sunrise", 
        time: "明天清晨", 
        timeEn: "early tomorrow morning", 
        scene: "钻石山" 
    },
    // ... 共 10 个地点
];
```

**智能匹配**：`selectBestLocation(npc, locations)`

根据 NPC 的职业、性格和兴趣推荐最合适的地点：

| NPC 职业/性格 | 推荐地点 |
|--------------|---------|
| 冲浪、潜水 | Waikiki Beach |
| 摄影 | Diamond Head 或 Sunset Beach |
| 美食、厨师 | Duke's Restaurant |
| 艺术、音乐 | Polynesian Cultural Center |
| 生物、自然 | Hanauma Bay |
| 历史、文化 | Pearl Harbor |
| 瑜伽、冥想 | Byodo-In Temple |
| 户外、登山 | Diamond Head |
| 冒险性格 | Diamond Head |
| 安静性格 | Byodo-In Temple |
| 社交性格 | Duke's Restaurant |
| 放松性格 | Waikiki Beach 或 Sunset Beach |

**示例代码**：
```javascript
function selectBestLocation(npc, locations) {
    if (!npc) return locations[0];
    
    const occupation = (npc.occupation || '').toLowerCase();
    const personality = (npc.personality || '').toLowerCase();
    
    // 根据职业匹配
    if (occupation.includes('摄影') || occupation.includes('photo')) {
        return locations.find(l => l.name.includes('Diamond Head')) || locations[3];
    }
    
    // 根据性格匹配
    if (personality.includes('冒险') || personality.includes('adventurous')) {
        return locations.find(l => l.name.includes('Diamond Head')) || locations[1];
    }
    
    return locations[0];  // 默认返回第一个
}
```

---

## 📦 数据格式统一

### 邀约数据的标准格式（9 个字段）

所有函数返回的邀约数据都遵循统一格式：

```javascript
{
    npcLine: "Hey! It was great meeting you today...",
    chineseTranslation: "嘿！今天见到你很开心...",
    location: "Waikiki Beach",
    activity: "冲浪课程",
    activityEn: "surfing lesson",
    time: "明天早上",
    timeEn: "tomorrow morning",
    scene: "威基基海滩",
    reason: "基于聊天内容生成的邀约"
}
```

**字段说明**：
- `npcLine`: NPC 的英文邀约台词
- `chineseTranslation`: 中文翻译
- `location`: 地点的英文名称
- `activity`: 活动的中文名称
- `activityEn`: 活动的英文名称
- `time`: 时间的中文表达
- `timeEn`: 时间的英文表达
- `scene`: 地点的中文名称
- `reason`: 选择这个地点的理由

---

## 💾 邀约保存

**函数**：`saveInvitation(npcEncounter, invitationData)`

**保存位置**：
1. `gameState.encounters[].invitation` - NPC 的邀约信息
2. `gameState.pendingInvitations[]` - 全局邀约列表

**保存的数据结构**：
```javascript
const invitation = {
    encounterName: "Orion",
    npcLine: "Hey! It was great meeting you today...",
    chineseTranslation: "嘿！今天见到你很开心...",
    location: "Diamond Head",
    activity: "看日出徒步",
    activityEn: "hiking at sunrise",
    time: "明天清晨",
    timeEn: "early tomorrow morning",
    scene: "钻石山",
    reason: "基于聊天内容生成的邀约",
    status: 'pending',  // pending | accepted | rejected
    timestamp: "2026-03-30T10:30:00.000Z"
};
```

---

## 📱 短信显示

**函数**：`showInvitationSMS(invitation, npcName, npcChineseName)`

**UI 结构**：
```html
<div id="toastContainer">
    <div class="toast-notification">
        <div class="toast-content">
            <div class="toast-sender">来自 测试 NPC 的短信</div>
            <div class="toast-message">
                <div>嘿！今天见到你很开心...</div>
                <div style="font-size: 14px; color: #666;">
                    Hey! It was great meeting you today...
                </div>
            </div>
            <div class="toast-buttons">
                <button class="toast-btn toast-btn-accept">接受邀约</button>
                <button class="toast-btn toast-btn-decline">婉拒</button>
            </div>
        </div>
    </div>
</div>
```

**动画效果**：
- 滑入动画：从顶部滑入（0.5 秒）
- 自动滑出：2 秒后自动滑出（1.5 秒）
- 点击后立即滑出

**CSS 样式**：
```css
.toast-notification {
    background: linear-gradient(135deg, #ffc3d9 0%, #c3e6ff 100%);
    box-shadow: 0 4px 24px rgba(255, 105, 180, 0.25);
    border: 1px solid #ffd6e6;
    backdrop-filter: blur(30px);
    border-radius: 16px;
    min-width: 400px;
    z-index: 10000;
}
```

---

## 🎮 用户交互处理

### 接受邀约

**函数**：`window.handleAcceptInvitation(npcName, button)`

**流程**：
1. 清除自动隐藏 timer
2. 立即滑出短信通知
3. 调用 `window.acceptSMSInvitation(npcName)`
4. 更新邀约状态为 `accepted`
5. 显示系统消息
6. 更新游戏状态为 `free_time`

**系统消息**：
```
✨ 已接受 Orion 的邀约！稍后会收到详细安排。
```

### 拒绝邀约

**函数**：`window.handleDeclineInvitation(npcName, button)`

**流程**：
1. 清除自动隐藏 timer
2. 立即滑出短信通知
3. 调用 `window.declineSMSInvitation(npcName)`
4. 更新邀约状态为 `rejected`
5. 显示系统消息
6. 更新游戏状态为 `free_time`

**系统消息**：
```
已婉拒 Orion 的邀约。继续探索夏威夷吧！
```

---

## 📊 完整数据流

```
1. gameState.encounters[]      ← NPC 信息
2. gameState.conversationHistory[]  ← 对话历史
   ↓
3. triggerEncounterInvitationSMS()  ← 主入口函数
   ↓
4. generateInvitation()  → 2 层策略生成邀约
   ├→ extractLocationFromChat()  → 提取地点
   └→ selectBestLocation() + generateDefaultInvitation()  → 默认模板
   ↓
5. saveInvitation()  → 保存到 gameState
   ├→ gameState.encounters[].invitation
   └→ gameState.pendingInvitations[]
   ↓
6. showInvitationSMS()  → 显示 UI
   ↓
7. handleAccept/Decline()  → 用户点击
   ↓
8. accept/declineSMSInvitation()  → 更新状态
   └→ gameState.storyPhase = 'free_time'
```

---

## 🐛 常见问题

### Q1: 为什么没有触发邀约？
**检查点**：
1. ✅ 是否说了告别词（bye、再见等）
2. ✅ 对话轮数是否达到 1 轮
3. ✅ 当前剧情阶段是否是 `encounter`
4. ✅ 控制台是否有错误信息

### Q2: 短信通知不显示？
**检查点**：
1. ✅ `toastContainer` 是否创建成功
2. ✅ CSS 样式是否正确加载
3. ✅ 控制台是否有 JavaScript 错误

---

## 🔧 如何修改邀约内容？

### 修改默认邀约模板
编辑 `js/aigenerate/invitation.js` 中的 `DEFAULT_LOCATIONS`：

```javascript
const DEFAULT_LOCATIONS = [
    { 
        name: "你的地点", 
        activity: "活动中文名", 
        activityEn: "activity in English", 
        time: "时间中文", 
        timeEn: "time in English", 
        scene: "地点中文名" 
    },
    // 添加更多地点...
];
```

### 修改 AI 提示词
编辑 `js/aigenerate/invitation.js` 中的 `buildInvitationPrompt()` 函数：

```javascript
function buildInvitationPrompt(npcEncounter, chatHistory) {
    let prompt = `你的自定义提示词...\n\n`;
    // ...
    return prompt;
}
```

### 修改地点匹配规则
编辑 `js/aigenerate/invitation.js` 中的 `selectBestLocation()` 函数：

```javascript
function selectBestLocation(npc, locations) {
    const occupation = (npc.occupation || '').toLowerCase();
    
    if (occupation.includes('你的关键词')) {
        return locations.find(l => l.name.includes('地点名'));
    }
    
    return locations[0];
}
```

### 修改置信度阈值
编辑 `js/aigenerate/invitation.js` 中的 `generateInvitation()` 函数：

```javascript
// 默认阈值是 0.5
if (extractedLocation && extractedLocation.confidence > 0.5) {
    // 使用提取的地点
}
```

---

## 📝 总结

邀约系统的核心机制：

### 1. **触发流程**
- 检测对话结束 → 延迟 2 秒 → 触发邀约

### 2. **生成策略（2 层）**
- Layer 1: 从对话提取地点（AI，置信度 > 0.5）
- Layer 2: 默认模板回退（智能匹配 NPC 职业/性格）

### 3. **数据格式**
- 统一的 9 字段格式
- 自动补充缺失字段
- 确保 UI 显示正常

### 4. **性能优化**
- 移除了多余的 AI 生成层
- 只在需要时调用 AI（提取地点）
- 默认模板无需 API 调用

### 5. **用户体验**
- 短信通知从顶部滑出
- 粉色渐变样式
- 2 秒后自动滑出
- 点击立即响应

### 6. **状态管理**
- 保存到 `gameState.encounters`
- 支持持久化
- 在 Encounters 面板中显示

整个流程完全自动化，玩家只需要：
- 与 NPC 正常对话
- 说告别词结束对话
- 等待 2 秒后收到短信
- 点击接受或拒绝

就这么简单！🎉

---

**最后更新**：2026-03-30
**版本**：v2.1（2 层策略优化版）
