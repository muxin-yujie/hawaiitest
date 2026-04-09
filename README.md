# 🌺 夏威夷冒险 - 模块化版本使用说明

## 📁 项目架构

### 整体结构
```
hawaii_modular/
├── index.html          # 主入口文件（双击运行）
├── css/
│   └── style.css      # 全局样式（聊天界面、动画、响应式布局）
├── js/
│   ├── config.js          # 游戏配置（API 密钥、模型参数、功能开关）
│   ├── utils.js           # 通用工具函数（对话结束检测、文本分析）
│   ├── entry.js           # 游戏入口与核心交互（handleInput、场景初始化）
│   ├── game.js            # 游戏状态与剧情流程（场景管理、邂逅、成就、邀约）
│   ├── ui.js              # UI 渲染（消息气泡、加载动画、特效）
│   ├── ui-show.js         # 信息面板展示（地点、邂逅记录、成就等）
│   ├── music.js           # 背景音乐控制
│   ├── game-tests.js      # 测试工具（测试菜单、场景测试）
│   ├── modules/
│   │   └── npc.js         # NPC 角色数据与动态生成
│   ├── prompts/           # AI 提示词集中管理
│   │   ├── index.js       # 提示词导出
│   │   ├── system.js      # 系统提示词
│   │   ├── encounter.js   # 邂逅生成提示词
│   │   ├── medal.js       # 成就生成提示词
│   │   └── monologue.js   # 内心独白提示词
│   └── aigenerate/        # AI 生成逻辑
│       ├── ai.js          # AI 调用底层封装（callModel、callAI_JSON）
│       ├── encounter.js   # 邂逅事件生成（NPC 创建、场景描写）
│       ├── invitation.js  # 邀约系统（邀约生成、短信通知）
│       ├── medal.js       # 成就事件生成
│       ├── innermo.js     # 内心独白生成
│       ├── date.js        # 约会相关生成
│       └── Cclip.js       # CClip 提示词相关
├── music/                 # 背景音乐文件
├── pictures/              # 游戏图片资源
└── README.md              # 说明文档
```

## 🎯 核心模块详解

### 1. **config.js** - 游戏配置中心
- **作用**：存储所有可配置项
- **包含**：
  - API 密钥和端点
  - AI 模型选择（GPT-4、GPT-3.5 等）
  - 功能开关（音乐、动画等）
  - 游戏参数（概率、阈值等）

### 2. **entry.js** - 游戏入口与交互核心
- **作用**：处理用户输入和游戏初始化
- **核心函数**：
  - `handleInput()`：处理用户消息发送
  - `submitName()`：提交玩家姓名
  - `startGameWithName()`：使用名字开始游戏
- **流程**：
  1. 接收用户输入
  2. 显示玩家消息
  3. 调用 AI 生成 NPC 回复
  4. 翻译成中文
  5. 显示 NPC 消息
  6. 保存到对话历史
  7. 检查剧情进度

### 3. **game.js** - 游戏状态与剧情管理
- **作用**：管理游戏状态和剧情流程
- **核心功能**：
  - `gameState`：全局游戏状态对象
  - `checkStoryProgress()`：检查剧情进度并触发相应事件
  - 场景管理：海关、导游、邂逅、成就、酒店等
  - 邀约系统：触发邀约短信、处理接受/拒绝
- **剧情阶段**：
  - `customs`：海关场景
  - `guide`：遇到导游
  - `encounter`：机场邂逅
  - `medal`：成就事件
  - `hotelCheckIn`：酒店入住
  - `secondaryLocation`：二级地点探索

### 4. **utils.js** - 通用工具函数
- **作用**：提供通用辅助功能
- **核心函数**：
  - `shouldEndConversation()`：全局对话结束检测
  - `isQuestion()`：判断是否为问句
  - `isStatementEnding()`：判断陈述句结尾
- **检测规则**：
  - 规则 1：达到最大对话轮数（强制结束）
  - 规则 2：检查最小对话轮数
  - 规则 3：检测告别词
  - 规则 4：检测 NPC 是否说完（陈述句结尾）
  - 规则 5：检测 NPC 主动结束对话

### 5. **ui.js** - UI 渲染
- **作用**：处理所有界面渲染
- **功能**：
  - 玩家消息气泡显示
  - NPC 消息气泡显示（英文 + 中文）
  - 加载动画（"NPC 正在思考..."）
  - 系统消息显示
  - 撒花特效
  - 选项按钮生成

### 6. **ui-show.js** - 信息面板展示
- **作用**：展示各类信息面板
- **面板类型**：
  - Locations：已访问地点
  - Encounters：邂逅记录
  - Notebook：笔记
  - Medals：成就勋章
  - Branches：剧情分支

### 7. **modules/npc.js** - NPC 角色管理
- **作用**：管理 NPC 角色数据和生成
- **功能**：
  - NPC 数据结构定义
  - 动态 NPC 生成
  - NPC 属性管理

### 8. **prompts/** - AI 提示词管理
- **作用**：集中管理所有 AI 提示词
- **文件**：
  - `system.js`：系统级提示词
  - `encounter.js`：邂逅生成提示词
  - `medal.js`：成就生成提示词
  - `monologue.js`：内心独白提示词

