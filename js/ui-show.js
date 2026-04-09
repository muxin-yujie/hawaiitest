// ========== 地点管理模块 ==========
// 负责添加和管理访问过的地点（一级地点和二级地点）

/**
 * 添加一级地点（主要景点）
 * @param {string} name - 地点名称
 * @param {string} emoji - 地点 emoji 图标
 * @param {string} description - 地点描述
 */
function addPrimaryLocation(name, emoji, description) {
    if (!gameState.locations.some(loc => loc.name === name)) {
        gameState.locations.push({
            type: "primary",
            name: name,
            emoji: emoji,
            description: description,
            visited: true
        });
    }
}

/**
 * 添加二级地点（附属景点）
 * @param {string} primaryName - 所属一级地点名称
 * @param {string} name - 二级地点名称
 * @param {string} emoji - 地点 emoji 图标
 * @param {string} description - 地点描述
 */
function addSecondaryLocation(primaryName, name, emoji, description) {
    const locationKey = `${primaryName}-${name}`;
    // 检查是否已存在：通过 type + primaryLocation + name 三个属性判断
    const exists = gameState.locations.some(loc => 
        loc.type === "secondary" && 
        loc.primaryLocation === primaryName && 
        loc.name === name
    );
    
    if (!exists) {
        gameState.locations.push({
            type: "secondary",
            key: locationKey,
            name: name,
            emoji: emoji,
            description: description,
            primaryLocation: primaryName,
            visited: true
        });
    }
}

