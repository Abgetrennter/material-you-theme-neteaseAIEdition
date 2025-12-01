# API 与工具函数参考文档

本文档汇总了项目中的通用工具函数、颜色处理函数及核心类的接口定义。

## 1. 通用工具 (utils.js)

提供 DOM 操作和配置管理的基础功能。

### `waitForElement(selector, callback)`
等待特定的 DOM 元素出现在页面上，一旦出现即执行回调。

- **参数**:
  - `selector` (String): CSS 选择器字符串。
  - `callback` (Function): 元素找到后执行的回调函数，接收找到的元素作为参数。
- **返回值**: 无 (使用 MutationObserver 实现)。
- **示例**:
  ```javascript
  waitForElement('.m-player', (player) => {
      console.log('播放器加载完毕', player);
  });
  ```

### `getSetting(key, defaultValue)`
从 LocalStorage 获取用户配置。

- **参数**:
  - `key` (String): 配置项的键名。
  - `defaultValue` (Any): 如果未找到配置，返回的默认值。
- **返回值**: 配置值 (类型取决于存储的数据)。

### `setSetting(key, value)`
保存用户配置到 LocalStorage。

- **参数**:
  - `key` (String): 配置项的键名。
  - `value` (Any): 要保存的值。

## 2. 颜色处理工具 (color-utils.js)

提供 RGB, HSL 等颜色空间之间的转换。

### `rgb2Hsl(r, g, b)`
将 RGB 颜色值转换为 HSL 对象。

- **参数**:
  - `r`, `g`, `b` (Number): 0-255 之间的整数。
- **返回值**: 
  ```javascript
  { h: Number, s: Number, l: Number } // h: 0-360, s: 0-1, l: 0-1
  ```

### `hsl2Rgb(h, s, l)`
将 HSL 颜色值转换为 RGB 数组。

- **参数**:
  - `h` (Number): 色相 (0-360)。
  - `s` (Number): 饱和度 (0-1)。
  - `l` (Number): 亮度 (0-1)。
- **返回值**: `[r, g, b]` (数组，元素为 0-255 的整数)。

### `argb2Rgb(argb)`
将 Android 格式的 ARGB 整数转换为 RGB 数组。

- **参数**:
  - `argb` (Number): 32位整数。
- **返回值**: `[r, g, b]`。

## 3. 核心类定义

### `MDSettings` (src/settings.js)
React 组件类，管理设置界面的渲染和逻辑。

#### 方法
- **`render()`**: 渲染设置面板的 JSX 结构。
- **`updateSetting(key, value)`**: 内部方法，用于更新组件状态并调用 `setSetting` 保存配置。
- **`resetSettings()`**: 将所有设置重置为默认值。

### `ListViewSwitcher` (src/list-view-switcher.js)
管理列表视图密度的切换逻辑。

#### 接口
- **`init()`**: 初始化切换器，注入 DOM。
- **`switchMode(mode)`**: 切换到指定模式 (`compact`, `comfortable`, `spacious`)。

### `TimeIndicator` (src/time-indicator.js)
管理播放时间显示逻辑。

#### 接口
- **`toggleMode()`**: 在“已播放时间”和“剩余时间”模式间切换。
- **`update(currentTime, totalTime)`**: 更新显示的时间数值。
