# 全局对话结束机制文档

## 📋 概述

已将智能对话结束机制统一应用到整个游戏的所有 NPC 对话场景。

## 🎯 核心函数

### 1. `isStatementEnding(text)` - 基础检测
**位置**: [`js/utils.js`](file://c:\Users\28454\Documents\trae_projects\hawaii_modular\js\utils.js#L17-L27)

**功能**: 判断文本是否是陈述句结尾（可以结束对话）

**规则**:
- ❌ 包含问号（`?` 或 `？`）→ 返回 `false`（问句，不能结束）
- ✅ 以句号/感叹号结尾（`. ! 。！`）→ 返回 `true`（可以结束）

**示例**:
```javascript
isStatementEnding("How are you?")        // false - 问句
isStatementEnding("Nice meeting you.")   // true - 陈述句
isStatementEnding("Have fun!")           // true - 感叹句
```

---

### 2. `shouldEndConversation(npcResponse, userInput, options)` - 全局检测
**位置**: [`js/utils.js`](file://c:\Users\28454\Documents\trae_projects\hawaii_modular\js\utils.js#L37-L139)

**功能**: 统一的对话结束检测，应用于所有场景

**参数**:
```javascript
{
    npcResponse: string,      // NPC 的回复
    userInput: string,        // 用户的输入
    options: {
        minTurns: number,     // 最小对话轮数（默认 0）
        maxTurns: number,     // 最大对话轮数（默认 6）
        currentTurns: number, // 当前对话轮数
        requireFarewell: boolean // 是否需要告别词（默认 false）
    }
}
```

**返回**:
```javascript
{
    shouldEnd: boolean,       // 是否应该结束对话
    reason: string,          // 结束原因
    details: {               // 详细信息
        isNpcFinished: boolean,
        hasPlayerFarewell: boolean,
        hasNpcFarewell: boolean,
        hasNaturalEnding: boolean,
        currentTurns: number,
        maxTurns: number
    }
}
```

**5 大检测规则**:

1. **强制结束**: 对话轮数 >= maxTurns（默认 6 轮）
2. **最小轮数**: 对话轮数 < minTurns → 继续对话
3. **告别词检测**: 玩家或 NPC 有告别词
4. **陈述句检测**: NPC 以陈述句/感叹句结尾
5. **自然结束**: NPC 主动提出结束（"I should let you go..."）

---

## 🌍 全局应用场景

### 场景 1: 海关对话 (`storyPhase === "customs"`)
**配置**:
```javascript
window.shouldEndConversation(npcResponse, userInput, {
    currentTurns: gameState.conversationCount,
    minTurns: 0,
    maxTurns: 6,
    requireFarewell: false
})
```

**结束条件**: 
- ✅ NPC 以陈述句结尾
- ✅ 或有告别词
- ✅ 或达到 6 轮对话

**结束后**: 触发机场随机事件

---

### 场景 2: 机场邂逅 (`storyPhase === "encounter_chat"`)
**配置**:
```javascript
window.shouldEndConversation(npcResponse, userInput, {
    currentTurns: gameState.conversationCount,
    minTurns: 1,
    maxTurns: 6,
    requireFarewell: true  // 需要告别词
})
```

**结束条件**:
- ✅ NPC 以陈述句结尾 **+** 有人告别
- ✅ 或玩家明确告别
- ✅ 或 NPC 主动结束（"Enjoy your trip!"）
- ✅ 或达到 6 轮对话

**结束后**: 
1. 遇到导游
2. 2 秒后发送邀约短信

---

### 场景 3: 前往酒店 (`storyPhase === "toHotel"`)
**配置**: 同海关对话

**结束条件**: 陈述句结尾或告别词

**结束后**: 开始酒店入住

---

### 场景 4: 酒店入住 (`storyPhase === "hotelCheckIn"`)
**配置**: 同海关对话 + 额外要求 >= 3 轮

**结束条件**: 
- ✅ 全局检测通过
- ✅ 且对话轮数 >= 3

**结束后**: 进入第一个二级地点

---

### 场景 5: 二级地点探索 (`storyPhase === "secondaryLocation"`)
**配置**:
```javascript
window.shouldEndConversation(npcResponse, userInput, {
    currentTurns: gameState.conversationCount,
    minTurns: 4,
    maxTurns: 6,
    requireFarewell: false
})
```

**结束条件**:
- ✅ 全局检测通过
- ✅ 且对话轮数 >= 4

**结束后**: 
- 还有地点 → 前往下一个
- 没有地点 → 旅程结束

---

## 📊 配置对比表

| 场景 | minTurns | maxTurns | requireFarewell | 特殊要求 |
|------|----------|----------|-----------------|----------|
| 海关 | 0 | 6 | false | 无 |
| 邂逅 | 1 | 6 | **true** | 需要告别词 |
| 前往酒店 | 0 | 6 | false | 无 |
| 酒店入住 | 0 | 6 | false | >= 3 轮 |
| 二级地点 | **4** | 6 | false | >= 4 轮 |

---

## 🎮 实际效果示例

### 示例 1: 问句不会结束对话
```
NPC: "How are you today?"  ← 包含问号
玩家: "I'm fine, thanks!"
→ 对话继续 ✅
```

### 示例 2: 陈述句 + 告别词结束
```
NPC: "It was nice meeting you."  ← 陈述句
玩家: "Bye! Have a great day!"  ← 告别词
→ 对话结束 ✅
```

### 示例 3: 强制结束（防止无限对话）
```
第 1 轮：NPC 问候
第 2 轮：玩家回复
第 3 轮：NPC 分享故事
第 4 轮：玩家提问
第 5 轮：NPC 回答
第 6 轮：NPC 总结  ← 达到 maxTurns
→ 强制结束对话 ✅
```

### 示例 4: 自然结束
```
NPC: "I should let you go now. You must be tired from the flight. Enjoy your stay in Hawaii!"
→ 检测到自然结束模式 + 对话 >= 2 轮
→ 对话结束 ✅
```

---

## 🔧 如何修改配置

### 修改全局默认值
编辑 [`js/utils.js`](file://c:\Users\28454\Documents\trae_projects\hawaii_modular\js\utils.js#L45-L48):
```javascript
function shouldEndConversation(npcResponse, userInput, options = {}) {
    const {
        minTurns = 0,      // 修改默认最小轮数
        maxTurns = 6,      // 修改默认最大轮数
        currentTurns = 0,
        requireFarewell = false  // 修改默认是否需要告别词
    } = options;
    // ...
}
```

### 修改特定场景配置
编辑 [`js/game.js`](file://c:\Users\28454\Documents\trae_projects\hawaii_modular\js\game.js#L788-L795):
```javascript
// 海关场景
const endCheck = window.shouldEndConversation(npcResponse, userInput, {
    currentTurns: gameState.conversationCount,
    minTurns: 0,      // 修改这里
    maxTurns: 6,      // 修改这里
    requireFarewell: false  // 修改这里
});
```

---

## 📈 优化建议

### 1. 调整对话长度
- **想缩短对话**: 降低 `maxTurns`（如改为 4）
- **想延长对话**: 提高 `maxTurns`（如改为 8）
- **确保充分交流**: 提高 `minTurns`（如邂逅改为 2）

### 2. 调整结束难度
- **更容易结束**: `requireFarewell = false`
- **更难结束**: `requireFarewell = true`

### 3. 添加新的结束模式
在 [`js/utils.js`](file://c:\Users\28454\Documents\trae_projects\hawaii_modular\js\utils.js#L113-L121) 添加新的检测规则：
```javascript
// 规则 6: 检测 NPC 是否发出邀约
const invitationPatterns = [
    'would you like to', 'do you want to', 'how about'
];
const hasInvitation = invitationPatterns.some(pattern => 
    npcResponse.toLowerCase().includes(pattern)
);

if (hasInvitation && currentTurns >= 2) {
    shouldEnd = true;
    reasons.push('NPC 发出邀约');
}
```

---

## 🎯 总结

✅ **统一机制**: 所有场景使用同一个 `shouldEndConversation` 函数
✅ **智能检测**: 问句不会结束，只有陈述句才会
✅ **灵活配置**: 每个场景可以有不同的参数
✅ **防止无限**: maxTurns 强制结束对话
✅ **自然流畅**: 支持多种结束模式（告别、自然结束、强制结束）

---

**最后更新**: 2026-03-29
**维护者**: Hawaii Game Team
