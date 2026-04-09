  /**
         * 开始约会（赴约）
         */
        window.startInvitationDate = function(index) {
            console.log("开始约会，索引:", index);
            
            const encounter = gameState.encounters[index];
            if (!encounter || !encounter.invitationData) {
                alert("无效的邀约");
                return;
            }
            
            // 保存主线进度
            gameState.mainStoryCheckpoint = {
                storyPhase: gameState.storyPhase,
                currentPrimaryLocation: gameState.currentPrimaryLocation,
                conversationHistory: JSON.parse(JSON.stringify(gameState.conversationHistory)),
                currentNpc: gameState.currentNpc,
                conversationCount: gameState.conversationCount
            };
            
            // 进入约会支线
            gameState.storyPhase = "invitation_date";
            gameState.currentDateEncounterIndex = index;
            gameState.dateConversationCount = 0;
            
            // 清空当前对话，准备约会剧情
            const chatContainer = document.getElementById('chatContainer');
            chatContainer.innerHTML = '';
            
            // 生成约会开场
            generateDateOpening(encounter);
        };
        
        /**
         * 生成约会开场剧情
         */
        async function generateDateOpening(encounter) {
            const invitation = encounter.invitationData;
            
            // 显示约会场景
            const sceneMessage = document.createElement('div');
            sceneMessage.className = 'system-message';
            sceneMessage.style.background = 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
            sceneMessage.innerHTML = `
                <span style="font-weight: bold; color: #5d4037; font-size: 1em; line-height: 1.6;">
                    💕 约会开始 💕<br><br>
                    📍 ${invitation.scene} · ${invitation.time}<br>
                    🎯 ${invitation.activity}<br><br>
                    你按照约定来到了${invitation.scene}，心中既期待又紧张...
                </span>
            `;
            document.getElementById('chatContainer').appendChild(sceneMessage);
            
            // 生成 NPC 的见面问候
            const greetingPrompt = `
生成约会见面场景：
- NPC: ${encounter.chineseName} (${encounter.name})
- 职业：${encounter.occupation}
- 性格：${encounter.personality}
- 地点：${invitation.scene}
- 活动：${invitation.activity}
- 时间：${invitation.time}

NPC 刚刚看到你来了，会说什么做什么？

要求：
1. 符合 NPC 的性格和职业
2. 自然真实，不要过于夸张
3. 包含动作描述（英文，斜体）
4. 英文台词 1-2 句

返回 JSON:
{
    "scene": "场景描述（中文，50-100 字）",
    "npcLine": "NPC 台词（英文，带动作）"
}
`;
            
            try {
                const greetingData = await callAI_JSON(
                    greetingPrompt,
                    "你是一个游戏剧情设计师，善于创作自然的约会场景。请只返回 JSON 格式。",
                    300,
                    0.8
                );
                
                // 显示场景描述
                const descMessage = document.createElement('div');
                descMessage.className = 'system-message';
                descMessage.innerHTML = `<span style="font-size: 0.95em; line-height: 1.6;">${greetingData.scene}</span>`;
                document.getElementById('chatContainer').appendChild(descMessage);
                
                // 显示 NPC 台词
                const npcMessage = document.createElement('div');
                npcMessage.className = 'message npc-message';
                npcMessage.innerHTML = `
                    <div class="message-sender">${encounter.emoji || '👤'} ${encounter.chineseName}</div>
                    <div>${greetingData.npcLine}</div>
                `;
                document.getElementById('chatContainer').appendChild(npcMessage);
                
                // 滚动到底部
                const container = document.getElementById('chatContainer');
                container.scrollTop = container.scrollHeight;
                
            } catch (error) {
                console.error("生成约会开场失败:", error);
            }
        }
        
        /**
         * 完成约会，返回主线
         */
        async function completeDate() {
            const encounter = gameState.encounters[gameState.currentDateEncounterIndex];
            if (!encounter) return;
            
            // 更新邀约状态
            encounter.invitationStatus = 'completed';
            
            // 显示约会结束消息
            const chatContainer = document.getElementById('chatContainer');
            const completeMessage = document.createElement('div');
            completeMessage.className = 'system-message';
            completeMessage.style.background = 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
            completeMessage.innerHTML = `
                <span style="font-weight: bold; color: #e65100;">
                    ⭐ 约会结束<br><br>
                    这是一次美好的经历，你们度过了愉快的时光...<br><br>
                    💕 ${encounter.chineseName} 给你留下了深刻的印象
                </span>
            `;
            chatContainer.appendChild(completeMessage);
            
            // 触发撒花
            showConfetti();
            
            // 延迟后返回主线
            setTimeout(async () => {
                // 恢复主线进度
                if (gameState.mainStoryCheckpoint) {
                    gameState.storyPhase = gameState.mainStoryCheckpoint.storyPhase;
                    gameState.currentPrimaryLocation = gameState.mainStoryCheckpoint.currentPrimaryLocation;
                    gameState.conversationHistory = gameState.mainStoryCheckpoint.conversationHistory;
                    gameState.currentNpc = gameState.mainStoryCheckpoint.currentNpc;
                    gameState.conversationCount = gameState.mainStoryCheckpoint.conversationCount;
                }
                
                // 显示提示
                const hintMessage = document.createElement('div');
                hintMessage.className = 'system-message';
                hintMessage.innerHTML = `
                    <span style="font-weight: bold; color: #6a1b9a;">
                        💕 返回主线剧情<br><br>
                        约会结束了，继续你的夏威夷冒险吧！
                    </span>
                `;
                chatContainer.appendChild(hintMessage);
                chatContainer.scrollTop = chatContainer.scrollHeight;
                
            }, 3000);
        }
        
        console.log("约会模块已加载 ✓");