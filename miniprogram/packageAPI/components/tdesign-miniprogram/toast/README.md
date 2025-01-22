---
title: Toast 轻提示
description: 用于轻量级反馈或提示，不会打断用户操作。
spline: message
isComponent: true
---

<span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20lines-100%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20functions-100%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20statements-100%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20branches-83%25-blue" /></span>
## 引入

全局引入，在 miniprogram 根目录下的`app.json`中配置，局部引入，在需要引入的页面或组件的`index.json`中配置。

```json
"usingComponents": {
  "t-toast": "tdesign-miniprogram/toast/toast"
}
```

## 代码演示

<a href="https://developers.weixin.qq.com/s/l0azMimf7CSu" title="在开发者工具中预览效果" target="_blank" rel="noopener noreferrer"> 在开发者工具中预览效果 </a>

<blockquote style="background-color: #d9e1ff; font-size: 15px; line-height: 26px;margin: 16px 0 0;padding: 16px; border-radius: 6px; color: #0052d9" >
<p>Tips: 请确保开发者工具为打开状态。导入开发者工具后，依次执行：npm i > 构建npm包 > 勾选 "将JS编译成ES5"</p>
</blockquote>

### 基础提示

{{ base }}

### 组件状态

{{ theme }}

### 显示遮罩
{{ cover }}

### 手动关闭
{{ close }}
## API

### Toast Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
style | Object | - | 样式 | N
custom-style | Object | - | 样式，一般用于开启虚拟化组件节点场景 | N
direction | String | row | 图标排列方式。可选项：row/column | N
duration | Number | 2000 | 弹窗显示毫秒数 | N
icon | String / Object / Slot | - | 自定义图标。传入对象则透传至 Icon 组件。[通用类型定义](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
message | String / Slot | - | 弹窗显示文字。[通用类型定义](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
overlay-props | Object | - | 遮罩层属性，透传至 Overlay。TS 类型：`OverlayProps `，[Overlay API Documents](./overlay?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/toast/type.ts) | N
placement | String | middle | 弹窗展示位置。可选项： top/middle/bottom | N
prevent-scroll-through | Boolean | false | 防止滚动穿透，即不允许点击和滚动 | N
show-overlay | Boolean | false | 是否显示遮罩层 | N
theme | String | - | 提示类型。可选项：loading/success/error | N
using-custom-navbar | Boolean | false | 是否使用了自定义导航栏 | N

### Toast Events

名称 | 参数 | 描述
-- | -- | --
close | \- | 轻提示隐藏的时候触发
destroy | \- | 轻提示销毁的时候触发
### Toast External Classes

类名 | 描述
-- | --
t-class | 根节点样式类

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述 
-- | -- | --
--td-toast-bg-color | @font-gray-2 | - 
--td-toast-color | @font-white-1 | - 
--td-toast-column-icon-size | 64rpx | - 
--td-toast-max-width | 374rpx | - 
--td-toast-radius | 8rpx | - 
--td-toast-row-icon-size | 48rpx | -