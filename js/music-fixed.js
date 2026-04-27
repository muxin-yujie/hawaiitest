// 背景音乐控制 - 优化版本
let isMusicPlaying = false;
let isMusicInitialized = false;
let currentTrackIndex = 0;
let currentAudio = null;

const playlist = [
    { id: 'bgMusic1', name: 'Wave' },
    { id: 'bgMusic2', name: 'The Girl from Ipanema' },
    { id: 'bgMusic3', name: 'The Red Blouse' }
];

function toggleMusic() {
    const musicIcon = document.getElementById('musicIcon');
    const musicText = document.getElementById('musicText');
    const musicBtn = document.querySelector('button[onclick="toggleMusic()"]') || document.getElementById('musicToggle');
    
    // 检查元素是否存在（移动端可能没有 musicText）
    if (!musicIcon) {
        console.warn('音乐图标元素未找到');
        return;
    }
    
    if (isMusicPlaying) {
        // 暂停当前播放的音乐
        if (currentAudio) {
            // 淡出效果
            fadeOutMusic(currentAudio, 500, () => {
                currentAudio.pause();
            });
        }
        
        // 移动端使用 SVG 图标，桌面端使用 emoji
        if (musicIcon.tagName === 'svg') {
            // SVG 图标：改变透明度表示静音
            musicIcon.style.opacity = '0.5';
        } else {
            musicIcon.textContent = '🔇';
        }
        
        if (musicText) musicText.textContent = 'Muted';
        if (musicBtn) {
            musicBtn.classList.remove('playing');
        }
        isMusicPlaying = false;
        
        // 同时停止环境音效
        if (typeof stopAmbientSound === 'function') {
            stopAmbientSound();
        }
    } else {
        // 开始播放
        playTrack(0, musicIcon, musicText, musicBtn);
    }
}

// 音乐淡出效果
function fadeOutMusic(audio, duration, callback) {
    const startTime = Date.now();
    const startVolume = audio.volume;
    
    const fadeInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        audio.volume = startVolume * (1 - progress);
        
        if (progress >= 1) {
            clearInterval(fadeInterval);
            audio.volume = 0;
            if (callback) callback();
        }
    }, 50);
}

// 音乐淡入效果
function fadeInMusic(audio, duration, targetVolume, callback) {
    const startTime = Date.now();
    audio.volume = 0;
    
    const fadeInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        audio.volume = targetVolume * progress;
        
        if (progress >= 1) {
            clearInterval(fadeInterval);
            audio.volume = targetVolume;
            if (callback) callback();
        }
    }, 50);
}

function playTrack(index, musicIcon, musicText, musicBtn) {
    // 检查元素是否存在（移动端可能没有 musicText）
    if (!musicIcon) {
        console.warn('音乐图标元素未找到');
        return;
    }
    
    // 停止之前的音频
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    currentTrackIndex = index;
    currentAudio = document.getElementById(playlist[currentTrackIndex].id);
    
    // 检查音频元素是否存在
    if (!currentAudio) {
        console.error('音频元素未找到:', playlist[currentTrackIndex].id);
        
        // 自动尝试下一首
        const nextIndex = (currentTrackIndex + 1) % playlist.length;
        if (nextIndex !== 0) {
            setTimeout(() => {
                playTrack(nextIndex, musicIcon, musicText, musicBtn);
            }, 100);
            return;
        }
        
        musicIcon.textContent = '⚠️';
        if (musicText) musicText.textContent = 'Error';
        return;
    }
    
    // 降低音量到 20%，避免太大声
    const targetVolume = 0.2;
    
    // 设置循环播放
    currentAudio.loop = true;
    
    // 预加载音频
    currentAudio.preload = 'auto';
    currentAudio.load();
    
    // 同时播放环境音效（淡淡的背景音）
    if (typeof playAmbientSound === 'function') {
        playAmbientSound();
    }
    
    // 重置所有音频的时间到开头
    playlist.forEach((track, i) => {
        if (i !== index) {
            const audio = document.getElementById(track.id);
            if (audio) {
                audio.currentTime = 0;
            }
        }
    });
    
    // 淡入播放
    const playPromise = currentAudio.play();
    
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // 淡入效果：1 秒内从 0 到目标音量
            fadeInMusic(currentAudio, 1000, targetVolume, () => {
                // 移动端使用 SVG 图标，桌面端使用 emoji
                if (musicIcon.tagName === 'svg') {
                    // SVG 图标：恢复正常透明度
                    musicIcon.style.opacity = '1';
                } else {
                    musicIcon.textContent = '🎵';
                }
                
                if (musicText) musicText.textContent = 'Playing';
                if (musicBtn) {
                    musicBtn.classList.add('playing');
                }
                isMusicPlaying = true;
                isMusicInitialized = true;
            });
            
            // 监听播放结束，自动播放下一首
            currentAudio.onended = () => {
                const nextIndex = (currentTrackIndex + 1) % playlist.length;
                setTimeout(() => {
                    playTrack(nextIndex, musicIcon, musicText, musicBtn);
                }, 500);
            };
            
            // 监听错误
            currentAudio.onerror = (e) => {
                console.error('音频播放错误:', e);
                // 尝试下一首
                const nextIndex = (currentTrackIndex + 1) % playlist.length;
                if (nextIndex !== currentTrackIndex) {
                    setTimeout(() => {
                        playTrack(nextIndex, musicIcon, musicText, musicBtn);
                    }, 200);
                }
            };
        }).catch(error => {
            // 忽略 AbortError 错误（这是正常的切换行为）
            if (error.name !== 'AbortError') {
                console.log('音乐播放失败:', error);
                if (!isMusicInitialized) {
                    musicIcon.textContent = '🎵';
                    musicText.textContent = 'Click to Play';
                }
            }
        });
    }
}

console.log("音乐模块已加载 ✓");
