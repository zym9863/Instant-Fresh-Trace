# 即刻鲜踪 (Instant Fresh Trace)

[English](./README_EN.md) | **简体中文**

一个现代化的资讯聚合平台，让您随时掌握最新资讯动态。

![Nuxt](https://img.shields.io/badge/Nuxt-3.17.4-00DC82?style=flat&logo=nuxt.js&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3.5.14-4FC08D?style=flat&logo=vue.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)

## ✨ 特性

- 🚀 **现代化技术栈**: 基于 Nuxt 3、Vue 3、TypeScript 和 Tailwind CSS
- 📱 **响应式设计**: 完美适配桌面端和移动端
- 🎨 **精美界面**: 使用 @nuxt/ui 和 Headless UI 组件构建
- 📰 **多视图模式**: 支持列表视图和卡片视图
- 🔍 **智能分类**: 按来源和标签分类浏览
- ⚡ **实时更新**: 自动获取最新资讯内容
- 🔖 **个性化**: 书签收藏和个性化推荐
- 📤 **便捷分享**: 一键分享有趣内容
- 🌗 **暗色模式**: 护眼的深色主题支持

## 🛠️ 技术栈

### 核心框架
- **[Nuxt 3](https://nuxt.com/)** - Vue.js 全栈框架
- **[Vue 3](https://vuejs.org/)** - 渐进式 JavaScript 框架
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全的 JavaScript

### UI 组件
- **[@nuxt/ui](https://ui.nuxt.com/)** - Nuxt 官方 UI 组件库
- **[Tailwind CSS](https://tailwindcss.com/)** - 实用优先的 CSS 框架
- **[@headlessui/vue](https://headlessui.com/)** - 无样式可访问性组件
- **[@heroicons/vue](https://heroicons.com/)** - 精美的 SVG 图标集

### 状态管理
- **[Pinia](https://pinia.vuejs.org/)** - Vue 官方状态管理库
- **[@pinia/nuxt](https://pinia.vuejs.org/ssr/nuxt.html)** - Nuxt 集成

### 工具库
- **[@vueuse/nuxt](https://vueuse.org/)** - Vue 组合式函数集合
- **[date-fns](https://date-fns.org/)** - 现代化日期处理库
- **[uuid](https://github.com/uuidjs/uuid)** - UUID 生成器

## 🚀 快速开始

### 环境要求

- Node.js 18.x 或更高版本
- npm、pnpm、yarn 或 bun 包管理器

### 安装依赖

```bash
# 使用 npm
npm install

# 使用 pnpm (推荐)
pnpm install

# 使用 yarn
yarn install

# 使用 bun
bun install
```

### 开发服务器

启动开发服务器，访问 `http://localhost:3000`：

```bash
# 使用 npm
npm run dev

# 使用 pnpm
pnpm dev

# 使用 yarn
yarn dev

# 使用 bun
bun run dev
```

### 生产构建

构建生产版本：

```bash
# 使用 npm
npm run build

# 使用 pnpm
pnpm build

# 使用 yarn
yarn build

# 使用 bun
bun run build
```

### 预览生产版本

本地预览生产构建：

```bash
# 使用 npm
npm run preview

# 使用 pnpm
pnpm preview

# 使用 yarn
yarn preview

# 使用 bun
bun run preview
```

## 📁 项目结构

```
instant-fresh-trace/
├── assets/              # 静态资源文件
│   └── css/            
│       └── main.css     # 全局样式
├── layouts/             # 布局组件
│   └── default.vue      # 默认布局
├── pages/               # 页面组件
│   ├── index.vue        # 首页 - 资讯列表
│   ├── sources.vue      # 信息源管理
│   └── subscriptions.vue # 订阅管理
├── public/              # 公共静态文件
│   ├── favicon.ico
│   └── robots.txt
├── server/              # 服务器端代码
│   └── tsconfig.json
├── stores/              # Pinia 状态管理
│   └── feeds.ts         # 资讯数据状态
├── app.vue              # 根组件
├── nuxt.config.ts       # Nuxt 配置文件
├── package.json         # 项目依赖配置
└── tsconfig.json        # TypeScript 配置
```

## 🎯 功能模块

### 📰 资讯浏览
- 支持列表和卡片两种视图模式
- 按发布时间、标题、来源排序
- 实时加载状态和空状态处理
- 响应式设计，适配各种屏幕尺寸

### 🏷️ 分类筛选
- 按信息源分类浏览
- 标签系统支持多维度筛选
- 智能推荐相关内容

### 🔖 个人收藏
- 一键收藏感兴趣的文章
- 收藏夹管理和整理
- 离线阅读支持

### 📤 内容分享
- 原生分享 API 支持
- 自定义分享格式
- 一键复制到剪贴板

## 🎨 设计理念

### 现代化界面
- 采用卡片式设计语言
- 柔和的阴影和圆角
- 舒适的色彩搭配和间距

### 用户体验
- 直观的交互反馈
- 流畅的动画过渡
- 键盘导航支持

### 可访问性
- 语义化 HTML 结构
- 屏幕阅读器友好
- 高对比度主题支持

## 🚢 部署

查看 [Nuxt 部署文档](https://nuxt.com/docs/getting-started/deployment) 了解更多部署选项。

### Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署到 Vercel
vercel
```

### Netlify 部署

```bash
# 构建项目
npm run build

# 部署 .output/public 目录到 Netlify
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [Nuxt 3 文档](https://nuxt.com/docs)
- [Vue 3 文档](https://vuejs.org/guide/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Pinia 文档](https://pinia.vuejs.org/)

---

<div align="center">
  <p>用 ❤️ 和 Vue 构建</p>
</div>
