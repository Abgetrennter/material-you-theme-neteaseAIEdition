# 核心业务逻辑文档

本文档详细解析了 Material You 主题的核心业务流程，包括主题应用、动态取色机制、设置管理及 DOM 监听策略。

## 1. 主题应用流程 (Theme Application)

主题的核心在于 `applyScheme` 函数，它负责将计算好的颜色变量应用到全局 CSS 变量中。

### 逻辑流程
1. **接收参数**: 接收一个 `scheme` 对象，包含主色 (`primary`)、背景色 (`background`) 等信息。
2. **计算衍生色**: 使用 `color-utils.js` 中的工具函数，根据主色计算出不同透明度、不同亮度的衍生颜色（如 `accent-color-bg`, `accent-color-secondary`）。
3. **设置 CSS 变量**: 通过 `document.documentElement.style.setProperty` 将这些颜色值写入 CSS 变量。
4. **处理深浅模式**: 根据当前系统或用户设置的深浅模式，调整文字颜色和背景对比度。

### 代码位置
- **文件**: `src/main.js`
- **函数**: `applyScheme(scheme)`

```javascript
// 示例逻辑（伪代码）
function applyScheme(scheme) {
    const primaryRgb = hexToRgb(scheme.primary);
    document.documentElement.style.setProperty('--md-accent-color', scheme.primary);
    document.documentElement.style.setProperty('--md-accent-color-rgb', primaryRgb.join(','));
    
    // 计算背景色变体
    const bgDarken = darken(scheme.primary, 0.2);
    document.documentElement.style.setProperty('--md-accent-color-bg-darken', bgDarken);
}
```

## 2. 动态取色机制 (Dynamic Theme Generation)

本主题的特色功能是能够根据当前播放的歌曲封面自动生成配色方案。

### 逻辑流程
1. **触发时机**: 监听播放器歌曲变化事件或封面图片加载完成事件。
2. **提取颜色**: 
   - 获取封面图片的 DOM 元素。
   - 使用 Canvas 读取图片像素或调用 API 获取图片主色调。
3. **生成配色**: 
   - 将提取的颜色 (RGB) 转换为 HSL 空间。
   - 调整饱和度和亮度，确保颜色符合 Material You 的可读性标准（避免过暗或过亮）。
   - 生成一套完整的配色方案 (`Scheme`)。
4. **应用**: 调用 `applyScheme` 应用新配色。

### 代码位置
- **文件**: `src/main.js`
- **函数**: `updateDynamicTheme()`

## 3. 设置管理 (Settings Management)

使用 React 构建的设置面板，通过 LocalStorage 实现配置持久化。

### 逻辑流程
1. **UI 渲染**: `MDSettings` 类负责渲染设置侧边栏，包含开关、滑动条和单选框。
2. **状态同步**: 组件加载时，通过 `utils.js` 的 `getSetting` 读取本地配置初始化状态。
3. **变更响应**: 
   - 用户修改设置（如开启“动态主题”）。
   - 调用 `setSetting` 保存配置。
   - 触发回调函数，实时更新 UI（如立即切换到新主题）。

### 代码位置
- **文件**: `src/settings.js`
- **类**: `MDSettings`

## 4. DOM 监听策略 (DOM Observation)

由于网易云音乐是单页应用 (SPA)，页面内容会动态加载，因此需要持续监听 DOM 变化以注入样式或修复布局。

### 逻辑流程
1. **初始化**: 在 `onLoad` 中创建一个 `MutationObserver`。
2. **监听范围**: 监听 `document.body` 的子节点变化 (`childList`, `subtree`)。
3. **过滤与处理**: 
   - 当检测到特定元素（如弹窗、新加载的列表）出现时，添加标记类名（如 `md-loaded`）。
   - 对新元素执行必要的 JS 初始化（如为新按钮添加波纹效果监听）。
4. **性能优化**: 使用 `debounce` 或特定选择器检查，避免在频繁 DOM 变动时造成卡顿。

### 代码位置
- **文件**: `src/main.js`
- **机制**: `MutationObserver`

## 5. 列表视图切换 (List View Switcher)

允许用户在“紧凑”、“舒适”和“宽敞”三种列表密度间切换。

### 逻辑流程
1. **注入按钮**: 在播放列表头部注入切换按钮。
2. **状态切换**: 点击按钮循环切换状态 (`compact` -> `comfortable` -> `spacious`)。
3. **样式应用**: 
   - 修改容器的 CSS 类名或 CSS 变量（如 `--item-height`）。
   - `styles.scss` 中根据不同变量值调整列表项的高度和内边距。

### 代码位置
- **文件**: `src/list-view-switcher.js`
- **文件**: `src/styles.scss` (相关样式)
