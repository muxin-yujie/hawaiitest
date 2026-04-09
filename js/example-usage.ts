/**
 * TypeScript 使用示例
 * 
 * 这个文件展示如何使用 TypeScript 类型定义来改进代码质量
 * 目前保持为 .ts 文件，展示类型定义的使用方式
 */

// 导入类型定义
import type { 
  GameState, 
  Npc, 
  Message, 
  StoryPhase,
  Medal,
  Invitation,
  AIResponse 
} from './types';

// ========== 示例 1: 类型安全的游戏状态更新 ==========

/**
 * 更新游戏状态 - TypeScript 版本
 * 编译器会检查你修改的属性是否存在
 */
function updateGameState(update: Partial<GameState>): void {
  // Partial<GameState> 表示所有属性都是可选的
  Object.assign(window.gameState, update);
}

// ✅ 正确使用
updateGameState({
  currentPrimaryLocation: "airport",
  storyPhase: "customs"  // 只能是这几个值之一
});

// ❌ 错误使用（编译时会报错）
// updateGameState({
//   invalidProperty: "xxx",  // 错误：没有这个属性
//   storyPhase: "invalid"    // 错误：只能是 'customs' | 'guide' | 'encounter' ...
// });

// ========== 示例 2: 类型安全的 NPC 数据 ==========

/**
 * 创建 NPC - TypeScript 版本
 * 编译器会检查必需字段是否缺失
 */
function createNpc(npc: Npc): Npc {
  // 确保 NPC 有所有必需字段
  if (!npc.id || !npc.name || !npc.age) {
    throw new Error('NPC 缺少必需字段');
  }
  return npc;
}

// ✅ 正确创建 NPC
const customsOfficer: Npc = {
  id: "customs_officer",
  name: "海关官员",
  age: 45,
  nationality: "American",
  occupation: "Customs Officer",
  emoji: "👨‍",
  personality: "专业、友善、高效"
  // 如果漏掉必需字段，编译时会报错
};

// ========== 示例 3: 类型安全的消息处理 ==========

/**
 * 添加消息到对话历史 - TypeScript 版本
 */
function addMessage(message: Message): void {
  window.gameState.conversationHistory.push(message);
}

// ✅ 正确添加消息
addMessage({
  role: "user",
  content: "Hello",
  timestamp: Date.now()
});

addMessage({
  role: "assistant",
  content: "Aloha!",
  translation: "你好！",
  timestamp: Date.now()
});

// ❌ 错误使用（编译时会报错）
// addMessage({
//   role: "invalid",  // 错误：只能是 'user' | 'assistant' | 'system'
//   content: 123      // 错误：content 应该是 string
// });

// ========== 示例 4: 类型安全的成就系统 ==========

/**
 * 解锁成就 - TypeScript 版本
 */
function unlockMedal(medal: Medal): void {
  medal.unlocked = true;
  medal.unlockedAt = Date.now();
  window.gameState.medals.push(medal);
}

// ✅ 创建并解锁成就
const surfShopMedal: Medal = {
  id: "surf_shop_helper",
  icon: "🏄",
  name: "冲浪店帮手",
  description: "帮助 Maya 整理冲浪装备"
};

unlockMedal(surfShopMedal);

// ========== 示例 5: 类型安全的邀约系统 ==========

/**
 * 发送邀约短信 - TypeScript 版本
 */
function sendInvitationSMS(invitation: Invitation): void {
  // 处理邀约逻辑
  console.log(`发送邀约给 ${invitation.npc.name}: ${invitation.message}`);
}

// ✅ 创建邀约
const invitation: Invitation = {
  id: "inv_001",
  npc: customsOfficer,
  message: "Hey! Want to grab coffee at the airport cafe?",
  translation: "嘿！想在机场咖啡厅喝杯咖啡吗？",
  timestamp: Date.now(),
  status: "pending"
};

sendInvitationSMS(invitation);

// ========== 示例 6: 类型安全的 AI 调用 ==========

/**
 * 调用 AI API - TypeScript 版本
 */
async function callAIAPI(messages: Message[]): Promise<string> {
  const response = await fetch(window.GameCore.config.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${window.GameCore.config.apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: messages,
      max_tokens: 800
    })
  });
  
  const data: AIResponse = await response.json();
  return data.choices[0].message.content;
}

// ✅ 调用 AI
const messages: Message[] = [
  { role: "system", content: "You are a helpful assistant" },
  { role: "user", content: "Hello" }
];

callAIAPI(messages).then(response => {
  console.log("AI 回复:", response);
});

// ========== 示例 7: 类型安全的故事阶段检查 ==========

/**
 * 检查当前故事阶段 - TypeScript 版本
 */
function isStoryPhase(phase: StoryPhase): boolean {
  return window.gameState.storyPhase === phase;
}

// ✅ 使用
if (isStoryPhase("customs")) {
  console.log("当前是海关场景");
}

// ✅ StoryPhase 联合类型的自动补全
const phases: StoryPhase[] = [
  "customs",
  "guide",
  "encounter",
  "medal",
  "hotelCheckIn",
  "secondaryLocation"
];

// ========== 示例 8: 类型安全的 NPC 对话生成 ==========

/**
 * 生成 NPC 对话 - TypeScript 版本
 */
async function generateDialogue(
  npc: Npc, 
  prompt: string, 
  history?: Message[]
): Promise<Message> {
  // 模拟 AI 调用
  const response = await callAIAPI(history || []);
  
  return {
    role: "assistant",
    content: response,
    translation: "中文翻译",
    timestamp: Date.now()
  };
}

// ✅ 使用
generateDialogue(customsOfficer, "作为海关官员，用英语欢迎游客")
  .then(message => {
    addMessage(message);
  });

// ========== 示例 9: 类型安全的地点管理 ==========

import type { Location } from './types';

/**
 * 添加地点 - TypeScript 版本
 */
function addLocation(location: Location): void {
  window.gameState.locations.push(location);
}

// ✅ 添加地点
const airport: Location = {
  id: "airport",
  name: "檀香山国际机场",
  icon: "✈️",
  description: "夏威夷的主要国际机场",
  type: "primary"
};

addLocation(airport);

// ========== 示例 10: 类型安全的事件总线 ==========

import type { GameEvent, GameEventBus } from './types';

/**
 * 简单的事件总线实现 - TypeScript 版本
 */
class EventBus implements GameEventBus {
  private events: Map<string, Array<(payload: any) => void>> = new Map();
  
  on(event: string, callback: (payload: any) => void): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }
  
  off(event: string, callback: (payload: any) => void): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  
  emit(event: string, payload?: any): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(payload));
    }
  }
}

// ✅ 使用
const gameEvents = new EventBus();

gameEvents.on('conversationEnd', (npc: Npc) => {
  console.log(`与 ${npc.name} 的对话结束了`);
});

gameEvents.emit('conversationEnd', customsOfficer);

// ========== 导出工具函数 ==========

export {
  updateGameState,
  addMessage,
  createNpc,
  unlockMedal,
  sendInvitationSMS,
  callAIAPI,
  isStoryPhase,
  generateDialogue,
  addLocation,
  EventBus
};