### 9. **aigenerate/** - AI 生成逻辑
- **作用**：封装各类 AI 生成逻辑
- **模块**：
  - `ai.js`：底层 AI 调用封装
    - `callModel()`：调用 AI 模型生成文本
    - `callAI_JSON()`：调用 AI 生成 JSON 格式数据
  - `encounter.js`：邂逅事件生成
    - `triggerAirportEncounter()`：触发机场邂逅
    - NPC 信息生成和保存
  - `invitation.js`：邀约系统
    - `triggerEncounterInvitationSMS()`：触发邀约短信
    - `generateInvitation()`：基于聊天内容生成邀约
    - `generateDefaultInvitation()`：默认邀约模板
    - `showInvitationSMS()`：显示邀约短信通知
  - `medal.js`：成就事件生成
    - `triggerAirportMedalEvent()`：触发成就事件
  - `innermo.js`：内心独白生成
  - `date.js`：约会相关生成

## 🔄 数据流

### 用户输入流程
```
用户输入
  ↓
entry.js:handleInput()
  ↓
显示玩家消息 (ui.js)
  ↓
保存到 gameState.conversationHistory
  ↓
调用 AI 生成回复 (ai.js:callModel())
  ↓
翻译成中文 (ai.js)
  ↓
显示 NPC 消息 (ui.js)
  ↓
保存到 gameState.conversationHistory
  ↓
检查剧情进度 (game.js:checkStoryProgress())
  ↓
根据剧情阶段触发相应事件
```

### 邂逅邀约流程
```
邂逅对话结束（检测到告别词）
  ↓
game.js: 禁用输入框，显示加载动画
  ↓
等待 1 秒后清除加载动画
  ↓
延迟 2 秒后触发邀约
  ↓
invitation.js:triggerEncounterInvitationSMS()
  ↓
提取 NPC 信息和对话历史
  ↓
调用 AI 生成个性化邀约 (generateInvitation())
  ↓
如果 AI 失败，使用默认模板 (generateDefaultInvitation())
  ↓
保存邀约信息 (saveInvitation())
  ↓
显示邀约短信通知 (showInvitationSMS())
  ↓
用户点击接受/拒绝
  ↓
处理邀约结果 (acceptSMSInvitation/declineSMSInvitation())
```

## 🎮 游戏流程

### 主线剧情
1. **海关场景** (`customs`)
   - 与海关官员对话
   - 检测对话结束（无需告别词）
   - 触发机场随机事件

2. **机场随机事件**
   - 50% 概率触发邂逅 (`encounter`)
   - 50% 概率触发成就 (`medal`)

3. **邂逅事件** (`encounter`)
   - 与随机 NPC 对话
   - 需要告别词才能结束
   - 结束后触发邀约短信

4. **成就事件** (`medal`)
   - 与特殊 NPC 对话
   - 需要告别词才能结束
   - 结束后遇到导游

5. **导游阶段** (`guide`)
   - 与导游 Lani 对话
   - 对话 3 轮后生成行程

6. **酒店入住** (`hotelCheckIn`)
   - 与酒店前台对话
   - 完成入住流程

7. **二级地点探索** (`secondaryLocation`)
   - 探索各个景点
   - 每个地点有独立 NPC

## 🚀 快速开始

### 运行游戏
1. 双击 `index.html`
2. 在浏览器中打开
3. 输入玩家姓名
4. 开始游戏！

### 操作说明
- **输入消息**：在底部输入框输入
- **发送**：点击发送按钮或按 Enter
- **查看状态**：点击顶部功能按钮
- **背景音乐**：点击 🎵 按钮控制

## 🛠️ 开发指南

### 修改配置
编辑 `js/config.js`

### 修改对话逻辑
- NPC 对话：`js/modules/npc.js`
- AI 回复：`js/aigenerate/ai.js`
- 提示词：`js/prompts/`

### 修改界面样式
编辑 `css/style.css`

### 添加新功能
1. 根据功能类型选择模块
2. 或创建新的模块文件
3. 在 `index.html` 中引入新文件
4. 在对应位置调用新函数

### 调试技巧
- 按 F12 打开开发者工具
- 在 Console 中查看日志
- 使用 `gameState` 查看当前状态
- 按 T 键打开测试菜单（开发模式）

## 📊 游戏状态结构

```javascript
gameState = {
    player: { name },              // 玩家信息
    currentPrimaryLocation,        // 当前一级地点
    currentSecondaryLocation,      // 当前二级地点
    currentNpc,                    // 当前 NPC
    conversationHistory: [],       // 对话历史
    locations: [],                 // 已访问地点
    encounters: [],                // 邂逅记录
    notebook: [],                  // 笔记
    medals: [],                    // 成就
    branches: [],                  // 分支剧情
    storyPhase,                    // 当前剧情阶段
    itinerary: [],                 // 行程安排
    encounterProbability,          // 邂逅概率
    medalProbability,              // 成就概率
    dynamicNpcRoles: {}            // 动态 NPC 角色
}
```

## ⚠️ 注意事项

1. **文件结构**：不要随意移动文件位置
2. **加载顺序**：JavaScript 文件按顺序加载，注意依赖关系
3. **修改后刷新**：修改代码后需要刷新浏览器（F5）
4. **API 密钥**：确保在 config.js 中配置了有效的 API 密钥
5. **网络连接**：游戏需要联网调用 AI API

## 🎯 扩展方向

- 添加新的地点和 NPC
- 创建新的剧情分支
- 实现更多的成就系统
- 增加小游戏或互动环节
- 优化 AI 回复质量
- 添加更多的视觉效果和动画

祝你开发愉快！🌺
