# 乐悠疯狂 8 点 (Crazy Eights)

一个基于 React + Vite + Tailwind CSS 开发的经典纸牌游戏。

## 游戏特性
- **经典规则**：完全实现“疯狂 8 点”核心玩法。
- **智能 AI**：具有基础策略的 AI 对手。
- **响应式设计**：完美适配手机、平板和电脑屏幕。
- **流畅动画**：使用 Framer Motion 实现丝滑的卡片交互。
- **万能 8 点**：打出数字 8 即可改变当前花色。

## 部署到 Vercel 指南

1. **推送代码到 GitHub**
   - 在 GitHub 上创建一个新的仓库。
   - 在本地运行以下命令：
     ```bash
     git init
     git add .
     git commit -m "Initial commit: Crazy Eights Game"
     git remote add origin <你的仓库URL>
     git branch -M main
     git push -u origin main
     ```

2. **在 Vercel 上导入项目**
   - 登录 [Vercel 控制台](https://vercel.com)。
   - 点击 **"Add New"** -> **"Project"**。
   - 导入你刚刚创建的 GitHub 仓库。

3. **配置环境变量**
   - 在 Vercel 的项目设置中，找到 **"Environment Variables"**。
   - 添加键值对：
     - `GEMINI_API_KEY`: 你的 Google AI SDK 密钥（如果游戏逻辑中使用了 AI 功能）。

4. **部署**
   - 点击 **"Deploy"**。Vercel 会自动识别 Vite 配置并完成构建。

## 本地开发
```bash
npm install
npm run dev
```

## 构建生产版本
```bash
npm run build
```
