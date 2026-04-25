// ========================================
// 📖 章节系统（简化版）
// ========================================
// 统一管理所有章节切换、对话历史等功能

// 章节数据
const gameChapters = [
    {
        id: 0,
        day: "引子",
        title: "抵达夏威夷",
        icon: "✈️",
        unlocked: true,
        completed: false,
        tasks: 2,
        completedTasks: 0,
        description: "在檀香山国际机场接受海关检查，开启你的夏威夷之旅。"
    },
    {
        id: 1,
        day: "DAY 1",
        title: "威基基海滩",
        icon: "🏖️",
        unlocked: false,
        completed: false,
        tasks: 3,
        completedTasks: 0,
        description: "前往威基基海滩，享受阳光沙滩，开始第一天的冒险。"
    }
];

// 当前章节索引
let currentChapter = 0;

// 章节管理器
const ChapterManager = {
    // 初始化
    init() {
        console.log("✅ 章节系统已初始化");
    },
    
    // 打开章节目录面板
    openPanel() {
        console.log("=== 打开章节目录面板 ===");
        this.renderPanel();
        document.getElementById('chapterPanel').classList.add('open');
        document.getElementById('chapterPanelOverlay').classList.add('open');
    },
    
    // 关闭章节目录面板
    closePanel() {
        document.getElementById('chapterPanel').classList.remove('open');
        document.getElementById('chapterPanelOverlay').classList.remove('open');
    },
    
    // 渲染章节面板
    renderPanel() {
        const panelBody = document.getElementById('chapterPanelBody');
        if (!panelBody) return;
        
        panelBody.innerHTML = '';
        
        gameChapters.forEach((chapter, index) => {
            const card = document.createElement('div');
            card.className = `chapter-card ${index === currentChapter ? 'active' : ''} ${!chapter.unlocked ? 'locked' : ''}`;
            card.onclick = () => this.switchTo(index);
            
            const statusText = index === currentChapter ? '📍 进行中' : (chapter.completed ? '✅ 已完成' : (chapter.unlocked ? '🔓 未开始' : '🔒 未解锁'));
            
            card.innerHTML = `
                <div class="chapter-card-header">
                    <div class="chapter-card-icon">${chapter.icon}</div>
                    <div class="chapter-card-title">${chapter.day} · ${chapter.title}</div>
                    <div class="chapter-card-status">${statusText}</div>
                </div>
                <div class="chapter-card-desc">${chapter.description}</div>
            `;
            
            panelBody.appendChild(card);
        });
    },
    
    // 切换到指定章节
    switchTo(chapterIndex, onTransitionComplete = null) {
        console.log(`=== 切换到章节 ${chapterIndex} ===`);
        
        const chapter = gameChapters[chapterIndex];
        if (!chapter || !chapter.unlocked) {
            console.log("⚠️ 章节未解锁");
            alert('该章节尚未解锁，请先完成当前章节！');
            if (onTransitionComplete) onTransitionComplete();
            return;
        }
        
        if (chapterIndex === currentChapter) {
            console.log("⚠️ 已经在当前章节");
            this.closePanel();
            if (onTransitionComplete) onTransitionComplete();
            return;
        }
        
        // 标记当前章节为已完成（如果还没完成）
        const currentChapterData = gameChapters[currentChapter];
        if (currentChapterData && !currentChapterData.completed) {
            currentChapterData.completed = true;
            console.log(`✅ 章节 ${currentChapter} 已标记为完成`);
        }
        
        // 隐藏所有窗口
        document.querySelectorAll('.chat-window').forEach(win => win.classList.remove('active'));
        
        // 切换章节
        currentChapter = chapterIndex;
        
        // 显示对应窗口
        const windowMap = ['Intro', 'Day1'];
        const windowId = `chatContainer${windowMap[chapterIndex] || 'Intro'}`;
        const targetWindow = document.getElementById(windowId);
        
        if (targetWindow) {
            targetWindow.classList.add('active');
            console.log(`✅ 已切换到窗口：${windowId}`);
            
            // 如果目标窗口是空的，显示章节标题动画
            if (!targetWindow.innerHTML.trim()) {
                this.showTransitionAnimation(chapter, targetWindow);
            }
        } else {
            console.error(`⚠️ 窗口未找到：${windowId}`);
        }
        
        // 关闭面板
        this.closePanel();
        
        // 执行回调
        if (onTransitionComplete) {
            onTransitionComplete();
        }
    },
    
    // 显示章节切换动画
    showTransitionAnimation(chapter, targetContainer = null) {
        const chatContainer = targetContainer || document.querySelector('.chat-window.active');
        if (!chatContainer) {
            console.error('聊天窗口未找到！');
            return;
        }
        
        // 只在窗口为空时显示章节标题动画
        chatContainer.innerHTML = `
            <div class="system-message" style="text-align: center; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 15px; margin: 10px 0;">
                <div style="font-size: 64px; margin-bottom: 20px;">${chapter.icon}</div>
                <div style="font-size: 28px; font-weight: bold; margin-bottom: 10px;">${chapter.day}</div>
                <div style="font-size: 20px; opacity: 0.9;">${chapter.title}</div>
                <div style="margin-top: 20px; opacity: 0.8; font-size: 14px;">${chapter.description}</div>
            </div>
        `;
        
        // 动画完成后执行回调
        setTimeout(() => {
            console.log(`✅ 章节切换动画完成`);
            if (onComplete) {
                onComplete();
            }
        }, 2000);
    },
    
    // 更新章节进度
    updateProgress(completed = false) {
        const chapter = gameChapters[currentChapter];
        if (chapter && completed) {
            chapter.completedTasks = Math.min(chapter.completedTasks + 1, chapter.tasks);
            
            // 检查是否完成当前章节
            if (chapter.completedTasks >= chapter.tasks && !chapter.completed) {
                chapter.completed = true;
                // 解锁下一章
                if (currentChapter + 1 < gameChapters.length) {
                    gameChapters[currentChapter + 1].unlocked = true;
                    return true; // 返回 true 表示刚完成章节
                }
            }
        }
        return false;
    },
    
    // 获取当前章节
    getCurrentChapter() {
        return currentChapter;
    },
    
    // 获取章节数据
    getChapter(index) {
        return gameChapters[index];
    }
};

