// ========== 环境背景音系统 ==========
// 淡淡的氛围音效，增强沉浸感但不干扰

let ambientAudio = null;
let currentAmbientType = null;
let isAmbientPlaying = false;
let ambientVolume = 0.12; // 12% 音量，非常轻柔

// 场景音效配置
const ambientScenes = {
    ocean: {
        id: 'ambientOcean',
        volume: 0.12,
        name: '海洋'
    },
    airport: {
        id: 'ambientAirport',
        volume: 0.80,
        name: '机场'
    },
    hotel: {
        id: 'ambientHotel',
        volume: 0.08,
        name: '酒店'
    },
    nature: {
        id: 'ambientNature',
        volume: 0.10,
        name: '自然'
    }
};

/**
 * 初始化环境音效
 * @param {string} sceneType - 场景类型：ocean, airport, hotel, nature
 */
function initAmbientSound(sceneType = 'ocean') {
    const scene = ambientScenes[sceneType] || ambientScenes.ocean;
    ambientAudio = document.getElementById(scene.id);
    
    console.log('🔍 initAmbientSound 被调用，sceneType:', sceneType);
    console.log('🎵 查找 audio 元素 ID:', scene.id);
    
    if (!ambientAudio) {
        console.warn(`❌ 环境音效未找到：${scene.name}`);
        console.log('所有 audio 元素:', document.querySelectorAll('audio'));
        return false;
    }
    
    console.log('✅ 找到 audio 元素:', ambientAudio);
    
    // 设置循环播放
    ambientAudio.loop = true;
    // 设置场景对应的音量
    ambientAudio.volume = scene.volume;
    currentAmbientType = sceneType;
    
    return true;
}

/**
 * 播放环境音效（带淡入效果）
 * @param {string} sceneType - 场景类型：ocean, airport, hotel, nature
 */
function playAmbientSound(sceneType = 'ocean') {
    console.log('🔊 playAmbientSound 被调用，sceneType:', sceneType);
    
    // 如果已经在播放同类型音效，无需重新加载
    if (currentAmbientType !== sceneType || !ambientAudio) {
        console.log('🔄 需要重新初始化，currentAmbientType:', currentAmbientType, 'ambientAudio:', ambientAudio);
        if (!initAmbientSound(sceneType)) {
            console.error('❌ initAmbientSound 失败');
            return;
        }
    }
    
    // 即使已经在播放，也重新初始化音量和淡入效果
    // 这样可以确保每次切换场景都能听到音效
    
    // 直接设置为目标音量，确保能立即听到
    const scene = ambientScenes[sceneType] || ambientScenes.ocean;
    console.log('📊 目标音量:', scene.volume, '场景:', scene.name);
    ambientAudio.volume = scene.volume;
    
    ambientAudio.play().then(() => {
        isAmbientPlaying = true;
        console.log(`✅ 环境音效已播放：${scene.name}，音量：${ambientAudio.volume}`);
    }).catch(error => {
        console.error('❌ 环境音效播放失败:', error);
        console.log('提示：需要用户先与页面交互（点击任意位置）才能播放音频');
    });
}

/**
 * 停止环境音效（带淡出效果）
 */
function stopAmbientSound() {
    if (!ambientAudio || !isAmbientPlaying) return;
    
    // 淡出：2 秒内从当前音量减少到 0
    fadeOutAmbient(2000, () => {
        ambientAudio.pause();
        isAmbientPlaying = false;
        console.log('🔇 环境音效已停止');
    });
}

/**
 * 淡入效果
 * @param {number} duration - 淡入时长（毫秒）
 */
function fadeInAmbient(duration) {
    if (!ambientAudio) return;
    
    const startTime = Date.now();
    const startVolume = 0;
    const targetVolume = ambientVolume;
    
    const fadeInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用缓动函数，让淡入更自然
        const easeProgress = easeInOutQuad(progress);
        ambientAudio.volume = startVolume + (targetVolume - startVolume) * easeProgress;
        
        if (progress >= 1) {
            clearInterval(fadeInterval);
            ambientAudio.volume = targetVolume;
        }
    }, 50);
}

/**
 * 淡出效果
 * @param {number} duration - 淡出时长（毫秒）
 * @param {function} callback - 淡出完成后的回调
 */
function fadeOutAmbient(duration, callback) {
    if (!ambientAudio) {
        if (callback) callback();
        return;
    }
    
    const startTime = Date.now();
    const startVolume = ambientAudio.volume;
    const targetVolume = 0;
    
    const fadeInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用缓动函数
        const easeProgress = easeInOutQuad(progress);
        ambientAudio.volume = startVolume + (targetVolume - startVolume) * easeProgress;
        
        if (progress >= 1) {
            clearInterval(fadeInterval);
            ambientAudio.volume = 0;
            if (callback) callback();
        }
    }, 50);
}

/**
 * 缓动函数 - 让音量变化更自然
 */
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * 根据场景切换环境音（带淡出淡入效果）
 * @param {string} sceneType - 场景类型：ocean, airport, hotel, nature
 */
function setAmbientScene(sceneType) {
    console.log('🎯 setAmbientScene 被调用，sceneType:', sceneType);
    console.log('当前状态 - currentAmbientType:', currentAmbientType, 'isAmbientPlaying:', isAmbientPlaying);
    
    // 如果已经是当前场景，无需切换
    if (currentAmbientType === sceneType && isAmbientPlaying) {
        console.log('⏭️ 已经是当前场景且正在播放，跳过');
        return;
    }
    
    // 淡出当前音效
    if (isAmbientPlaying) {
        console.log('🔉 正在播放，需要淡出后切换');
        fadeOutAmbient(1000, () => {
            // 淡出完成后切换并淡入新音效
            ambientAudio.pause();
            initAmbientSound(sceneType);
            if (isAmbientPlaying) {
                playAmbientSound(sceneType);
            }
        });
    } else {
        console.log('🔊 未播放，直接切换并播放');
        // 直接切换并播放
        initAmbientSound(sceneType);
        playAmbientSound(sceneType);
    }
}

/**
 * 调整环境音音量
 * @param {number} volume - 音量 (0-1)
 */
function setAmbientVolume(volume) {
    ambientVolume = Math.max(0, Math.min(1, volume));
    if (ambientAudio) {
        ambientAudio.volume = ambientVolume;
    }
}

// 导出到全局
window.playAmbientSound = playAmbientSound;
window.stopAmbientSound = stopAmbientSound;
window.setAmbientScene = setAmbientScene;
window.setAmbientVolume = setAmbientVolume;

console.log('🌊 环境音效模块已加载 ✓');
