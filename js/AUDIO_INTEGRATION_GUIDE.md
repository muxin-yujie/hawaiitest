# 🎵 阳光夏威夷 - 音频系统集成指南

本文档详细说明如何将新的音频管理系统集成到现有项目中。

---

## 📋 目录

1. [系统概述](#系统概述)
2. [文件结构](#文件结构)
3. [快速开始](#快速开始)
4. [API 参考](#api-参考)
5. [迁移现有代码](#迁移现有代码)
6. [最佳实践](#最佳实践)
7. [故障排除](#故障排除)

---

## 系统概述

### 核心特性

- **三通道分离**：BGM、氛围音、UI 音效独立控制
- **多音源支持**：氛围音通道可同时播放多个音源
- **淡入淡出**：所有音频切换都带平滑过渡
- **独立音量**：每个通道都有独立的音量控制
- **总音量控制**：统一的总音量管理

### 通道对比

| 特性 | BGM 通道 | 氛围音通道 | UI 音效通道 |
|------|---------|-----------|-----------|
| 用途 | 背景音乐 | 环境音效 | 交互反馈 |
| 播放模式 | 单音源循环 | 多音源混合 | 单次触发 |
| 淡入淡出 | ✅ | ✅ | ❌ |
| 播放列表 | ✅ | ❌ | ❌ |
| 自动下一首 | ✅ | ❌ | ❌ |

---

## 文件结构

```
js/
├── audio-manager.js        # 核心音频管理器（新增）
├── audio-examples.js       # 使用示例（新增）
├── music.js                # 旧版音乐控制（可保留兼容）
└── ambient-sound.js        # 旧版环境音（可保留兼容）
```

---

## 快速开始

### 步骤 1: 在 HTML 中引入新模块

在 `index.html` 的 `<head>` 或 `<body>` 末尾添加：

```html
<!-- 音频管理器（在旧版 music.js 和 ambient-sound.js 之前） -->
<script src="js/audio-manager.js"></script>
```

### 步骤 2: 初始化音频系统

在游戏启动时调用初始化函数：

```javascript
// 在 entry.js 或 game.js 的初始化函数中
function initGame() {
    // ... 其他初始化代码 ...
    
    // 初始化音频系统
    initAudioSystem();
    
    // ... 其他代码 ...
}
```

### 步骤 3: 使用音频管理器

```javascript
// 播放 BGM
audioManager.playBGM(0, true);

// 切换氛围音场景
audioManager.switchAmbientScene('airport');

// 播放 UI 音效
audioManager.playUISound('uiClick');
```

---

## API 参考

### BGM 通道

| 方法 | 参数 | 说明 |
|------|------|------|
| `setBGMPlaylist(playlist)` | `Array` | 设置播放列表 |
| `playBGM(index, fade)` | `number, boolean` | 播放指定曲目 |
| `pauseBGM()` | - | 暂停播放 |
| `resumeBGM()` | - | 恢复播放 |
| `stopBGM(fade)` | `boolean` | 停止播放 |
| `playNextBGM()` | - | 播放下一首 |
| `setBGMVolume(volume)` | `number` | 设置音量 (0-1) |

### 氛围音通道

| 方法 | 参数 | 说明 |
|------|------|------|
| `registerAmbientScene(name, audioId, volume)` | `string, string, number` | 注册场景 |
| `playAmbient(sceneName, fade)` | `string, boolean` | 播放氛围音 |
| `stopAmbient(sceneName, fade)` | `string, boolean` | 停止氛围音 |
| `switchAmbientScene(sceneName)` | `string` | 切换场景 |
| `setAmbientVolume(volume)` | `number` | 设置音量 (0-1) |

### UI 音效通道

| 方法 | 参数 | 说明 |
|------|------|------|
| `playUISound(soundId, volume)` | `string, number` | 播放音效 |
| `setUIVolume(volume)` | `number` | 设置音量 (0-1) |

### 总音量控制

| 方法 | 参数 | 说明 |
|------|------|------|
| `setMasterVolume(volume)` | `number` | 设置总音量 (0-1) |
| `setMuted(muted)` | `boolean` | 静音/取消静音 |
| `getStatus()` | - | 获取当前状态 |
| `stopAll()` | - | 停止所有音频 |

---

## 迁移现有代码

### 方案 A: 完全迁移（推荐）

逐步替换旧版 API 调用为新系统：

```javascript
// 旧代码
playAmbientSound('ocean');
stopAmbientSound();
setAmbientScene('airport');

// 新代码
audioManager.playAmbient('ocean');
audioManager.stopAmbient('ocean');
audioManager.switchAmbientScene('airport');
```

### 方案 B: 兼容模式（过渡期）

保留旧版函数，内部调用新系统：

```javascript
// 在 audio-manager.js 末尾添加兼容层
window.playAmbientSound = (scene) => audioManager.playAmbient(scene);
window.stopAmbientSound = () => audioManager.stopAll();
window.setAmbientScene = (scene) => audioManager.switchAmbientScene(scene);
```

---

## 最佳实践

### 1. 音量平衡建议

```javascript
// 推荐的默认音量配置
audioManager.setBGMVolume(0.6);      // BGM: 60% - 不干扰对话
audioManager.setAmbientVolume(0.3);  // 氛围音：30% - 淡淡的背景
audioManager.setUIVolume(0.8);       // UI 音效：80% - 清晰的反馈
audioManager.setMasterVolume(0.7);   // 总音量：70%
```

### 2. 场景切换流程

```javascript
function onLocationChange(newLocation) {
    // 1. 淡出当前氛围音
    // 2. 切换场景
    // 3. 淡入新氛围音
    audioManager.switchAmbientScene(newLocation);
    
    // 可选：同时切换 BGM
    // audioManager.playBGM(0, true);
}
```

### 3. UI 音效使用时机

```javascript
// 按钮点击
button.onclick = () => {
    audioManager.playUISound('uiClick');
    // ... 其他逻辑 ...
};

// 消息发送
function handleInput() {
    audioManager.playUISound('uiMessageSend');
    // ... 发送消息 ...
}

// 获得成就
function earnMedal(medal) {
    audioManager.playUISound('uiMedal');
    // ... 显示成就 ...
}
```

### 4. 性能优化

```javascript
// 预加载常用 UI 音效（在游戏启动时）
function preloadUISounds() {
    ['uiClick', 'uiMessageSend', 'uiMedal'].forEach(id => {
        const audio = document.getElementById(id);
        if (audio) {
            audio.load();
        }
    });
}
```

---

## 故障排除

### 问题 1: 音频无法播放

**症状**: 调用 `playBGM()` 或 `playAmbient()` 后没有声音

**原因**: 浏览器需要用户交互才能播放音频

**解决方案**:
```javascript
// 在用户第一次点击后初始化音频
document.addEventListener('click', () => {
    if (!audioInitialized) {
        initAudioSystem();
        audioInitialized = true;
    }
}, { once: true });
```

### 问题 2: 音量太小

**检查清单**:
1. 检查 `masterVolume` 是否设置过低
2. 检查通道音量是否独立设置
3. 检查 HTML 中 `<audio>` 元素是否有 `volume` 属性冲突

### 问题 3: 氛围音不切换

**常见错误**:
```javascript
// ❌ 错误：没有注册场景就直接播放
audioManager.playAmbient('airport'); // 未注册

// ✅ 正确：先注册再播放
audioManager.registerAmbientScene('airport', 'ambientAirport', 0.8);
audioManager.playAmbient('airport');
```

### 问题 4: BGM 不自动播放下一首

**检查**:
1. 确认 `setBGMPlaylist()` 已调用
2. 确认播放列表至少有一首曲目
3. 检查音频文件路径是否正确

---

## 扩展示例

### 添加新的氛围音场景

```javascript
// 1. 在 HTML 中添加音频元素
// <audio id="ambientRain" loop>
//     <source src="music/rain-ambient.mp3" type="audio/mpeg">
// </audio>

// 2. 在游戏中注册
audioManager.registerAmbientScene('rain', 'ambientRain', 0.5);

// 3. 使用
audioManager.playAmbient('rain');
```

### 创建音量设置 UI

```html
<div class="volume-controls">
    <label>BGM: <input type="range" min="0" max="100" 
           onchange="audioManager.setBGMVolume(this.value/100)"></label>
    <label>氛围音：<input type="range" min="0" max="100" 
           onchange="audioManager.setAmbientVolume(this.value/100)"></label>
    <label>UI 音效：<input type="range" min="0" max="100" 
           onchange="audioManager.setUIVolume(this.value/100)"></label>
    <label>总音量：<input type="range" min="0" max="100" 
           onchange="audioManager.setMasterVolume(this.value/100)"></label>
</div>
```

---

## 总结

新的音频管理系统提供：

✅ **清晰的通道分离** - BGM、氛围音、UI 音效互不干扰  
✅ **灵活的音量控制** - 每个通道独立控制 + 总音量  
✅ **平滑的过渡效果** - 自动淡入淡出，无突兀感  
✅ **易于扩展** - 轻松添加新场景和音效  
✅ **向后兼容** - 可与旧系统共存，逐步迁移

如有问题，请查看控制台日志或运行 `debugAudioStatus()` 诊断。

祝开发顺利！🌺🎵
