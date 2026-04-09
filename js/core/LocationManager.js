// ========================================
// 📍 地点管理系统 (LocationManager)
// ========================================
// 统一管理所有地点的添加、查询和显示

class LocationManager {
    constructor(game) {
        this.game = game;  // 关联的游戏实例
        this.visitedLocations = [];  // 已访问的地点
        console.log("📍 地点管理器已初始化");
    }

    // ============= 添加一级地点 =============
    /**
     * 添加主要景点（如：威基基海滩、钻石头山）
     * @param {string} name - 地点名称
     * @param {string} emoji - 地点 emoji 图标
     * @param {string} description - 地点描述
     */
    addPrimaryLocation(name, emoji, description) {
        // 检查是否已存在
        const exists = this.visitedLocations.some(loc => loc.name === name && loc.type === "primary");
        
        if (!exists) {
            this.visitedLocations.push({
                type: "primary",
                name: name,
                emoji: emoji,
                description: description,
                visited: true,
                visitedAt: new Date().toISOString()
            });
            console.log(`✅ 添加一级地点：${emoji} ${name}`);
        }
        
        return this.visitedLocations.find(loc => loc.name === name && loc.type === "primary");
    }

    // ============= 添加二级地点 =============
    /**
     * 添加附属景点（如：酒店、冲浪店）
     * @param {string} primaryName - 所属一级地点名称
     * @param {string} name - 二级地点名称
     * @param {string} emoji - 地点 emoji 图标
     * @param {string} description - 地点描述
     */
    addSecondaryLocation(primaryName, name, emoji, description) {
        const locationKey = `${primaryName}-${name}`;
        
        // 检查是否已存在
        const exists = this.visitedLocations.some(loc => loc.key === locationKey);
        
        if (!exists) {
            this.visitedLocations.push({
                type: "secondary",
                key: locationKey,
                name: name,
                emoji: emoji,
                description: description,
                primaryLocation: primaryName,
                visited: true,
                visitedAt: new Date().toISOString()
            });
            console.log(`✅ 添加二级地点：${emoji} ${name} (属于 ${primaryName})`);
        }
        
        return this.visitedLocations.find(loc => loc.key === locationKey);
    }

    // ============= 查询地点 =============
    /**
     * 根据名称查找地点
     * @param {string} name - 地点名称
     * @returns {Object|null} 地点对象
     */
    findByName(name) {
        return this.visitedLocations.find(loc => loc.name === name);
    }

    /**
     * 获取所有一级地点
     * @returns {Array} 一级地点数组
     */
    getPrimaryLocations() {
        return this.visitedLocations.filter(loc => loc.type === "primary");
    }

    /**
     * 获取某个一级地点下的所有二级地点
     * @param {string} primaryName - 一级地点名称
     * @returns {Array} 二级地点数组
     */
    getSecondaryLocations(primaryName) {
        return this.visitedLocations.filter(
            loc => loc.type === "secondary" && loc.primaryLocation === primaryName
        );
    }

    /**
     * 获取所有地点
     * @returns {Array} 所有地点
     */
    getAllLocations() {
        return this.visitedLocations;
    }

    /**
     * 检查是否访问过某个地点
     * @param {string} name - 地点名称
     * @returns {boolean} 是否访问过
     */
    hasVisited(name) {
        return this.visitedLocations.some(loc => loc.name === name);
    }

    // ============= 统计信息 =============
    /**
     * 获取访问过的地点总数
     * @returns {number} 地点总数
     */
    getCount() {
        return this.visitedLocations.length;
    }

    /**
     * 获取一级地点数量
     * @returns {number} 一级地点数量
     */
    getPrimaryCount() {
        return this.getPrimaryLocations().length;
    }

    /**
     * 获取二级地点数量
     * @returns {number} 二级地点数量
     */
    getSecondaryCount() {
        return this.getSecondaryLocations().length;
    }

    // ============= 显示地点列表（用于 UI） =============
    /**
     * 获取格式化的地点列表（用于显示）
     * @returns {Array} 格式化后的地点列表
     */
    getFormattedList() {
        return this.visitedLocations.map(loc => ({
            ...loc,
            label: loc.type === "primary" ? "🌟 一级地点" : "✨ 二级地点",
            displayText: `${loc.emoji} ${loc.name} ${loc.type === "secondary" ? `(属于 ${loc.primaryLocation})` : ''}`
        }));
    }

    // ============= 数据导出 =============
    /**
     * 导出地点数据（用于存档）
     * @returns {Array} 地点数据
     */
    exportData() {
        return this.visitedLocations.map(loc => ({...loc}));
    }

    /**
     * 导入地点数据（用于读档）
     * @param {Array} data - 地点数据
     */
    importData(data) {
        this.visitedLocations = data.map(item => ({...item}));
        console.log(`📍 导入了 ${this.visitedLocations.length} 个地点`);
    }

    // ============= 清除 =============
    /**
     * 清除所有地点记录
     */
    clear() {
        this.visitedLocations = [];
        console.log("📍 地点记录已清除");
    }
}

// 暴露到全局
window.LocationManager = LocationManager;

console.log("✅ LocationManager 类已加载 - 地点管理系统就绪");
