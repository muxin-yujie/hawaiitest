// ============================================================================
// 阳光夏威夷 - 音频系统使用示例
// 展示如何使用新的 AudioManager
// ============================================================================

// ============================================================================
// 1. 初始化音频系统（在游戏启动时调用）
// ============================================================================

function initAudioSystem() {
    console.log('🎵 初始化音频系统...');
    
    // 设置 BGM 播放列表
    audioManager.setBGMPlaylist([
        { id: 'bgMusic1', name: 'Wave' },
        { id: 'bgMusic2', name: 'The Girl from Ipanema' },
        { id: 'bgMusic3', name: 'The Red Blouse' }
    ]);
    
    // 注册氛围音场景
    audioManager.registerAmbientScene('ocean', 'ambientOcean', 0.12);
    audioManager.registerAmbientScene('airport', 'ambientAirport', 0.80);
    audioManager.registerAmbientScene('hotel', 'ambientHotel', 0.08);
    audioManager.registerAmbientScene('nature', 'ambientNature', 0.10);
    
    console.log('✅ 音频系统初始化完成');
}

// ============================================================================
// 2. BGM 控制示例
// ============================================================================

// 播放背景音乐（带淡入效果）
function playBackgroundMusic() {
    audioManager.playBGM(0, true); // 播放第 1 首，淡入
}

// 暂停背景音乐
function pauseBackgroundMusic() {
    audioManager.pauseBGM();
}

// 恢复背景音乐
function resumeBackgroundMusic() {
    audioManager.resumeBGM();
}

// 切换到下一首 BGM
function playNextTrack() {
    audioManager.playNextBGM();
}

// 调整 BGM 音量
function adjustBGMVolume(value) {
    audioManager.setBGMVolume(value); // 0.0 - 1.0
}

// ============================================================================
// 3. 氛围音控制示例
// ============================================================================

// 切换到机场场景的氛围音
function switchToAirportAmbient() {
    audioManager.switchAmbientScene('airport');
}

// 切换到海洋场景的氛围音
function switchToOceanAmbient() {
    audioManager.switchAmbientScene('ocean');
}

// 同时播放多个氛围音（例如：海洋 + 自然）
function playMultipleAmbients() {
    audioManager.playAmbient('ocean', true);
    audioManager.playAmbient('nature', true);
}

// 停止特定氛围音
function stopOceanAmbient() {
    audioManager.stopAmbient('ocean', true);
}

// 调整氛围音总音量
function adjustAmbientVolume(value) {
    audioManager.setAmbientVolume(value);
}

// ============================================================================
// 4. UI 音效示例
// ============================================================================

// 播放按钮点击音效
function playButtonClickSound() {
    audioManager.playUISound('uiClick');
}

// 播放消息发送音效
function playMessageSendSound() {
    audioManager.playUISound('uiMessageSend');
}

// 播放获得徽章音效
function playMedalEarnedSound() {
    audioManager.playUISound('uiMedal');
}

// 自定义音量的 UI 音效
function playQuietClickSound() {
    audioManager.playUISound('uiClick', 0.5); // 50% 音量
}

// ============================================================================
// 5. 总音量控制
// ============================================================================

// 设置总音量
function setMasterVolume(value) {
    audioManager.setMasterVolume(value); // 0.0 - 1.0
}

// 静音/取消静音
function toggleMute() {
    const isMuted = audioManager.masterVolume === 0;
    audioManager.setMuted(!isMuted);
    return !isMuted;
}

// ============================================================================
// 6. 与现有代码集成的示例
// ============================================================================

/**
 * 替换现有的 toggleMusic 函数
 */
function toggleMusic() {
    const musicIcon = document.getElementById('musicIcon');
    const musicText = document.getElementById('musicText');
    const musicBtn = document.querySelector('button[onclick="toggleMusic()"]');
    
    const status = audioManager.getStatus();
    
    if (status.bgm.isPlaying) {
        // 暂停音乐
        audioManager.pauseBGM();
        musicIcon.textContent = '🔇';
        musicText.textContent = 'Muted';
        if (musicBtn) {
            musicBtn.classList.remove('playing');
        }
    } else {
        // 播放音乐
        audioManager.playBGM(0, true);
        musicIcon.textContent = '🎵';
        musicText.textContent = 'Playing';
        if (musicBtn) {
            musicBtn.classList.add('playing');
        }
        
        // 同时播放氛围音
        audioManager.playAmbient('ocean', true);
    }
}

/**
 * 场景切换时使用新的音频管理器
 * 例如：从海关切换到机场
 */
function onSceneChange(newSceneType) {
    // 根据场景切换氛围音
    const ambientMap = {
        'customs': 'airport',
        'airport': 'airport',
        'hotel': 'hotel',
        'beach': 'ocean',
        'nature': 'nature'
    };
    
    const ambientType = ambientMap[newSceneType] || 'ocean';
    audioManager.switchAmbientScene(ambientType);
}

// ============================================================================
// 7. 在 HTML 中添加 UI 音效元素示例
// ============================================================================

/*
在 index.html 的 <body> 中添加以下音频元素：

    <!-- UI 音效 -->
    <audio id="uiClick">
        <source src="music/ui-click.mp3" type="audio/mpeg">
    </audio>
    <audio id="uiMessageSend">
        <source src="music/ui-message.mp3" type="audio/mpeg">
    </audio>
    <audio id="uiMedal">
        <source src="music/ui-medal.mp3" type="audio/mpeg">
    </audio>
    <audio id="uiNotification">
        <source src="music/ui-notification.mp3" type="audio/mpeg">
    </audio>
*/

// ============================================================================
// 8. 完整的初始化流程示例
// ============================================================================

/**
 * 游戏启动时的完整音频初始化
 */
function onGameStart() {
    // 1. 初始化音频系统
    initAudioSystem();
    
    // 2. 设置默认音量
    audioManager.setBGMVolume(0.6);
    audioManager.setAmbientVolume(0.3);
    audioManager.setUIVolume(0.8);
    audioManager.setMasterVolume(0.7);
    
    // 3. 预加载 UI 音效（可选）
    // 可以在页面加载时预加载，减少首次播放延迟
    
    console.log('🎵 游戏音频系统就绪');
}

// ============================================================================
// 9. 调试工具
// ============================================================================

/**
 * 查看当前音频状态
 */
function debugAudioStatus() {
    const status = audioManager.getStatus();
    console.table({
        'BGM 播放': status.bgm.isPlaying ? status.bgm.currentTrack : '已暂停',
        'BGM 音量': Math.round(status.bgm.volume * 100) + '%',
        '氛围音场景': status.ambient.activeScenes.join(', ') || '无',
        '氛围音音量': Math.round(status.ambient.masterVolume * 100) + '%',
        'UI 音效音量': Math.round(status.ui.volume * 100) + '%',
        '总音量': Math.round(status.masterVolume * 100) + '%'
    });
    return status;
}

// ============================================================================
// 10. 迁移指南 - 从旧系统到新系统
// ============================================================================

/*
旧代码:
    playAmbientSound('ocean');
    stopAmbientSound();
    setAmbientScene('airport');

新代码:
    audioManager.playAmbient('ocean');
    audioManager.stopAmbient('ocean');
    audioManager.switchAmbientScene('airport');

优势:
    ✓ 统一的 API 接口
    ✓ 支持多氛围音同时播放
    ✓ 自动淡入淡出
    ✓ 独立的音量控制
    ✓ 更好的错误处理
*/

console.log('📖 音频系统使用示例已加载 ✓');
