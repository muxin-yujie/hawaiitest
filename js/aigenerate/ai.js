// ========== AI 调用模块 ==========
// ✅ 核心 AI 逻辑已集中到 core.js
// 这里保留原始函数包装，确保兼容性

/**
 * 获取当前使用的 API Key
 * @returns {string} API Key
 */
function getCurrentAPIKey() {
    return GameCore.methods.getCurrentAPIKey();
}

/**
 * 获取 NPC 的 AI 回复（支持多轮对话）
 */
async function getAIResponse(prompt, npcName, conversationHistory) {
    return GameCore.api.getAIResponse(prompt, npcName, conversationHistory);
}

/**
 * 翻译到中文
 */
async function translateToChinese(text) {
    return GameCore.api.translateToChinese(text);
}

/**
 * 解析 JSON 响应
 */
function parseJSONResponse(content) {
    return GameCore.api.parseJSONResponse(content);
}

/**
 * 通用的 AI 调用函数（返回文本）
 */
async function callAI(prompt, systemRole = "你是一个有帮助的助手", maxTokens = 800, temperature = 0.8) {
    return GameCore.api.callAI(prompt, systemRole, maxTokens, temperature);
}

/**
 * AI 调用函数（返回 JSON 格式）
 */
async function callAI_JSON(prompt, systemRole = "你是一个专业的助手，请只返回 JSON 格式", maxTokens = 800, temperature = 0.8) {
    return GameCore.api.callAI_JSON(prompt, systemRole, maxTokens, temperature);
}

/**
 * 生成 NPC 对话
 */
async function generateNPCDialogue(npcName, prompt) {
    return GameCore.api.generateNPCDialogue(npcName, prompt);
}

console.log("AI 模块已加载 ✓");

// 暴露到全局作用域
window.getAIResponse = getAIResponse;
window.translateToChinese = translateToChinese;
window.callAI = callAI;
window.callAI_JSON = callAI_JSON;
window.parseJSONResponse = parseJSONResponse;
window.generateNPCDialogue = generateNPCDialogue;
window.getCurrentAPIKey = getCurrentAPIKey;
