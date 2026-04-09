// ========== 夏威夷游戏 TypeScript 类型定义 ==========

// 1. 游戏状态相关类型
export type StoryPhase = 
  | 'customs'           // 海关场景
  | 'guide'             // 遇到导游
  | 'encounter'         // 机场邂逅
  | 'medal'             // 成就事件
  | 'hotelCheckIn'      // 酒店入住
  | 'secondaryLocation'; // 二级地点探索

export interface Player {
  name: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  translation?: string; // 中文翻译
  timestamp?: number;
}

export interface Location {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: 'primary' | 'secondary' | 'hotel';
}

// 2. NPC 相关类型
export interface Npc {
  id: string;
  name: string;
  chineseName?: string;
  age: number;
  nationality: string;
  occupation: string;
  emoji: string;
  personality: string;
  scene?: string;
  description?: string;
  background?: string;
  rolePrompt?: string;
  firstLine?: string;
  type?: 'fixed' | 'airport' | 'luau' | 'dynamic';
}

export interface FixedNpcs {
  [key: string]: Npc;
}

// 3. 成就相关类型
export interface Medal {
  id: string;
  icon: string;
  name: string;
  description: string;
  unlockCondition?: (gameState: GameState) => boolean;
  unlocked?: boolean;
  unlockedAt?: number;
}

export interface Encounter {
  npc: Npc;
  location: string;
  timestamp: number;
  conversationLength: number;
  invitationAccepted?: boolean;
}

// 4. 游戏状态主接口
export interface GameState {
  player: Player;
  currentPrimaryLocation: string;
  currentSecondaryLocation: string;
  currentNpc: Npc | null;
  conversationHistory: Message[];
  locations: Location[];
  encounters: Encounter[];
  notebook: string[];
  medals: Medal[];
  branches: string[];
  storyPhase: StoryPhase;
  itinerary: any[];
  encounterProbability: number;
  medalProbability: number;
  dynamicNpcRoles: Record<string, any>;
  primaryLocationsList?: Location[];
  secondaryLocationsPerPrimary?: Location[][];
  currentPrimaryLocationData?: Location;
  hotel?: Location;
  secondaryLocations?: Location[];
  currentPrimaryIndex?: number;
  currentSecondaryIndex?: number;
  conversationCount?: number;
}

// 5. AI 调用相关类型
export interface AIRequest {
  model: string;
  messages: Message[];
  max_tokens?: number;
  temperature?: number;
  response_format?: { type: 'json_object' };
}

export interface AIResponse {
  choices: [{
    message: {
      content: string;
    };
    finish_reason?: string;
  }];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIConfig {
  apiUrl: string;
  apiKey: string;
  model: string;
  defaultTemperature: number;
  maxTokens: number;
}

// 6. 配置相关类型
export interface GameConfig {
  API_KEY: string;
  API_URL: string;
  MODEL_NAME: string;
  TRANSLATION_MODEL: string;
  enableMusic: boolean;
  enableAnimations: boolean;
  debugMode: boolean;
  defaultTemperature: number;
  maxTokens: number;
  maxConversationRounds: number;
  minConversationRounds: number;
}

// 7. 邀约系统类型
export interface Invitation {
  id: string;
  npc: Npc;
  message: string;
  translation: string;
  timestamp: number;
  status: 'pending' | 'accepted' | 'declined';
  location?: string;
  time?: string;
}

// 8. 行程数据相关类型
export interface ItineraryItem {
  day: number;
  location: string;
  activities: string[];
  description: string;
}

export interface ItineraryData {
  primaryLocations: Location[];
  secondaryLocationsPerPrimary: Location[][];
  hotel: Location;
}

// 9. Prompt 相关类型
export interface PromptTemplate {
  [key: string]: string;
}

export interface EncounterPrompts {
  AIRPORT_CONVERSATION: string;
  LUAU_CONVERSATION: string;
  [key: string]: string;
}

export interface MedalPrompts {
  GENERATE_SURF_SHOP_MEDAL: string;
  [key: string]: string;
}

export interface MonologuePrompts {
  SURF_SHOP_FAREWELL: string;
  [key: string]: string;
}

export interface Prompts {
  ENCOUNTER: EncounterPrompts;
  MEDAL: MedalPrompts;
  MONOLOGUE: MonologuePrompts;
  GUIDE_FIRST_MEET: string;
  [key: string]: any;
}

// 10. 工具函数类型
export interface DialogueCheckResult {
  shouldEnd: boolean;
  reason?: string;
}

export interface TextAnalysisResult {
  isQuestion: boolean;
  isStatement: boolean;
  hasFarewellWords: boolean;
}

// 11. 音频管理类型
export interface AudioConfig {
  volume: number;
  enabled: boolean;
  currentTrack?: string;
}

export interface SoundEffect {
  name: string;
  src: string;
  volume?: number;
}

// 12. UI 组件类型
export interface MessageBubbleProps {
  message: Message;
  isPlayer: boolean;
  npc?: Npc;
}

export interface LoadingAnimationProps {
  text: string;
  visible: boolean;
}

export interface SceneTransitionProps {
  icon: string;
  title: string;
  description: string;
}

// 13. 事件类型
export interface GameEvent {
  type: string;
  payload?: any;
  timestamp?: number;
}

export interface GameEventBus {
  on(event: string, callback: (payload: any) => void): void;
  off(event: string, callback: (payload: any) => void): void;
  emit(event: string, payload?: any): void;
}

// 14. 全局 Window 扩展
declare global {
  interface Window {
    gameState: GameState;
    FIXED_NPCS: FixedNpcs;
    AIRPORT_NPCS: Npc[];
    LUAU_NPCS: Npc[];
    ITINERARY_DATA: ItineraryData;
    PROMPTS: Prompts;
    GameCore: any;
    getChatContainer: () => HTMLElement;
    '设置状态': (update: Partial<GameState>) => void;
    addPrimaryLocation: (name: string, icon: string, description: string) => void;
    '紫色场景切换': (icon: string, title: string, description: string) => void;
    displayNPCMessage: (name: string, en: string, zh?: string) => void;
    showToast: (message: string, icon?: string) => void;
    showSceneNarration: (title: string, text: string) => void;
    generateInnerMonologue: (thought: string, emotion: string) => Promise<void>;
    saveFixedNpcToEncounters: (npc: Npc) => void;
    getNpcEmoji: (npcName: string) => string;
    getFixedNpc: (name: string) => Npc;
    generateItinerary: () => Promise<void>;
    triggerAirportEncounter: () => Promise<void>;
    triggerAirportMedalEvent: () => Promise<void>;
    generateNPCDialogue: (npcName: string, prompt: string) => Promise<void>;
    getAIResponse: (prompt: string, npcName?: string, history?: Message[]) => Promise<string>;
    callModel: (prompt: string, systemPrompt?: string) => Promise<string>;
    callAI_JSON: <T>(prompt: string, systemPrompt?: string) => Promise<T>;
  }
}

// 类型已经通过 export interface 导出，这里不需要重复导出
