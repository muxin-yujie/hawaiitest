// ============================================================================
// 错误处理模块
// ============================================================================
// 提供统一的错误处理、日志记录和用户提示功能

const ErrorHandler = {
    // 错误级别
    LogLevel: {
        DEBUG: 'debug',
        INFO: 'info',
        WARNING: 'warning',
        ERROR: 'error',
        CRITICAL: 'critical'
    },

    // 当前日志级别（生产环境可设置为 ERROR）
    currentLogLevel: 'debug',

    // 是否显示用户提示
    showUserToast: true,

    // 错误统计
    errorStats: {
        total: 0,
        byType: {}
    },

    /**
     * 初始化错误处理
     */
    init() {
        // 捕获全局错误
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event.error || event.message);
        });

        // 捕获未处理的 Promise 拒绝
        window.addEventListener('unhandledrejection', (event) => {
            this.handleGlobalError(event.reason || 'Unhandled Promise Rejection');
        });

        console.log('✓ 错误处理模块已初始化');
    },

    /**
     * 处理全局错误
     */
    handleGlobalError(error) {
        this.log(this.LogLevel.CRITICAL, 'GLOBAL', error);
        
        if (this.showUserToast) {
            this.showToast('发生错误，请查看控制台详情', 'error');
        }
    },

    /**
     * 统一日志记录
     */
    log(level, module, message, data = null) {
        // 检查日志级别
        if (!this.shouldLog(level)) return;

        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}] [${module}]`;

        // 更新统计
        this.errorStats.total++;
        if (level === this.LogLevel.ERROR || level === this.LogLevel.CRITICAL) {
            this.errorStats.byType[module] = (this.errorStats.byType[module] || 0) + 1;
        }

        // 根据级别输出不同格式
        switch (level) {
            case this.LogLevel.DEBUG:
                console.debug(`${prefix}`, message, data || '');
                break;
            case this.LogLevel.INFO:
                console.info(`${prefix}`, message, data || '');
                break;
            case this.LogLevel.WARNING:
                console.warn(`${prefix}`, message, data || '');
                break;
            case this.LogLevel.ERROR:
                console.error(`${prefix}`, message, data || '');
                break;
            case this.LogLevel.CRITICAL:
                console.error(`${prefix} ❌`, message, data || '');
                break;
        }
    },

    /**
     * 检查是否应该记录该级别的日志
     */
    shouldLog(level) {
        const levels = Object.values(this.LogLevel);
        const currentLevelIndex = levels.indexOf(this.currentLogLevel);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex >= currentLevelIndex;
    },

    /**
     * 处理 API 调用错误
     */
    handleAPIError(error, context = 'API 调用') {
        this.log(this.LogLevel.ERROR, context, error.message || error);
        
        const userMessage = this.getAPIErrorMessage(error);
        if (this.showUserToast) {
            this.showToast(userMessage, 'error');
        }
        
        return userMessage;
    },

    /**
     * 获取用户友好的 API 错误消息
     */
    getAPIErrorMessage(error) {
        if (typeof error === 'string') {
            if (error.includes('network')) return '网络连接失败，请检查网络';
            if (error.includes('timeout')) return '请求超时，请重试';
            if (error.includes('401')) return '认证失败，请刷新页面';
            if (error.includes('403')) return '无权访问，请刷新页面';
            if (error.includes('500')) return '服务器错误，请稍后重试';
        }
        return '请求失败，请重试';
    },

    /**
     * 处理数据验证错误
     */
    handleValidationError(module, field, message) {
        this.log(this.LogLevel.WARNING, module, `验证失败 [${field}]: ${message}`);
        return false;
    },

    /**
     * 处理空数据错误
     */
    handleNullData(module, fieldName) {
        this.log(this.LogLevel.WARNING, module, `数据为空：${fieldName}`);
        return null;
    },

    /**
     * 处理索引越界错误
     */
    handleIndexOutOfBounds(module, index, length) {
        this.log(this.LogLevel.ERROR, module, `索引越界：${index}/${length}`);
        if (this.showUserToast) {
            this.showToast('数据加载失败，请刷新页面', 'error');
        }
    },

    /**
     * 显示用户提示（Toast）
     */
    showToast(message, type = 'info') {
        // 检查是否已有 Toast
        let toast = document.querySelector('.error-toast');
        if (toast) {
            toast.remove();
        }

        // 创建 Toast
        toast = document.createElement('div');
        toast.className = `error-toast toast-notification toast-${type}`;
        toast.innerHTML = `
            <span class="toast-notification-icon">${this.getErrorIcon(type)}</span>
            <div class="toast-notification-content">
                <span class="toast-notification-message">${message}</span>
            </div>
        `;

        // 添加样式
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: ${this.getErrorBackground(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(toast);

        // 3 秒后自动移除
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    },

    /**
     * 获取错误图标
     */
    getErrorIcon(type) {
        const icons = {
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            success: '✅'
        };
        return icons[type] || icons.info;
    },

    /**
     * 获取错误背景色
     */
    getErrorBackground(type) {
        const colors = {
            error: 'linear-gradient(135deg, #f53635 0%, #d91e18 100%)',
            warning: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
            info: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
            success: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)'
        };
        return colors[type] || colors.info;
    },

    /**
     * 包装函数，添加错误处理
     */
    wrapAsync(fn, context = 'unknown') {
        return async (...args) => {
            try {
                return await fn(...args);
            } catch (error) {
                this.log(this.LogLevel.ERROR, context, error.message || error);
                throw error; // 重新抛出，让调用者决定如何处理
            }
        };
    },

    /**
     * 安全执行函数（不抛出错误）
     */
    safeExecute(fn, defaultValue = null, context = 'unknown') {
        try {
            return fn();
        } catch (error) {
            this.log(this.LogLevel.ERROR, context, error.message || error);
            return defaultValue;
        }
    },

    /**
     * 获取错误统计
     */
    getStats() {
        return { ...this.errorStats };
    },

    /**
     * 重置错误统计
     */
    resetStats() {
        this.errorStats = {
            total: 0,
            byType: {}
        };
    }
};

// 快捷方法
const logError = (module, message, data) => ErrorHandler.log(ErrorHandler.LogLevel.ERROR, module, message, data);
const logWarning = (module, message, data) => ErrorHandler.log(ErrorHandler.LogLevel.WARNING, module, message, data);
const logInfo = (module, message, data) => ErrorHandler.log(ErrorHandler.LogLevel.INFO, module, message, data);
const logDebug = (module, message, data) => ErrorHandler.log(ErrorHandler.LogLevel.DEBUG, module, message, data);

// 暴露到全局
if (typeof window !== 'undefined') {
    window.ErrorHandler = ErrorHandler;
    window.logError = logError;
    window.logWarning = logWarning;
    window.logInfo = logInfo;
    window.logDebug = logDebug;
}

console.log('✓ 错误处理模块已加载');
