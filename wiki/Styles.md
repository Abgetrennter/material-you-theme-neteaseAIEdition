# 样式系统文档

本文档详细说明了 SCSS 样式架构、核心 Mixin、主题变量定义及原生样式覆盖策略。

## 1. 样式架构 (Architecture)

项目使用 SCSS 进行模块化开发，最终编译为单一的 CSS 文件注入页面。

- **`styles.scss`**: 聚合文件，包含全局重置、核心组件样式及工具类引用。
- **`dynamic-theme.scss`**: 定义与动态主题相关的 CSS 变量。
- **`_ncm-css-override.scss`**: 包含大量 `!important` 规则，用于强制覆盖网易云音乐的遗留样式。
- **组件样式**: `settings.scss`, `ripple.scss` 等独立文件负责特定功能模块的样式。

## 2. 核心 Mixin

为了保持样式一致性，项目定义了多个 Mixin 用于处理背景色混合和阴影。

### `mixed-background-color`
用于生成带有透明度和混合模式的背景色，模拟 Material Design 的 Surface 效果。

```scss
@mixin mixed-background-color($bgcolor-rgb, $fgcolor-rgb, $transparency) {
    background: linear-gradient(0deg, rgba($fgcolor-rgb, $transparency), rgba($fgcolor-rgb, $transparency)), rgba($bgcolor-rgb, 1);
}
```

- **参数**:
  - `$bgcolor-rgb`: 背景基色（通常是主题背景色）。
  - `$fgcolor-rgb`: 前景混合色（通常是主题强调色）。
  - `$transparency`: 透明度/混合强度。

## 3. 主题变量 (Theme Variables)

主题通过 CSS 自定义属性 (CSS Variables) 实现动态切换。这些变量主要在 `dynamic-theme.scss` 和 `main.js` 中定义。

### 基础变量
| 变量名 | 说明 | 示例值 |
|-------|------|-------|
| `--md-accent-color` | 主题强调色 (Hex) | `#ff0000` |
| `--md-accent-color-rgb` | 主题强调色 (RGB) | `255, 0, 0` |
| `--md-accent-color-bg` | 背景色 | `#ffffff` |
| `--md-accent-color-secondary` | 次要文本颜色 | `#666666` |

### 动态适配变量
根据深浅模式自动切换的变量：
```scss
body.md-dynamic-theme-light {
    --md-accent-color: var(--md-dynamic-light-primary);
}
body.md-dynamic-theme-dark {
    --md-accent-color: var(--md-dynamic-dark-primary);
}
```

## 4. 关键组件样式策略

### 播放列表 (Playlist)
使用 Grid 布局和 Flexbox 实现响应式列表项。
- **Mask Icon**: 使用 `webkit-mask-image` 将 SVG 图标着色为主题色，解决传统 `background-image` 难以动态改色的问题。
- **Hover Effect**: 悬停时应用半透明的主题色叠加层。

### 设置面板 (Settings Panel)
- 固定定位 (`position: fixed`) 的侧边栏。
- 使用 `backdrop-filter: blur()` 实现毛玻璃效果（视性能配置开启/关闭）。

### 兼容性处理 (Overrides)
针对网易云音乐原生组件（如评论区、搜索结果页），通过 `_ncm-css-override.scss` 进行深度定制：
- 重置圆角 (`border-radius`).
- 移除原生背景图和边框。
- 强制应用 Material Design 的阴影 (`box-shadow`).

```scss
// 示例：覆盖原生进度条样式
.u-probar .pro {
    background: rgba(var(--md-accent-color-rgb), .8) !important;
}
```
