# 错误处理模块使用指南

## 📋 概述

统一的错误处理模块提供：
- ✅ 一致的日志格式
- ✅ 用户友好的错误提示
- ✅ 错误统计和追踪
- ✅ 全局错误捕获

## 🚀 快速开始

### 1. 模块已自动加载
错误处理模块已在 `index.html` 中引入，并在 `entry.js` 中自动初始化。

### 2. 可用的全局函数

```javascript
// 记录错误
logError('模块名', '错误消息', 详细数据);

// 记录警告
logWarning('模块名', '警告消息', 详细数据);

// 记录信息
logInfo('模块名', '信息消息', 详细数据);

// 记录调试
logDebug('模块名', '调试消息', 详细数据);

// 显示用户提示
ErrorHandler.showToast('操作失败', 'error');

// 处理 API 错误
ErrorHandler.handleAPIError(error, 'API 调用');
```

## 📖 使用示例

### 示例 1: 捕获并记录错误

```javascript
// ❌ 旧方式
try {
    await someFunction();
} catch (error) {
    console.error("出错了:", error);
}

// ✅ 新方式
try {
    await someFunction();
} catch (error) {
    logError('MyModule', '函数执行失败', error.message);
    ErrorHandler.handleAPIError(error, '我的功能');
    throw error; // 或返回默认值
}
```

### 示例 2: 数据验证

```javascript
// ❌ 旧方式
if (!data) {
    console.error("数据为空");
    return;
}

// ✅ 新方式
if (!data) {
    logWarning('MyModule', '数据为空', { fieldName: 'userData' });
    ErrorHandler.handleNullData('MyModule', 'userData');
    return;
}
```

### 示例 3: 索引检查

```javascript
// ❌ 旧方式
if (index >= array.length) {
    console.error("索引越界");
    return;
}

// ✅ 新方式
if (index >= array.length) {
    ErrorHandler.handleIndexOutOfBounds('MyModule', index, array.length);
    return;
}
```

### 示例 4: 用户提示

```javascript
// 成功提示
ErrorHandler.showToast('保存成功！', 'success');

// 错误提示
ErrorHandler.showToast('网络连接失败', 'error');

// 警告提示
ErrorHandler.showToast('数据未保存', 'warning');

// 信息提示
ErrorHandler.showToast('正在加载...', 'info');
```

## 🎯 最佳实践

### 1. 日志级别选择

| 级别 | 使用场景 |
|------|----------|
| `logError` | 功能失败、API 错误、数据丢失 |
| `logWarning` | 数据为空、降级处理、非关键问题 |
| `logInfo` | 重要操作、状态变更、用户行为 |
| `logDebug` | 调试信息、开发阶段使用 |

### 2. 错误消息格式

```javascript
// ✅ 好的错误消息
logError('Game.checkIn', '酒店入住失败', { 
    hotelId: 123, 
    reason: 'API timeout' 
});

// ❌ 不好的错误消息
logError('错误', '出错了', error);
```

### 3. 模块命名

使用清晰的模块名，格式：`功能。子功能`

```javascript
// ✅ 好的模块名
'Game.checkIn'
'Game.Location.Enter'
'API.NPC.Dialogue'

// ❌ 不好的模块名
'game'
'test'
'123'
```

### 4. 用户提示

```javascript
// ✅ 适度使用用户提示
// 只在以下情况显示：
// - 影响用户体验的错误
// - 需要用户重新操作的错误
// - 关键功能失败

// 网络错误
ErrorHandler.showToast('网络连接失败，请检查网络', 'error');

// 数据加载失败
ErrorHandler.showToast('数据加载失败，请刷新页面', 'error');

// ❌ 避免过度提示
// 不要每个错误都弹窗，避免打扰用户
```

## 🔧 高级功能

### 1. 包装异步函数

```javascript
// 自动错误处理
const safeFunction = ErrorHandler.wrapAsync(
    async (param) => {
        // 可能出错的代码
        return await riskyOperation(param);
    },
    'MyModule.riskyOperation'
);

// 使用
await safeFunction('test');
```

### 2. 安全执行

```javascript
// 执行函数但不抛出错误
const result = ErrorHandler.safeExecute(
    () => JSON.parse(maybeInvalidJSON),
    null, // 默认值
    'MyModule.parseJSON'
);
```

### 3. 错误统计

```javascript
// 获取错误统计
const stats = ErrorHandler.getStats();
console.log('总错误数:', stats.total);
console.log('各模块错误:', stats.byType);

// 重置统计
ErrorHandler.resetStats();
```

## 📊 日志输出格式

所有日志都会包含：
- 时间戳
- 日志级别
- 模块名
- 错误消息
- 详细数据（可选）

示例输出：
```
[14:30:25] [ERROR] [Game.checkIn] 酒店入住失败：API timeout { hotelId: 123 }
```

## ⚙️ 配置选项

```javascript
// 设置日志级别（生产环境建议设为 ERROR）
ErrorHandler.currentLogLevel = ErrorHandler.LogLevel.ERROR;

// 关闭用户提示
ErrorHandler.showUserToast = false;

// 可用的日志级别
ErrorHandler.LogLevel.DEBUG    // 全部记录
ErrorHandler.LogLevel.INFO     // INFO 及以上
ErrorHandler.LogLevel.WARNING  // WARNING 及以上
ErrorHandler.LogLevel.ERROR    // ERROR 及以上
ErrorHandler.LogLevel.CRITICAL // 仅 CRITICAL
```

## 🐛 常见问题

### Q: 为什么我的错误没有显示 Toast？
A: 检查 `ErrorHandler.showUserToast` 是否为 `true`（默认开启）

### Q: 生产环境如何关闭调试日志？
A: 设置 `ErrorHandler.currentLogLevel = ErrorHandler.LogLevel.ERROR`

### Q: 如何自定义 Toast 样式？
A: 在 `css/style.css` 中修改 `.error-toast` 相关样式

## 📝 迁移指南

### 从 console.error 迁移

```javascript
// 之前
console.error("加载失败:", error);

// 现在
logError('MyModule', '加载失败', error.message);
ErrorHandler.handleAPIError(error, '数据加载');
```

### 从 alert 迁移

```javascript
// 之前
alert("操作失败！");

// 现在
ErrorHandler.showToast('操作失败', 'error');
```

## 🎯 总结

使用统一错误处理的好处：
1. ✅ 一致的日志格式，易于调试
2. ✅ 友好的用户提示，提升体验
3. ✅ 错误统计，便于监控
4. ✅ 全局捕获，防止崩溃
5. ✅ 生产/开发环境灵活配置

---

**最后更新**: 2026-04-07  
**维护者**: Development Team
