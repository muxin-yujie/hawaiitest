# 🌺 夏威夷游戏 - GitHub Pages 部署说明

## 📱 访问模式

游戏现在支持**自动设备检测**，根据用户设备自动跳转到合适的页面：

### 桌面端用户
- 访问：`https://你的用户名.github.io/hawaiitest/`
- 流程：`index.html`（名字输入动画）→ `game.html`（实际游戏）
- 体验：完整的纸飞机动画开场

### 移动端用户
- 访问：`https://你的用户名.github.io/hawaiitest/`
- 流程：自动跳转到 `mobile.html`（直接开始游戏）
- 体验：无动画，快速加载，专为手机优化

## 🚀 部署步骤

### 1. 推送到 GitHub

```bash
# 初始化仓库（如果还没有）
git init
git add .
git commit -m "🌺 夏威夷游戏初始版本"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/hawaiitest.git

# 推送到 main 分支
git branch -M main
git push -u origin main
```

### 2. 配置 GitHub Pages

1. 进入 GitHub 仓库页面
2. 点击 **Settings** → **Pages**
3. Source 选择：**Deploy from a branch**
4. Branch 选择：**main** / **root**
5. 点击 **Save**

### 3. 等待部署完成

- GitHub Actions 会自动构建
- 大约 1-2 分钟后，你的网站就会上线
- 访问地址：`https://你的用户名.github.io/hawaiitest/`

## 📂 文件结构说明

```
hawaii_modular/
├── index.html          # 桌面版开场（带名字动画）→ 自动检测设备
├── game.html          # 桌面版游戏页面
├── mobile.html        # 移动版游戏页面（包含名字输入）
├── css/
│   ├── style.css      # 桌面版样式
│   └── mobile.css     # 移动版样式
├── js/
│   ├── config/
│   │   └── game-config.js  # 游戏配置（包含 API Key，不要上传！）
│   ├── game.js        # 主游戏逻辑
│   └── ...            # 其他模块
├── pictures/          # 图片资源
└── music/             # 音乐资源
```

## ⚠️ 重要注意事项

### 1. API Key 安全

**千万不要**将包含 API Key 的配置文件上传到 GitHub！

```bash
# 确保 .gitignore 包含：
js/config/game-config.js
.env
```

### 2. 本地测试

在部署前，建议先在本地测试：

```bash
# 使用 http-server
npx http-server -p 8000

# 访问：
# 桌面版：http://localhost:8000/
# 移动版：http://localhost:8000/mobile.html
```

### 3. 移动端测试

在手机上测试移动版：
1. 查看电脑 IP：`ipconfig`
2. 手机访问：`http://电脑 IP:8000/mobile.html`

## 🔧 常见问题

### Q1: 移动端用户还是看到桌面版？
**A:** 清除浏览器缓存，或者强制刷新（Ctrl+Shift+R）

### Q2: GitHub Pages 显示 404？
**A:** 
- 检查是否推送到 `main` 分支
- 检查 GitHub Actions 是否成功
- 等待 2-3 分钟让部署完成

### Q3: 图片/音乐加载失败？
**A:** 
- 检查文件路径是否正确（区分大小写）
- 确保文件已推送到 GitHub
- GitHub 是 Linux 系统，路径大小写敏感

### Q4: API 调用失败？
**A:** 
- 检查 `js/config/game-config.js` 中的 API Key
- 确保 API Key 有效且有余额
- 检查浏览器控制台错误信息

## 📊 访问统计

你可以在 GitHub 仓库的 **Insights** → **Traffic** 查看：
- 访问量（Views）
- 独立访客（Unique visitors）
- 热门引用（Referrers）

## 🎯 优化建议

### 性能优化
- 压缩图片（使用 TinyPNG 等工具）
- 音乐文件使用 MP3 格式
- 启用 GitHub Pages 的 HTTPS

### SEO 优化
- 添加 `meta description`
- 使用语义化的 HTML 标签
- 添加 Open Graph 标签（用于社交分享）

### 用户体验
- 添加加载动画
- 优化首屏加载速度
- 添加错误提示和重试机制

## 📞 技术支持

遇到问题？检查这些地方：
1. 浏览器控制台（F12）
2. GitHub Actions 日志
3. 游戏日志（console.log）

---

**祝你部署顺利！🌺**
