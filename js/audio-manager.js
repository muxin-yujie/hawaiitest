// ============================================================================
// 阳光夏威夷 - 专业音频管理系统
// 支持：多通道音频、独立音量控制、淡入淡出、播放列表
// ============================================================================

class AudioManager {
    constructor() {
        // ========== 通道配置 ==========
        this.channels = {
            bgm: {
                audio: null,
                volume: 0.6,        // BGM 默认音量 60%
                isPlaying: false,
                playlist: [],
                currentTrackIndex: 0,
                fadeInterval: null
            },
            ambient: {
                audios: new Map(),  // 支持多个氛围音源
                masterVolume: 0.3,  // 氛围音默认音量 30%
                activeScenes: []
            },
            ui: {
                volume: 0.8,        // UI 音效默认音量 80%
                cache: new Map()    // 预加载缓存
            }
        };
        
        // 总音量控制
        this.masterVolume = 1.0;
        
        // 音频资源库
        this.audioLibrary = {};
        
        console.log('🎵 音频管理器已初始化');
    }

    // ========================================================================
    // 背景音乐的通道 (BGM Channel)
    // ========================================================================

    /**
     * 设置 BGM 播放列表
     * @param {Array} playlist - 播放列表 [{id: 'bgMusic1', name: 'Wave'}]
     */
    setBGMPlaylist(playlist) {
        this.channels.bgm.playlist = playlist;
        console.log(`🎼 BGM 播放列表已设置，共 ${playlist.length} 首曲目`);
    }

