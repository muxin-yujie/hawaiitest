// ========== 剧情进度检查模块 ==========
// 负责处理所有剧情阶段的进度检查和推进

/**
 * 检查邀约约会的进度
 */
async function checkInvitationDateProgress() {
    gameState.dateConversationCount++;
    
    if (gameState.dateConversationCount >= 3) {
        const shouldEnd = gameState.dateConversationCount >= 5 || 
                         (gameState.dateConversationCount >= 3 && Math.random() < 0.5);
        
        if (shouldEnd) {
            setTimeout(async () => {
                await completeDate();
            }, 1000);
        }
    }
}

/**
 * 检查导游阶段的进度
 */
async function checkGuideProgress() {
    if (gameState.conversationCount >= 2) {
        setTimeout(async () => {
            await generateLocationsAndItinerary();
        }, 1000);
    }
}

/**
 * 检查酒店入住阶段的进度
 */
async function checkHotelCheckInProgress() {
    if (gameState.conversationCount >= 2 && !gameState.luauInvitationShown) {
        gameState.luauInvitationShown = true;
        setTimeout(async () => {
            if (!gameState.secondaryLocations || gameState.secondaryLocations.length === 0) {
                const itineraryData = ITINERARY_DATA;
                
                gameState.primaryLocationsList = itineraryData.primaryLocations;
                gameState.secondaryLocationsPerPrimary = itineraryData.secondaryLocationsPerPrimary;
                gameState.currentPrimaryLocationData = itineraryData.primaryLocations[0];
                gameState.hotel = itineraryData.hotel;
                gameState.secondaryLocations = itineraryData.secondaryLocationsPerPrimary[0].map((loc, i) => ({
                    ...loc,
                    type: i === 0 ? "hotel" : "random",
                    encounterProb: i === 0 ? 1.0 : (i === 1 ? 1.0 : 0),
                    medalProb: i === 0 ? 0 : (i === 1 ? 0.7 : 1.0)
                }));
                
                if (!gameState.currentPrimaryLocationData || !gameState.currentPrimaryLocationData.name) {
                    logError('Game.checkHotelCheckInProgress', 'currentPrimaryLocationData 设置失败', gameState.currentPrimaryLocationData);
                    gameState.currentPrimaryLocationData = { name: "威基基海滩", emoji: "🏖️", description: "世界著名的海滩，冲浪和日光浴的天堂" };
                }
            }
            
            await showLuauInvitation();
        }, 1000);
    }
}

/**
 * 检查冲浪店阶段的进度
 */
async function checkSurfShopProgress() {
    if (gameState.conversationCount >= 2 && !gameState.medalTriggered) {
        gameState.medalTriggered = true;
        setTimeout(async () => {
            await window.triggerWaikikiMedalEvent("冲浪店");
        }, 500);
    }
}

/**
 * 检查三级地点访问阶段的进度
 */
async function checkTertiaryVisitProgress(userInput, npcResponse) {
    if (gameState.conversationCount >= 2 && !gameState.medalTriggered) {
        gameState.medalTriggered = true;
        setTimeout(async () => {
            await window.triggerWaikikiMedalEvent(gameState.currentTertiaryLocation);
        }, 500);
        return;
    }
    
    if (gameState.currentTertiaryLocation === "彩虹刨冰店" || 
        gameState.currentTertiaryLocation === "阿罗哈烤虾车") {
        return;
    }
    
    // Medal 事件结束后，根据地点类型决定下一步
    const endCheck = window.shouldEndConversation(npcResponse, userInput, {
        currentTurns: gameState.conversationCount,
        minTurns: 2,
        maxTurns: 8,
        requireFarewell: false
    });
    
    if (endCheck.shouldEnd) {
        // 美食地点（刨冰店/烤虾车）：Medal 结束后直接回酒店，不触发 Koa
        if (gameState.currentTertiaryLocation === "彩虹刨冰店" || 
            gameState.currentTertiaryLocation === "阿罗哈烤虾车") {
            
            // 禁用输入框
            const userInputEl = document.getElementById('userInput');
            const sendButton = document.querySelector('.send-btn');
            if (userInputEl) {
                userInputEl.disabled = true;
                userInputEl.placeholder = "";
            }
            if (sendButton) {
                sendButton.disabled = true;
                sendButton.style.opacity = "0.5";
                sendButton.style.cursor = "not-allowed";
            }
            
            // 显示加载动画
            const chatContainer = document.getElementById('chatContainer');
            const loadingMessage = document.createElement('div');
            loadingMessage.className = 'system-message';
            loadingMessage.id = 'transitionLoading';
            loadingMessage.innerHTML = `
                <div style="display: inline-block; width: 24px; height: 24px; border: 3px solid #e0e0e0; border-top-color: #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            `;
            chatContainer.appendChild(loadingMessage);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            setTimeout(async () => {
                gameState.currentNpc = null;
                await returnToHotelRoom();
            }, 500);
            return;
        }
        
        // 其他地点（冲浪店/花环店/音乐教室）：触发 Koa 邂逅
        setTimeout(async () => {
            await handleTertiaryVisitEnd();
        }, 1000);
    }
}

