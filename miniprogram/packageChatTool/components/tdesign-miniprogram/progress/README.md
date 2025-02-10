---
title: Progress 进度条
description: 用于展示任务当前的进度。
spline: message
isComponent: true
---

<span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20lines-100%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20functions-100%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20statements-100%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20branches-88%25-blue" /></span>

<div style="background: #ecf2fe; display: flex; align-items: center; line-height: 20px; padding: 14px 24px; border-radius: 3px; color: #555a65">
  <svg fill="none" viewBox="0 0 16 16" width="16px" height="16px" style="margin-right: 5px">
    <path fill="#0052d9" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7.4 4h1.2v1.2H7.4V4zm.1 2.5h1V12h-1V6.5z" fillOpacity="0.9"></path>
  </svg>
  该组件于 0.7.3 版本上线，请留意版本。
</div>

## 引入

### 引入组件

在 `app.json` 或 `page.json` 中引入组件：

```json
"usingComponents": {
  "t-progress": "tdesign-miniprogram/progress/progress"
}
```

## 代码演示

<a href="https://developers.weixin.qq.com/s/qua7YimQ7tSx" title="在开发者工具中预览效果" target="_blank" rel="noopener noreferrer"> 在开发者工具中预览效果 </a>

<blockquote style="background-color: #d9e1ff; font-size: 15px; line-height: 26px;margin: 16px 0 0;padding: 16px; border-radius: 6px; color: #0052d9" >
<p>Tips: 请确保开发者工具为打开状态。导入开发者工具后，依次执行：npm i > 构建npm包 > 勾选 "将JS编译成ES5"</p>
</blockquote>

### 01 组件类型

基础进度条

{{ base }}

过渡样式

{{ transition }}

自定义颜色/圆角

{{ custom }}

### 02 组件状态

线性进度条

{{ line }}

百分比内显进度条

{{ plump }}

环形进度条

{{ circle }}

## API

### Progress Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
style | Object | - | 样式 | N
custom-style | Object | - | 样式，一般用于开启虚拟化组件节点场景 | N
color | String / Object / Array | '' | 进度条颜色。示例：'#ED7B2F' 或 'orange' 或 `['#f00', '#0ff', '#f0f']` 或 `{ '0%': '#f00', '100%': '#0ff' }` 或  `{ from: '#000', to: '#000' }` 等。TS 类型：`string \| Array<string> \| Record<string, string>` | N
label | String / Boolean / Slot | true | 进度百分比，可自定义。[通用类型定义](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
percentage | Number | 0 | 进度条百分比 | N
status | String | - | 进度条状态。可选项：success/error/warning/active。TS 类型：`ProgressStatus` `type ProgressStatus = 'success' \| 'error' \| 'warning' \| 'active'`。[详细类型定义](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/progress/type.ts) | N
stroke-width | String / Number | - | 进度条线宽，默认单位 `px` | N
theme | String | line | 进度条风格。值为 line，标签（label）显示在进度条右侧；值为 plump，标签（label）显示在进度条里面；值为 circle，标签（label）显示在进度条正中间。可选项：line/plump/circle。TS 类型：`ProgressTheme` `type ProgressTheme = 'line' \| 'plump' \| 'circle'`。[详细类型定义](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/progress/type.ts) | N
track-color | String | '' | 进度条未完成部分颜色 | N

### Progress External Classes

类名 | 描述
-- | --
t-class | 根节点样式类
t-class-bar | 进度文字样式类
t-class-label | 标签样式类

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。

名称 | 默认值 | 描述
-- | -- | --
--td-progress-circle-inner-bg-color | @font-white-1 | -
--td-progress-circle-width | 224rpx | -
--td-progress-circle-from | 0deg | -
--td-progress-inner-bg-color | @brand-color | -
--td-progress-line-stroke-width | 12rpx | -
--td-progress-stroke-circle-width | 12rpx | -
--td-progress-stroke-plump-width | 40rpx | -
--td-progress-track-bg-color | @bg-color-component | -
--td-progress-circle-label-font-size | 40rpx | -
--td-progress-circle-label-line-height | 56rpx | -
--td-progress-circle-label-font-weight | 700 | -
