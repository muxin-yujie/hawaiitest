# 🌺 夏威夷游戏 - GitHub 部署指南

## 📦 已创建的文件

### 1. `.env.example`
环境变量示例文件，包含 API Key 配置模板

### 2. `.gitignore`
Git 忽略文件，保护敏感信息不被提交

### 3. `.github/workflows/deploy.yml`
GitHub Actions 配置文件，自动部署到 GitHub Pages

### 4. `环境变量说明.md`
详细的环境变量使用说明

---

## 🚀 部署到 GitHub 的步骤

### 第一步：准备 GitHub 仓库

1. 在 GitHub 上创建新仓库（或选择现有仓库）
   ```
   仓库名：hawaii-modular（或其他你喜欢的名字）
   可见性：Public 或 Private（建议 Public，方便分享）
   ```

2. 初始化 Git（如果还没有）
   ```bash
   cd d:\hawaii_modular
   git init
   ```

3. 添加远程仓库
   ```bash
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   ```

---

### 第二步：配置环境变量

#### 方式 A：使用 localStorage（推荐）✅

**优点：**
- 最安全，API Key 不提交到 Git
- 用户自己管理 API Key
- 适合公开仓库

**操作：**
1. 不需要设置 GitHub Secrets
2. 玩家在游戏设置界面输入自己的 API Key
3. API Key 保存在浏览器本地

#### 方式 B：使用 GitHub Secrets（可选）

**如果要在服务器端使用 API：**

1. 进入仓库 Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加：
   - Name: `QIANFAN_API_KEY`
   - Value: `你的 API_Key`

---

### 第三步：提交代码

1. 添加所有文件
   ```bash
   git add .
   ```

2. 提交
   ```bash
   git commit -m "Initial commit: Hawaii game project"
   ```

3. 推送到 GitHub
   ```bash
   git push -u origin main
   ```

---

### 第四步：启用 GitHub Pages

1. 进入仓库 Settings → Pages
2. Source 选择 "GitHub Actions"
3. 等待 Actions 完成部署（约 1-2 分钟）

---

### 第五步：访问游戏

部署完成后，游戏地址：
```
https://你的用户名.github.io/你的仓库名/
```

---

## 🔐 安全建议

### ✅ 推荐做法

1. **使用 localStorage 存储 API Key**
   - 当前项目已实现
   - 位置：`js/core.js` 和 `js/entry.js`
   - 玩家在游戏设置中输入自己的 API Key

2. **不要硬编码 API Key**
   - 删除 `js/config/game-config.js` 中的默认值
   - 第 109 行：`API_KEY: "sk-..."` 改为空字符串

3. **使用 .gitignore**
   - 已创建，会忽略 `.env` 文件
   - 保护敏感信息

### ⚠️ 避免的做法

1. ❌ 不要将 API Key 直接写在代码中
2. ❌ 不要提交 `.env` 文件到 Git
3. ❌ 不要在公开仓库中暴露 Secret

---

## 📝 修改建议

### 删除默认 API Key

编辑 `js/config/game-config.js` 第 109 行：

**修改前：**
```javascript
API_KEY: "sk-a0e31c0e743847eea76c53ba20fa985f",
```

**修改后：**
```javascript
API_KEY: "",  // 留空，让用户自己输入
```

---

## 🎯 快速部署命令

```bash
# 1. 初始化 Git
cd d:\hawaii_modular
git init

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "Deploy Hawaii game"

# 4. 添加远程仓库（替换为你的仓库）
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 5. 推送
git push -u origin main
```

---

## 📊 项目结构

```
hawaii_modular/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 配置
├── .env.example            # 环境变量示例
├── .gitignore             # Git 忽略文件
├── index.html             # 桌面端入口
├── mobile.html            # 移动端入口
├── css/                   # 样式文件
├── js/                    # JavaScript 文件
├── pictures/              # 图片资源
└── 环境变量说明.md         # 说明文档
```

---

## 🎮 玩家使用流程

1. 访问 GitHub Pages 网址
2. 第一次打开时，在设置界面输入自己的 API Key
3. API Key 保存在浏览器本地
4. 开始游戏

---

## 💡 常见问题

### Q: API Key 会泄露吗？
A: 不会。使用 localStorage 方式，API Key 只保存在玩家自己的浏览器中。

### Q: 可以不用 GitHub Pages 吗？
A: 可以。也可以部署到 Vercel、Netlify 等其他平台。

### Q: 需要设置域名吗？
A: 不需要。GitHub Pages 提供免费的子域名。

---

## 📞 需要帮助？

如果部署过程中遇到问题：
1. 检查 GitHub Actions 日志
2. 确认所有文件都已提交
3. 确认 .gitignore 已生效

祝部署顺利！🎉
