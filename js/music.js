// 背景音乐控制 - 播放列表
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
    const musicBtn = document.querySelector('button[onclick="toggleMusic()"]');
    
    // 检查元素是否存在
    if (!musicIcon || !musicText) {
        console.warn('音乐按钮元素未找到');
        return;
    }
    
    if (isMusicPlaying) {
        // 暂停当前播放的音乐
        if (currentAudio) {
            currentAudio.pause();
        }
        musicIcon.textContent = '🔇';
        musicText.textContent = 'Muted';
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

function playTrack(index, musicIcon, musicText, musicBtn) {
    // 检查元素是否存在
    if (!musicIcon || !musicText) {
        console.warn('音乐图标或文本元素未找到');
        return;
    }
    
    // 停止之前的音频（不重置时间，避免中断错误）
    if (currentAudio) {
        currentAudio.pause();
    }
    
    currentTrackIndex = index;
    currentAudio = document.getElementById(playlist[currentTrackIndex].id);
    
    // 检查音频元素是否存在
    if (!currentAudio) {
        console.error('音频元素未找到:', playlist[currentTrackIndex].id);
        musicIcon.textContent = '⚠️';
        musicText.textContent = 'Error';
        return;
    }
    
    currentAudio.volume = 0.3;
    
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
    
    const playPromise = currentAudio.play();
    
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            musicIcon.textContent = '🎵';
            musicText.textContent = 'Playing';
            if (musicBtn) {
                musicBtn.classList.add('playing');
            }
            isMusicPlaying = true;
            isMusicInitialized = true;
            
            // 监听播放结束，自动播放下一首
            currentAudio.onended = () => {
                const nextIndex = (currentTrackIndex + 1) % playlist.length;
                setTimeout(() => {
                    playTrack(nextIndex, musicIcon, musicText, musicBtn);
                }, 100);
            };
        }).catch(error => {
            // 忽略 AbortError 错误（这是正常的切换行为）
            if (error.name !== 'AbortError') {
                console.log('音乐播放失败:', error);
                if (!isMusicInitialized) {
                    musicIcon.textContent = '🎵';
                    musicText.textContent = 'Click to Play';
                    // 不再使用 alert，游戏开始时已有 Toast 提示
                }
            }
        });
    }
}

console.log("音乐模块已加载 ✓");
