# Material You Theme for Netease Cloud Music - 技术文档

欢迎阅读 Material You 主题的技术文档。本文档旨在帮助开发者理解项目结构、核心逻辑及样式系统，以便进行二次开发或维护。

## 文档目录

### 1. [项目结构 (Project Structure)](./ProjectStructure.md)
- 项目目录树状图
- 模块功能说明 (main.js, settings.js, styles.scss 等)
- 核心业务逻辑位置索引
- 版本历史

### 2. [核心业务逻辑 (Core Logic)](./CoreLogic.md)
- 主题应用流程 (`applyScheme`)
- 动态取色机制 (`updateDynamicTheme`)
- 设置管理与持久化
- DOM 监听与动态注入策略
- 列表视图切换逻辑

### 3. [API 与工具函数参考 (API Reference)](./API_Reference.md)
- 通用工具函数 (`utils.js`)
- 颜色处理算法 (`color-utils.js`)
- 核心类接口说明 (`MDSettings`, `ListViewSwitcher`, `TimeIndicator`)

### 4. [样式系统 (Styles)](./Styles.md)
- SCSS 架构与文件组织
- 核心 Mixin (`mixed-background-color`)
- 动态主题变量 (`--md-accent-color`)
- 网易云音乐原生样式覆盖策略

## 快速开始

### 开发环境
- 建议使用 VS Code 进行开发。
- 安装 `Sass` 编译器以处理 `.scss` 文件。

### 构建与调试
由于本项目是直接注入网易云音乐客户端的插件，通常不需要复杂的构建过程。
1. 修改 `src/` 目录下的 `.js` 或 `.scss` 文件。
2. 编译 `.scss` 为 `styles.css` (如果使用了 SCSS)。
3. 重启网易云音乐客户端或刷新插件以应用更改。

## 贡献指南
- 保持代码风格一致，使用 2 空格缩进。
- 新增功能请确保在 `settings.js` 中添加相应的开关（如果需要）。
- 修改样式时，优先使用 CSS 变量以支持动态主题。