// 暴露到全局
window.ChapterManager = ChapterManager;
window.gameChapters = gameChapters;

// 使用 getter 让 window.currentChapter 始终同步最新的值
Object.defineProperty(window, 'currentChapter', {
    get: () => currentChapter,
    set: (value) => { currentChapter = value; },
    enumerable: true,
    configurable: true
});

window.openChapterPanel = () => ChapterManager.openPanel();
window.closeChapterPanel = () => ChapterManager.closePanel();
window.switchToChapter = (index, callback) => ChapterManager.switchTo(index, callback);
window.updateChapterProgress = (completed) => ChapterManager.updateProgress(completed);

// 初始化章节系统
ChapterManager.init();

// 添加侧滑手势支持（从左边缘右滑打开章节面板）
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50; // 滑动距离阈值
    const edgeThreshold = 30;  // 从边缘开始的距离
    
    // 检查是否从左侧边缘开始滑动
    if (touchStartX < edgeThreshold) {
        // 右滑 - 打开章节面板
        if (touchEndX - touchStartX > swipeThreshold) {
            console.log("👉 检测到右滑手势，打开章节面板");
            openChapterPanel();
        }
    }
    
    // 检查是否在面板打开状态下从面板区域左滑
    const chapterPanel = document.getElementById('chapterPanel');
    if (chapterPanel && chapterPanel.classList.contains('open')) {
        // 左滑 - 关闭章节面板
        if (touchStartX - touchEndX > swipeThreshold) {
            console.log("👈 检测到左滑手势，关闭章节面板");
            closeChapterPanel();
        }
    }
}

console.log("✅ 章节系统已加载 ✓");
