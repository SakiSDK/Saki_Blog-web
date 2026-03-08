# SakiSDKBLOG-个人博客

<p align="center">
  <image src="https://img.shields.io/badge/SakiSDKBlog-个人博客-ff69b4?style=for-the-badge&logo=vuedotjs"/>
</p>


​				![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vuedotjs)![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite)![Pinia](https://img.shields.io/badge/Pinia-3-yellow?logo=pinia)![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)![Vue Router](https://img.shields.io/badge/Vue_Router-4-35495e?logo=vuedotjs)![Sass](https://img.shields.io/badge/Sass-1.94-cc6699?logo=sass)


> 一个专注于 **技术沉淀** 与 **问题记录** 的个人博客。
> 
> *“既是为了防止遗忘，也希望能给你提供参考”*



### 项目简介

>  一个基于Vue3 + Vite + TypeScript 的现代化个人博客系统

**支持：** 

* 🔎 文章搜索功能
* 📝 Markdown 文章
* 📚 分类 / 标签
* 📷 相册系统
* 📊 Mermaid 图表
* 🌍 国际化
* ⚡ 高性能前端渲染

适用于 **个人博客/技术博客/内容管理系统**



### 📸 效果演示

> ⚠️ **提示**: 请将演示图片/GIF 放入 `docs/preview/` 目录，并取消下方注释。

#### 🖥️ 桌面端概览
> 首页采用响应式卡片布局，支持日/夜模式切换。
<p align="center" style="display: flex; flex-direction: column; flex-wrap: wrap; justify-content: center; align-items: center; gap: 20px;">
  <img src="./docs/preview/home/home-dark-1.avif" alt="Desktop Home" width="80%" />
  <img src="./docs/preview/home/home-dark-2.avif" alt="Desktop Home" width="80%" />
  <img src="./docs/preview/home/home-light-1.avif" alt="Desktop Home" width="80%" />
  <img src="./docs/preview/home/home-light-2.avif" alt="Desktop Home" width="80%" />
</p>

> 视频演示效果
<p align="center">
  <img src="./docs/preview/video/preview1.avi" alt="Preview Video" width="80%" />
</p>

#### 📱 移动端适配
> 针对不同尺寸屏幕的深度优化，确保在手机端也能获得原生应用般的体验。
<p align="center">
  <img src="./docs/preview/video/preview2.avi" alt="Preview Video" width="80%" />
</p>


### 🧱 技术栈

#### 核心与框架 (Core & Framework)
- **Vue 3**: 渐进式 JavaScript 框架 (Composition API)
- **TypeScript**: 强类型编程语言
- **Vite**: 下一代前端构建工具

#### 状态与路由 (State & Routing)
- **Pinia**: Vue 3 官方状态管理库
- **Pinia Plugin Persistedstate**: 状态持久化插件
- **Vue Router**: 官方路由管理器

#### 界面与样式 (UI & Styling)
- **Sass (SCSS)**: CSS 预处理器 (Variables, Mixins)
- **Anime.js**: 强大的 JavaScript 动画库
- **Normalize.css**: 跨浏览器样式重置

#### 工具与库 (Utilities & Tools)
- **VueUse**: Vue 组合式工具集
- **Axios**: 基于 Promise 的 HTTP 客户端
- **Lodash**: 实用工具库
- **Day.js**: 轻量级日期处理库
- **Vee-Validate & Zod**: 表单验证与模式校验

#### 内容与渲染 (Content & Rendering)
- **Markdown-it**: Markdown 解析器 (支持 Emoji, TOC, Container)
- **Highlight.js**: 代码语法高亮
- **Mermaid**: 流程图与图表渲染
- **Vue I18n**: 国际化支持


### ✨ 核心亮点

#### 🎨 沉浸式设计与交互
- **拟态窗口系统 (About Site)**: 在"关于本站"页实现类似 macOS 的窗口管理（最大化/最小化/关闭），配合 FLIP 动画技术，提供丝滑的视觉体验。
- **终端风格 (Construction Page)**: 施工页面采用 ASCII Art 结合打字机效果，致敬经典 CLI 界面。
- **响应式排版**: 针对移动端与桌面端深度适配，支持动态网格布局与内容自动折叠。

#### ⚡️ 性能优化
- **按需加载**: 实现 `v-lazy` 指令处理图片懒加载，显著提升首屏速度。
- **视口检测**: 自研 `v-reveal` 指令，基于 `IntersectionObserver` 实现元素进入视口的交错动画，减少主线程负担。
- **资源优化**: 采用 SVG Sprites 与 WebP 格式，平衡画质与加载体积。

#### 🛡️ 工程化与规范
- **类型安全**: 全量 TypeScript 开发，配合 Zod 进行运行时数据校验 (Runtime Validation)。
- **样式管理**: 深度定制 SCSS 架构，封装 Mixins、Functions 与 Variables，实现一键换肤与统一设计语言。
- **状态管理**: 基于 Pinia 实现模块化状态管理，并集成持久化插件，确保用户偏好不丢失。

#### 🧩 模块化架构
- **组件原子化**: 遵循单一职责原则，将 UI 拆分为 `bases` (基础)、`cards` (业务)、`sections` (区块) 三层架构。
- **逻辑复用**: 封装 `useMarkdown`, `useScroll` 等 Composables，实现逻辑与视图分离。


### 📂 项目结构

```bash
src/
├── apis/            # API 接口封装
├── assets/          # 静态资源 (Fonts, Icons, Images, SVGs)
├── components/      # 组件库
│   ├── bases/       # 基础 UI 组件 (WindowBar, CardHeader, etc.)
│   ├── cards/       # 业务功能卡片 (Aboutme, Aboutsite, Home, etc.)
│   ├── global/      # 全局通用组件 (Avatar, TopBar, FooterBar, etc.)
│   └── sections/    # 页面区块组件
├── configs/         # 项目配置 (Env, Server)
├── directives/      # 自定义指令 (v-lazy, v-reveal, v-ripple)
├── i18n/            # 国际化配置 (Locales: en, ja, zh-CN, zh-TW)
├── plugins/         # Vue 插件
├── routers/         # 路由配置
├── schemas/         # Zod 数据校验模式
├── stores/          # Pinia 状态管理
├── styles/          # 全局 SCSS 样式 (Variables, Mixins, Reset)
├── types/           # TypeScript 类型定义
├── utils/           # 工具函数库
├── views/           # 页面视图 (Home, About, Article, etc.)
├── App.vue          # 根组件
└── main.ts          # 入口文件
```

### 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产环境
pnpm run build

# 预览生产环境构建
pnpm run preview
```

### 📦 部署指南

> 本项目已内置 `Dockerfile` 和 `nginx.conf`，可直接使用。

#### 1. Docker 容器化部署 (推荐)

确保服务器已安装 Docker。

**构建镜像：**
```bash
docker build -t sakisdk-blog .
```

**运行容器：**
```bash
# 将容器 80 端口映射到宿主机 8080 端口
docker run -d -p 8080:80 --name blog sakisdk-blog
```
访问 `http://localhost:8080` 即可预览。

#### 2. Nginx 手动部署

若不使用 Docker，可手动构建并配置 Nginx。

**构建产物：**
```bash
pnpm install
pnpm run build
```
构建完成后，`dist` 目录即为静态资源文件。

**Nginx 配置 (参考)：**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/your/project/dist; # 指向构建后的 dist 目录
    index index.html;

    # 开启 Gzip 压缩
    gzip on;
    gzip_min_length 1k;
    gzip_comp_level 6;
    gzip_types text/plain application/javascript text/css;

    # 处理 SPA 路由 (History Mode)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```







