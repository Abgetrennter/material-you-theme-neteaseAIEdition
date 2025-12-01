# 项目结构与模块分析

本文档详细描述了 Material You Theme for Netease Cloud Music 的代码结构、模块功能及核心业务逻辑位置。

## 1. 项目目录结构

```
src/
├── main.js                                     # 核心入口文件，负责主题初始化和全局逻辑
├── manifest.json                               # 插件清单文件，定义元数据和注入规则
├── settings.js                                 # 设置界面组件 (React) 及配置管理
├── utils.js                                    # 通用工具函数 (DOM操作, 配置读写)
├── color-utils.js                              # 颜色空间转换工具 (RGB/HSL/LAB)
├── scheme-presets.js                           # 预定义配色方案数据
├── list-view-switcher.js                       # 列表视图切换逻辑 (紧凑/舒适/宽敞)
├── ripple.js                                   # 按钮点击波纹效果实现
├── time-indicator.js                           # 播放时间显示逻辑 (剩余时间/总时间)
├── styles.scss                                 # 主样式表，定义核心组件样式
├── _ncm-css-override.scss                      # 网易云音乐原生样式覆盖
├── dynamic-theme.scss                          # 动态主题变量定义 (深色/浅色模式适配)
├── settings.scss                               # 设置界面专用样式
├── list-view-switcher.scss                     # 列表视图切换器样式
├── ripple.scss                                 # 波纹效果样式
└── refined-now-playing-accent-color-compatibility.scss # 兼容性样式
```

## 2. 模块功能与关系说明

### 核心逻辑模块
- **main.js**: 整个主题的指挥中心。
  - **功能**: 负责初始化主题、监听DOM变化、应用动态颜色、协调各个子模块（如设置、波纹、列表切换）。
  - **关系**: 依赖 `utils.js` 进行DOM操作，调用 `color-utils.js` 生成配色，挂载 `settings.js` 的React组件。

- **settings.js**: 用户交互的核心。
  - **功能**: 提供侧边栏设置界面，允许用户切换配色方案、调整列表密度、开关功能。
  - **关系**: 通过 `utils.js` 的 `getSetting`/`setSetting` 持久化配置，配置变更时触发 `main.js` 的回调。

- **color-utils.js**: 颜色科学的核心。
  - **功能**: 提供 RGB, HSL, LAB 等颜色空间之间的转换算法，用于从封面图提取颜色并生成 Material Design 调色板。
  - **关系**: 被 `main.js` 频繁调用以计算动态主题色。

### 功能增强模块
- **list-view-switcher.js**: 增强列表体验。
  - **功能**: 在播放列表等区域注入切换按钮，改变列表项的高度和布局密度。
  - **关系**: 依赖 `list-view-switcher.scss` 提供的样式类。

- **ripple.js**: Material Design 交互反馈。
  - **功能**: 监听全局点击事件，在按钮和可交互元素上生成波纹动画。
  - **关系**: 依赖 `ripple.scss` 的动画定义。

- **time-indicator.js**: 播放器增强。
  - **功能**: 允许用户点击时间区域切换显示“已播放时间”或“剩余时间”。

### 样式模块
- **styles.scss**: 视觉呈现的主体。
  - **功能**: 定义了大部分UI组件的 Material You 风格样式，包括卡片圆角、透明度、阴影等。
  - **关系**: 引用 `dynamic-theme.scss` 中的 CSS 变量。

- **_ncm-css-override.scss**: 兼容性适配。
  - **功能**: 强制覆盖网易云音乐硬编码的样式，确保主题色能正确应用到所有角落。

## 3. 核心业务逻辑位置

| 逻辑功能 | 核心文件 | 关键函数/位置 |
|---------|---------|--------------|
| **主题初始化** | `src/main.js` | `onLoad()`, `applyScheme()` |
| **动态取色** | `src/main.js` | `updateDynamicTheme()` |
| **配置持久化** | `src/utils.js` | `getSetting()`, `setSetting()` |
| **设置UI渲染** | `src/settings.js` | `MDSettings` 类 |
| **颜色算法** | `src/color-utils.js` | `rgb2Hsl()`, `hsl2Rgb()` |
| **DOM监听** | `src/main.js` | `MutationObserver` 回调 |
| **样式注入** | `src/styles.scss` | `@mixin mixed-background-color` |

## 4. 版本历史

- **v2.9.0**: 当前版本，支持 Material You 动态取色，优化了列表滚动性能。