    /**
     * 播放 BGM
     * @param {number} index - 播放列表索引
     * @param {boolean} fade - 是否淡入
     */
    playBGM(index = 0, fade = true) {
        const channel = this.channels.bgm;
        const track = channel.playlist[index];
        
        if (!track) {
            console.warn('⚠️ BGM 曲目不存在:', index);
            return;
        }

        // 停止当前播放
        if (channel.audio) {
            this.stopBGM(false); // 不淡出，直接切换
        }

        // 加载新曲目
        channel.audio = document.getElementById(track.id);
        if (!channel.audio) {
            console.error('❌ BGM 音频元素未找到:', track.id);
            return;
        }

        channel.audio.loop = true;
        channel.audio.volume = 0; // 初始音量为 0，用于淡入
        
        const playPromise = channel.audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                channel.isPlaying = true;
                channel.currentTrackIndex = index;
                
                if (fade) {
                    this._fadeIn(channel, 'bgm');
                } else {
                    channel.audio.volume = channel.volume * this.masterVolume;
                }
                
                console.log(`🎵 BGM 开始播放：${track.name}`);
                
                // 监听播放结束，自动播放下一首
                channel.audio.onended = () => {
                    this.playNextBGM();
                };
            }).catch(error => {
                if (error.name !== 'AbortError') {
                    console.error('❌ BGM 播放失败:', error);
                }
            });
        }
    }

    /**
     * 暂停 BGM
     */
    pauseBGM() {
        const channel = this.channels.bgm;
        if (channel.audio && channel.isPlaying) {
            this._fadeOut(channel, 'bgm', () => {
                channel.audio.pause();
                channel.isPlaying = false;
                console.log('⏸️ BGM 已暂停');
            });
        }
    }

    /**
     * 恢复 BGM 播放
     */
    resumeBGM() {
        const channel = this.channels.bgm;
        if (channel.audio && !channel.isPlaying) {
            channel.audio.play().then(() => {
                channel.isPlaying = true;
                this._fadeIn(channel, 'bgm');
                console.log('▶️ BGM 已恢复');
            });
        }
    }

    /**
     * 停止 BGM
     * @param {boolean} fade - 是否淡出
     */
    stopBGM(fade = true) {
        const channel = this.channels.bgm;
        if (channel.audio) {
            if (fade && channel.isPlaying) {
                this._fadeOut(channel, 'bgm', () => {
                    channel.audio.pause();
                    channel.audio.currentTime = 0;
                    channel.isPlaying = false;
                });
            } else {
                channel.audio.pause();
                channel.audio.currentTime = 0;
                channel.isPlaying = false;
            }
        }
    }

    /**
     * 播放下一首 BGM
     */
    playNextBGM() {
        const channel = this.channels.bgm;
        const nextIndex = (channel.currentTrackIndex + 1) % channel.playlist.length;
        setTimeout(() => {
            this.playBGM(nextIndex, true);
        }, 500);
    }

    /**
     * 设置 BGM 音量
     * @param {number} volume - 音量 (0.0 - 1.0)
     */
    setBGMVolume(volume) {
        const channel = this.channels.bgm;
        channel.volume = Math.max(0, Math.min(1, volume));
        if (channel.audio && channel.isPlaying) {
            channel.audio.volume = channel.volume * this.masterVolume;
        }
    }

    // ========================================================================
    // 氛围音通道 (Ambient Channel)
    // ========================================================================

    /**
     * 注册氛围音场景
     * @param {string} sceneName - 场景名称
     * @param {string} audioId - 音频元素 ID
     * @param {number} volume - 默认音量 (0.0 - 1.0)
     */
    registerAmbientScene(sceneName, audioId, volume = 0.3) {
        const audio = document.getElementById(audioId);
        if (!audio) {
            console.warn('⚠️ 氛围音元素未找到:', audioId);
            return false;
        }

        audio.loop = true;
        audio.volume = 0;
        
        this.channels.ambient.audios.set(sceneName, {
            audio: audio,
            defaultVolume: volume,
            currentVolume: 0
        });
        
        console.log(`🌊 氛围音场景已注册：${sceneName}`);
        return true;
    }

    /**
     * 播放氛围音
     * @param {string} sceneName - 场景名称
     * @param {boolean} fade - 是否淡入
     */
    playAmbient(sceneName, fade = true) {
        const scene = this.channels.ambient.audios.get(sceneName);
        if (!scene) {
            console.error('❌ 氛围音场景不存在:', sceneName);
            return;
        }

        // 如果已在播放，跳过
        if (this.channels.ambient.activeScenes.includes(sceneName)) {
            console.log('⏭️ 氛围音已在播放:', sceneName);
            return;
        }

        const playPromise = scene.audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.channels.ambient.activeScenes.push(sceneName);
                
                if (fade) {
                    this._fadeInAmbientScene(scene);
                } else {
                    scene.audio.volume = scene.defaultVolume * this.masterVolume;
                }
                
                console.log(`🎶 氛围音开始播放：${sceneName}`);
            }).catch(error => {
                console.error('❌ 氛围音播放失败:', error);
            });
        }
    }

    /**
     * 停止氛围音
     * @param {string} sceneName - 场景名称
     * @param {boolean} fade - 是否淡出
     */
    stopAmbient(sceneName, fade = true) {
        const scene = this.channels.ambient.audios.get(sceneName);
        if (!scene) return;

        const index = this.channels.ambient.activeScenes.indexOf(sceneName);
        if (index === -1) return;

        if (fade) {
            this._fadeOutAmbientScene(scene, () => {
                scene.audio.pause();
                this.channels.ambient.activeScenes.splice(index, 1);
            });
        } else {
            scene.audio.pause();
            scene.audio.currentTime = 0;
            this.channels.ambient.activeScenes.splice(index, 1);
        }
    }

    /**
     * 切换氛围音场景（淡出当前，淡入新场景）
     * @param {string} newSceneName - 新场景名称
     */
    switchAmbientScene(newSceneName) {
        // 淡出所有当前场景
        this.channels.ambient.activeScenes.forEach(sceneName => {
            this.stopAmbient(sceneName, true);
        });

        // 淡入新场景
        setTimeout(() => {
            this.playAmbient(newSceneName, true);
        }, 1000);
    }

    /**
     * 设置氛围音音量
     * @param {number} volume - 音量 (0.0 - 1.0)
     */
    setAmbientVolume(volume) {
        this.channels.ambient.masterVolume = Math.max(0, Math.min(1, volume));
        
        // 更新所有正在播放的氛围音
        this.channels.ambient.audios.forEach((scene, name) => {
            if (this.channels.ambient.activeScenes.includes(name)) {
                scene.audio.volume = scene.defaultVolume * this.channels.ambient.masterVolume;
            }
        });
    }

    // ========================================================================
    // UI 音效通道 (UI Sound Channel)
    // ========================================================================

    /**
     * 播放 UI 音效
     * @param {string} soundId - 音效 ID
     * @param {number} volume - 音量 (可选，覆盖默认值)
     */
    playUISound(soundId, volume = null) {
        const audio = document.getElementById(soundId);
        if (!audio) {
            console.warn('⚠️ UI 音效未找到:', soundId);
            return;
        }

        // 克隆音频，允许多次同时播放
        const audioClone = audio.cloneNode(true);
        audioClone.volume = (volume !== null ? volume : this.channels.ui.volume) * this.masterVolume;
        
        const playPromise = audioClone.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log(`🔔 UI 音效播放：${soundId}`);
                // 播放完成后自动清理
                audioClone.onended = () => {
                    audioClone.remove();
                };
            }).catch(error => {
                console.error('❌ UI 音效播放失败:', error);
            });
        }
    }

    /**
     * 设置 UI 音效音量
     * @param {number} volume - 音量 (0.0 - 1.0)
     */
    setUIVolume(volume) {
        this.channels.ui.volume = Math.max(0, Math.min(1, volume));
    }

    // ========================================================================
    // 总音量控制
    // ========================================================================

    /**
     * 设置总音量
     * @param {number} volume - 音量 (0.0 - 1.0)
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        console.log(`🔊 总音量设置为：${Math.round(this.masterVolume * 100)}%`);
        
        // 更新所有通道的实际音量
        this._updateAllVolumes();
    }

    /**
     * 静音/取消静音
     * @param {boolean} muted - 是否静音
     */
    setMuted(muted) {
        if (muted) {
            this._previousMasterVolume = this.masterVolume;
            this.masterVolume = 0;
        } else {
            this.masterVolume = this._previousMasterVolume || 1.0;
        }
        this._updateAllVolumes();
    }

    /**
     * 更新所有通道的音量
     */
    _updateAllVolumes() {
        // 更新 BGM
        const bgmChannel = this.channels.bgm;
        if (bgmChannel.audio && bgmChannel.isPlaying) {
            bgmChannel.audio.volume = bgmChannel.volume * this.masterVolume;
        }

        // 更新氛围音
        this.channels.ambient.audios.forEach((scene, name) => {
            if (this.channels.ambient.activeScenes.includes(name)) {
                scene.audio.volume = scene.defaultVolume * this.masterVolume;
            }
        });
    }

    // ========================================================================
    // 淡入淡出效果（内部方法）
    // ========================================================================

    /**
     * BGM 淡入
     */
    _fadeIn(channel, type) {
        if (channel.fadeInterval) {
            clearInterval(channel.fadeInterval);
        }

        const targetVolume = channel.volume * this.masterVolume;
        const duration = 1500; // 1.5 秒淡入
        const startTime = Date.now();
        const startVolume = type === 'bgm' ? channel.audio.volume : 0;

        channel.fadeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this._easeInOutQuad(progress);
            
            const currentVolume = startVolume + (targetVolume - startVolume) * easedProgress;
            
            if (type === 'bgm') {
                channel.audio.volume = currentVolume;
            }
            
            if (progress >= 1) {
                clearInterval(channel.fadeInterval);
                if (type === 'bgm') {
                    channel.audio.volume = targetVolume;
                }
            }
        }, 50);
    }

    /**
     * BGM 淡出
     */
    _fadeOut(channel, type, callback) {
        if (channel.fadeInterval) {
            clearInterval(channel.fadeInterval);
        }

        const duration = 1000; // 1 秒淡出
        const startTime = Date.now();
        const startVolume = type === 'bgm' ? channel.audio.volume : channel.volume * this.masterVolume;

        channel.fadeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this._easeInOutQuad(progress);
            
            const currentVolume = startVolume * (1 - easedProgress);
            
            if (type === 'bgm') {
                channel.audio.volume = currentVolume;
            }
            
            if (progress >= 1) {
                clearInterval(channel.fadeInterval);
                if (callback) callback();
            }
        }, 50);
    }

    /**
     * 氛围音淡入（独立方法，因为氛围音有多音源）
     */
    _fadeInAmbientScene(scene) {
        const targetVolume = scene.defaultVolume * this.masterVolume;
        const duration = 2000; // 2 秒淡入
        const startTime = Date.now();

        const fadeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this._easeInOutQuad(progress);
            
            scene.audio.volume = targetVolume * easedProgress;
            
            if (progress >= 1) {
                clearInterval(fadeInterval);
                scene.audio.volume = targetVolume;
            }
        }, 50);
    }

    /**
     * 氛围音淡出
     */
    _fadeOutAmbientScene(scene, callback) {
        const duration = 1500; // 1.5 秒淡出
        const startTime = Date.now();
        const startVolume = scene.audio.volume;

        const fadeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this._easeInOutQuad(progress);
            
            scene.audio.volume = startVolume * (1 - easedProgress);
            
            if (progress >= 1) {
                clearInterval(fadeInterval);
                if (callback) callback();
            }
        }, 50);
    }

    /**
     * 缓动函数 - 让音量变化更自然
     */
    _easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    // ========================================================================
    // 工具方法
    // ========================================================================

    /**
     * 获取当前播放状态
     */
    getStatus() {
        return {
            bgm: {
                isPlaying: this.channels.bgm.isPlaying,
                currentTrack: this.channels.bgm.playlist[this.channels.bgm.currentTrackIndex]?.name,
                volume: this.channels.bgm.volume
            },
            ambient: {
                activeScenes: [...this.channels.ambient.activeScenes],
                masterVolume: this.channels.ambient.masterVolume
            },
            ui: {
                volume: this.channels.ui.volume
            },
            masterVolume: this.masterVolume
        };
    }

    /**
     * 停止所有音频
     */
    stopAll() {
        this.stopBGM(false);
        this.channels.ambient.activeScenes.forEach(sceneName => {
            this.stopAmbient(sceneName, false);
        });
        console.log('🔇 所有音频已停止');
    }
}

// ============================================================================
// 创建全局音频管理器实例
// ============================================================================

const audioManager = new AudioManager();

// 导出到全局作用域
window.audioManager = audioManager;

console.log('🎵 音频管理器已加载 ✓');