/**
 * 检查海关阶段的进度
 */
async function checkCustomsProgress(userInput, npcResponse) {
    console.log('=== 检查海关场景进度 ===');
    console.log('storyPhase:', gameState.storyPhase);
    console.log('conversationCount:', gameState.conversationCount);
    console.log('customsCompleted:', gameState.customsCompleted);
    
    // 海关场景：使用 shouldEndConversation 检测对话是否结束
    // 该函数会自动忽略星号内的动作描写，只检测对话内容
    const endCheck = window.shouldEndConversation(npcResponse, userInput, {
        currentTurns: gameState.conversationCount,
        minTurns: 0,
        maxTurns: 12,
        requireFarewell: false
    });
    
    console.log('对话结束检测结果:', endCheck);
    
    // 如果检测应该结束且至少有 1 轮对话 → 结束海关场景
    if (endCheck.shouldEnd && gameState.conversationCount >= 1 && !gameState.customsCompleted) {
        gameState.customsCompleted = true;
        
        const chatContainer = document.getElementById('chatContainer');
        
        // 显示内心独白
        const innerThought = document.createElement('div');
        innerThought.className = 'system-message';
        innerThought.innerHTML = `
            <span style="font-weight: bold; color: #6a1b9a; font-size: 0.95em; line-height: 1.6;">
                💭 内心独白 💭<br><br>
                "呼～终于通过海关了！"你松了一口气，脸上露出开心的笑容。<br><br>
                环顾四周，现代化的机场大厅宽敞明亮，透过巨大的落地窗可以看到远处碧蓝的太平洋和翠绿的钻石山。<br><br>
                "这里的机场好漂亮啊！"你拿出手机，"得给机场拍张照留个纪念！"<br><br>
                <em style="color: #888;">（你举起手机，对准机场大厅拍了一张照片）</em>
            </span>
        `;
        chatContainer.appendChild(innerThought);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // 禁用输入框
        const userInputEl = document.getElementById('userInput');
        const sendButton = document.querySelector('.icon-btn[title="发送"]');
        if (userInputEl) {
            userInputEl.disabled = true;
            userInputEl.placeholder = "";
        }
        if (sendButton) {
            sendButton.disabled = true;
            sendButton.style.opacity = "0.5";
            sendButton.style.cursor = "not-allowed";
        }
        
        // 拍照环节：延迟 3 秒，让用户有足够时间看内心独白
        setTimeout(() => {
            // 1. 闪光灯效果
            const flash = document.createElement('div');
            flash.className = 'camera-flash';
            document.body.appendChild(flash);
            
            // 2. 咔嚓声文字
            const shutterText = document.createElement('div');
            shutterText.className = 'camera-shutter-text';
            shutterText.textContent = '📸 咔嚓！';
            document.body.appendChild(shutterText);
            
            setTimeout(() => {
                // 移除特效
                if (flash.parentNode) flash.parentNode.removeChild(flash);
                if (shutterText.parentNode) shutterText.parentNode.removeChild(shutterText);
                
                // 3. 显示照片弹窗
                const overlay = document.createElement('div');
                overlay.className = 'photo-modal-overlay';
                overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 10000;';
                
                const newPhoto = {
                    src: 'pictures/檀香山机场.png',
                    name: 'Honolulu International Airport',
                    nameChinese: '檀香山国际机场',
                    emoji: '✈️',
                    location: '海关',
                    description: '抵达夏威夷的第一张照片'
                };
                
                if (!gameState.photos) {
                    gameState.photos = [];
                }
                
                if (!gameState.photos.some(p => p.src === newPhoto.src)) {
                    gameState.photos.push(newPhoto);
                    console.log('📸 照片已保存:', newPhoto.name);
                }
                
                const modal = document.createElement('div');
                modal.className = 'photo-modal';
                modal.style.cssText = 'background: white; border-radius: 20px; padding: 30px; max-width: 500px; width: 90%; position: relative; border: 4px solid #FF69B4; z-index: 10001;';
                
                // 创建关闭按钮
                const closeBtn = document.createElement('button');
                closeBtn.className = 'photo-close-btn';
                closeBtn.innerHTML = '×';
                closeBtn.style.cssText = 'position: absolute; top: 15px; right: 15px; width: 32px; height: 32px; border: none; background: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%); color: white; border-radius: 50%; font-size: 20px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10002; box-shadow: 0 2px 8px rgba(255, 105, 180, 0.3);';
                closeBtn.onclick = function() {
                    console.log("关闭照片弹窗");
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                    // 恢复输入框
                    const userInputEl = document.getElementById('userInput');
                    const sendButton = document.querySelector('.icon-btn[title="发送"]');
                    if (userInputEl) {
                        userInputEl.disabled = false;
                        userInputEl.placeholder = "输入消息...";
                    }
                    if (sendButton) {
                        sendButton.disabled = false;
                        sendButton.style.opacity = "1";
                        sendButton.style.cursor = "pointer";
                    }
                    // 照片关闭后：触发机场随机事件（邂逅或 Medal）
                    setTimeout(() => {
                        console.log("照片关闭，触发机场随机事件");
                        if (window.triggerAirportRandomEvent) {
                            window.triggerAirportRandomEvent();
                        }
                    }, 100);
                };
                closeBtn.onmouseover = function() {
                    this.style.transform = 'scale(1.1) rotate(90deg)';
                };
                closeBtn.onmouseout = function() {
                    this.style.transform = 'scale(1) rotate(0deg)';
                };
                
                modal.innerHTML = `
                    <div class="photo-modal-header">
                        <h3>📸 Photo!</h3>
                    </div>
                    <div class="photo-modal-image">
                        <img src="pictures/檀香山机场.png" alt="檀香山机场">
                    </div>
                    <div class="photo-modal-caption">
                        <span>🌺</span>
                        <span>Honolulu International Airport</span>
                        <span>🌺</span>
                    </div>
                `;
                
                // 先添加关闭按钮，再添加其他内容
                modal.appendChild(closeBtn);
                
                overlay.appendChild(modal);
                document.body.appendChild(overlay);
            }, 300);
        }, 3000); // 延迟 3 秒，让用户有足够时间看内心独白
    } else {
        console.log("海关官员还在对话中（" + endCheck.reason + "），继续对话...");
    }
}

/**
 * 检查 Duke's Waikiki 约会阶段的进度
 */
async function checkDukesDateProgress(userInput, npcResponse) {
    // 使用 controlDukesDate 函数处理约会对话
    if (window.controlDukesDate) {
        await window.controlDukesDate(userInput, npcResponse);
    }
}

/**
 * 剧情进度检查主函数
 * 根据当前剧情阶段调用对应的处理器函数
 */
async function checkStoryProgress(userInput, npcResponse) {
    // 查找对应的处理器函数
    const handlers = {
        customs: checkCustomsProgress,
        invitation_date: checkInvitationDateProgress,
        guide: checkGuideProgress,
        hotelCheckIn: checkHotelCheckInProgress,
        surfShop: checkSurfShopProgress,
        tertiary_visit: checkTertiaryVisitProgress,
        "Duke's Waikiki": checkDukesDateProgress
    };
    
    const handler = handlers[gameState.storyPhase];
    if (handler) {
        await handler(userInput, npcResponse);
    }
}

// 导出到全局
window.checkStoryProgress = checkStoryProgress;