// ========== 地点显示模块 ==========
function showLocation() {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
            
    // 检查 gameState 是否已初始化
    if (typeof gameState === 'undefined') {
        console.error('gameState 未初始化');
        modalContent.innerHTML = '<h3>📍 地点记录</h3><p style="color: #ff5722;">游戏尚未开始，请先开始游戏</p>';
        modal.style.display = 'block';
        // 强制重绘后添加动画类
        setTimeout(() => modal.classList.add('show'), 10);
        return;
    }
    
    let content = '<h3>📍 地点记录</h3>';
    
    // 获取所有一级地点
    const primaryLocations = gameState.locations.filter(loc => loc.type === "primary");
    
    if (!primaryLocations || primaryLocations.length === 0) {
        content += '<p>还没有访问过任何地点</p>';
    } else {
        // 显示一级地点及其下属的二级地点
        primaryLocations.forEach(primary => {
            const gradient = 'linear-gradient(135deg, #ffc3d9 0%, #a8e6ff 100%)';
            
            // 一级地点
            content += `
                <div style="margin-bottom: 15px; padding: 15px; background: ${gradient}; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
                    <div style="font-weight: bold; font-size: 1.2em; color: #6a1b9a; display: flex; align-items: center; gap: 8px;">
                        ${primary.emoji} ${primary.name}
                        <span style="font-size: 0.75em; background: rgba(255,255,255,0.5); padding: 3px 10px; border-radius: 20px; margin-left: 10px; color: #6a1b9a;">
                            🌟 一级地点
                        </span>
                    </div>
                    <div style="margin-top: 10px; font-size: 0.95em; color: #6a1b9a; line-height: 1.6;">
                        ${primary.description}
                    </div>
            `;
            
            // 查找并显示该一级地点下属的所有二级地点
            const secondaryLocations = gameState.locations.filter(
                loc => loc.type === "secondary" && loc.primaryLocation === primary.name
            );
            
            if (secondaryLocations.length > 0) {
                content += `<div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.5); border-radius: 10px;">`;
                content += `<div style="font-weight: bold; font-size: 1em; color: #6a1b9a; margin-bottom: 10px; display: flex; align-items: center; gap: 5px;">
                    📍 包含地点：
                </div>`;
                
                secondaryLocations.forEach(secondary => {
                    content += `
                        <div style="margin: 8px 0; padding: 10px; background: white; border-radius: 8px; border-left: 3px solid #6a1b9a;">
                            <div style="font-weight: bold; font-size: 1em; color: #6a1b9a; display: flex; align-items: center; gap: 5px;">
                                ${secondary.emoji} ${secondary.name}
                            </div>
                            ${secondary.description ? `<div style="margin-top: 5px; font-size: 0.9em; color: #666;">${secondary.description}</div>` : ''}
                        </div>
                    `;
                });
                
                content += `</div>`;
            }
            
            content += `</div>`; // 结束一级地点容器
        });
    }
    
    modalContent.innerHTML = content;
    modal.style.display = 'block';
    // 强制重绘后添加动画类
    setTimeout(() => modal.classList.add('show'), 10);
}
        
        function showEncounters() {
            const modal = document.getElementById('modal');
            const modalContent = document.getElementById('modalContent');
            
            let content = '<h3>💕 邂逅记录</h3>';
            if (gameState.encounters.length === 0) {
                content += '<p>还没有遇到任何人</p>';
            } else {
                gameState.encounters.forEach((encounter, index) => {
                    // 添加邀约状态显示
                    let invitationHTML = '';
                    let actionButtons = '';
                    
                    if (encounter.hasInvitation) {
                        if (encounter.invitationStatus === 'pending') {
                            invitationHTML = `<div style="margin-top: 8px; padding: 8px; background: linear-gradient(135deg, #ffd89b 0%, #d4fc79 100%); border-radius: 8px; border-left: 3px solid #ff9800;"><div style="font-size: 0.85em; color: #5d4037;"><strong>💌 待回复的邀约</strong><br>📍 ${encounter.invitation?.scene || encounter.invitation?.location || '未知地点'}<br>⏰ ${encounter.invitation?.time || '未知时间'}<br>🎯 ${encounter.invitation?.activity || '未知活动'}</div></div>`;
                            actionButtons = `<div style="margin-top: 10px; display: flex; gap: 8px;"><button onclick="acceptInvitation(${index})" style="padding: 8px 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 20px; cursor: pointer; font-size: 0.9em; font-weight: bold; flex: 1;">✅ 接受</button><button onclick="declineInvitation(${index})" style="padding: 8px 16px; background: #e0e0e0; color: #666; border: none; border-radius: 20px; cursor: pointer; font-size: 0.9em; font-weight: bold; flex: 1;">❌ 拒绝</button></div>`;
                        } else if (encounter.invitationStatus === 'accepted') {
                            invitationHTML = `<div style="margin-top: 8px; padding: 8px; background: linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%); border-radius: 8px; border-left: 3px solid #4caf50;"><div style="font-size: 0.85em; color: #2e7d32;"><strong>✅ 已接受</strong><br>准备赴约吧！</div></div>`;
                            actionButtons = `<div style="margin-top: 10px;"><button onclick="startInvitationDate(${index})" style="width: 100%; padding: 10px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; border-radius: 20px; cursor: pointer; font-size: 0.95em; font-weight: bold; box-shadow: 0 2px 8px rgba(240, 147, 251, 0.3);">💕 前往赴约</button></div>`;
                        } else if (encounter.invitationStatus === 'declined' || encounter.invitationStatus === 'completed') {
                            invitationHTML = `<div style="margin-top: 8px; padding: 8px; background: #f5f5f5; border-radius: 8px; border-left: 3px solid #9e9e9e;"><div style="font-size: 0.85em; color: #757575;"><strong>❌ ${encounter.invitationStatus === 'completed' ? '已完成' : '已拒绝'}</strong></div></div>`;
                        }
                    }
                    
                    const age = encounter.age || 25;
                    const nationality = encounter.nationality || 'Unknown';
                    const occupation = encounter.occupation || 'Traveler';
                    const personality = encounter.personality || encounter.description || '';
                    
                    content += `
                        <div style="margin-bottom: 15px; padding: 15px; background: linear-gradient(135deg, #ffc3d9 0%, #a8e6ff 100%); border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
                            <div style="font-weight: bold; font-size: 1.1em; color: #6a1b9a; margin-bottom: 10px;">
                                ${encounter.emoji || '👤'} ${encounter.name || '神秘人'} | ${age}岁 | ${nationality} | ${occupation}
                            </div>
                            ${personality ? `<div style="margin: 8px 0; color: #555; line-height: 1.6;">${personality}</div>` : ''}
                            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ddd; font-size: 0.85em; color: #8d6e63;">
                                📍 邂逅地点：${encounter.scene || '未知'}
                            </div>
                            ${invitationHTML}
                            ${actionButtons}
                        </div>
                    `;
                });
            }
            
            modalContent.innerHTML = content;
            modal.style.display = 'block';
            setTimeout(() => modal.classList.add('show'), 10);
        }
        
        function showNotebook() {
            const modal = document.getElementById('modal');
            const modalContent = document.getElementById('modalContent');
            
            let content = '<h3>📝 旅行笔记</h3>';
            if (gameState.notebook.length === 0) {
                content += '<p>还没有记录任何笔记</p>';
            } else {
                // 倒序遍历，最新的笔记显示在最上面
                [...gameState.notebook].reverse().forEach(note => {
                    const gradient = 'linear-gradient(135deg, #ffc3d9 0%, #a8e6ff 100%)';
                    
                    content += `
                        <div style="margin-bottom: 15px; padding: 15px; background: ${gradient}; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
                            <div style="font-weight: bold; font-size: 1.1em; color: #6a1b9a; margin-bottom: 8px;">${note.title}</div>
                            <div style="font-size: 0.95em; color: #6a1b9a; line-height: 1.6; background: rgba(255,255,255,0.5); padding: 10px; border-radius: 10px;">${note.content}</div>
                        </div>
                    `;
                });
            }
            
            modalContent.innerHTML = content;
            modal.style.display = 'block';
            setTimeout(() => modal.classList.add('show'), 10);
        }
        
        function showMedals() {
            const modal = document.getElementById('modal');
            const modalContent = document.getElementById('modalContent');
            
            let content = '<h3>🏅 成就徽章</h3>';
            if (gameState.medals.length === 0) {
                content += '<p>还没有获得任何徽章</p>';
            } else {
                gameState.medals.forEach(medal => {
                    content += `
                        <div style="margin-bottom: 15px; padding: 15px; background: linear-gradient(135deg, #ffc8dd 0%, #bde0fe 100%); border-radius: 15px; border: 2px solid #ffafcc;">
                            <div style="font-size: 2em; margin-bottom: 10px;">${medal.icon}</div>
                            <div style="font-weight: bold; font-size: 1.2em; color: #6a1b9a; margin-bottom: 5px;">${medal.name}</div>
                            <div style="font-size: 0.9em; color: #555;">${medal.description}</div>
                        </div>
                    `;
                });
            }
            
            modalContent.innerHTML = content;
            modal.style.display = 'block';
            setTimeout(() => modal.classList.add('show'), 10);
        }
        
        function showPhotos() {
            const modal = document.getElementById('modal');
            const modalContent = document.getElementById('modalContent');
            
            let content = '<h3>📸 照片收集</h3>';
            
            // 检查 gameState.photos 是否存在
            if (!gameState.photos || gameState.photos.length === 0) {
                content += '<p>还没有拍摄任何照片</p>';
            } else {
                // 照片墙布局
                content += `
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; padding: 10px;">
                `;
                
                gameState.photos.forEach((photo, index) => {
                    const gradient = 'linear-gradient(135deg, #ffc3d9 0%, #a8e6ff 100%)';
                    
                    content += `
                        <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.15); transition: transform 0.3s ease; border: 3px solid #FF69B4; display: flex; flex-direction: column;" 
                             onmouseover="this.style.transform='scale(1.05)'" 
                             onmouseout="this.style.transform='scale(1)'">
                            <div style="position: relative; width: 100%;">
                                <img src="${photo.src}" alt="${photo.name}" 
                                     style="width: 100%; height: auto; display: block;"
                                     onload="this.parentElement.style.aspectRatio = this.naturalWidth / this.naturalHeight">
                            </div>
                            <div style="padding: 8px 12px; background: ${gradient}; border-top: 1px solid rgba(255,255,255,0.5);">
                                <div style="text-align: center; font-weight: 600; font-size: 0.9em; color: #6a1b9a;">
                                    ${photo.emoji || '📸'} ${photo.name}
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                content += `</div>`;
            }
            
            modalContent.innerHTML = content;
            modal.style.display = 'block';
            setTimeout(() => modal.classList.add('show'), 10);
        }

        function showBranches() {
            const modal = document.getElementById('modal');
            const modalContent = document.getElementById('modalContent');
            
            let content = '<h3>🌿 剧情分支</h3>';
            if (gameState.branches.length === 0) {
                content += '<p>还没有触发任何剧情分支</p>';
            } else {
                gameState.branches.forEach(branch => {
                    content += `
                        <div style="margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.3); border-radius: 10px;">
                            <div style="font-weight: bold;">${branch.title}</div>
                            <div style="margin-top: 5px; font-size: 0.9em; color: #555;">${branch.description}</div>
                            <div style="margin-top: 5px; font-size: 0.8em; color: #6a1b9a;">
                                地点: ${branch.location}
                            </div>
                        </div>
                    `;
                });
            }
            
            modalContent.innerHTML = content;
            modal.style.display = 'block';
            setTimeout(() => modal.classList.add('show'), 10);
        }
        
        function closeModal() {
            const modal = document.getElementById('modal');
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300); // 等待动画完成
        }
        
        /**
         * 显示地点信息（已在第 45 行定义）
         */
        
        window.showLocation = showLocation;
        window.showEncounters = showEncounters;
        window.showNotebook = showNotebook;
        window.showMedals = showMedals;
        window.showPhotos = showPhotos;
        window.showBranches = showBranches;
        window.closeModal = closeModal;
        window.addPrimaryLocation = addPrimaryLocation;
        window.addSecondaryLocation = addSecondaryLocation;
        
        // ========== 用户菜单功能 ==========
        window.toggleUserMenu = toggleUserMenu;
        
        // 点击页面其他地方关闭用户菜单
        document.addEventListener('click', function(e) {
            const userMenuBtn = document.querySelector('.user-menu-btn');
            const dropdown = document.getElementById('userMenuDropdown');
            
            if (dropdown && userMenuBtn && 
                !userMenuBtn.contains(e.target) && 
                !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
        
        // 监听 ESC 键关闭 modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modal = document.getElementById('modal');
                if (modal && modal.style.display !== 'none') {
                    closeModal();
                }
            }
        });
        
        // 调试信息
        console.log("UI-Show 模块已加载 ✓");
        console.log("window.showLocation:", typeof window.showLocation);
        console.log("window.showEncounters:", typeof window.showEncounters);
        console.log("window.showMedals:", typeof window.showMedals);
        console.log("window.showBranches:", typeof window.showBranches);
        console.log("window.toggleUserMenu:", typeof window.toggleUserMenu);
        
        /**
         * 切换用户菜单显示/隐藏
         */
        function toggleUserMenu() {
            const dropdown = document.getElementById('userMenuDropdown');
            const userName = document.getElementById('userName');
            const menuUserName = document.getElementById('menuUserName');
            
            if (!dropdown) {
                console.error('User menu dropdown not found');
                return;
            }
            
            // 更新用户名
            if (userName && gameState.player) {
                const name = gameState.player.name || "游客";
                userName.textContent = name;
                if (menuUserName) {
                    menuUserName.textContent = name;
                }
            }
            
            // 切换显示状态
            if (dropdown.style.display === 'none') {
                dropdown.style.display = 'block';
            } else {
                dropdown.style.display = 'none';
            }
        }
        