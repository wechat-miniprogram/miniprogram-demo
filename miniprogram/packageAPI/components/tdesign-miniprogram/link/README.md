---
title: Link 链接
description: 文字超链接用于跳转一个新页面，如当前项目跳转，友情链接等。
spline: navigation
isComponent: true
---

<div style="background: #ecf2fe; display: flex; align-items: center; line-height: 20px; padding: 14px 24px; border-radius: 3px; color: #555a65">
  <svg fill="none" viewBox="0 0 16 16" width="16px" height="16px" style="margin-right: 5px">
    <path fill="#0052d9" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7.4 4h1.2v1.2H7.4V4zm.1 2.5h1V12h-1V6.5z" fillOpacity="0.9"></path>
  </svg>
  该组件于 0.32.0 版本上线，请留意版本。
</div>

## 引入

全局引入，在 miniprogram 根目录下的`app.json`中配置，局部引入，在需要引入的页面或组件的`index.json`中配置。

```json
"usingComponents": {
  "t-link": "tdesign-miniprogram/link/link",
}
```

## 代码演示

<a href="https://developers.weixin.qq.com/s/AtJrPbmK7mSK" title="在开发者工具中预览效果" target="_blank" rel="noopener noreferrer"> 在开发者工具中预览效果 </a>

<blockquote style="background-color: #d9e1ff; font-size: 15px; line-height: 26px;margin: 16px 0 0;padding: 16px; border-radius: 6px; color: #0052d9" >
<p>Tips: 请确保开发者工具为打开状态。导入开发者工具后，依次执行：npm i > 构建npm包 > 勾选 "将JS编译成ES5"</p>
</blockquote>

### 组件类型

基础文字链接

{{ content }}

下划线文字链接

{{ underline }}

前置图标文字链接

{{ prefix }}

后置图标文字链接

{{ suffix }}

### 组件状态

不同主题

{{ theme }}

禁用状态

{{ disabled }}

### 组件样式

链接尺寸

{{ size }}

## API

### Link Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
style | Object | - | 样式 | N
custom-style | Object | - | 样式，一般用于开启虚拟化组件节点场景 | N
content | String / Slot | - | 链接内容。[通用类型定义](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
disabled | Boolean | false | 是否为禁用态 | N
hover | Boolean | - | 是否开启点击反馈 | N
navigator-props | Object | - | 与 navigator 原生组件属性保持一致，具体使用参考：[微信开放文档](https://developers.weixin.qq.com/miniprogram/dev/component/navigator.html)。使用时请将形如 `open-type` 风格的属性名改为 `openType` 风格 | N
prefix-icon | String / Object / Slot | - | 前置图标。[通用类型定义](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
size | String | medium | 尺寸。可选项：small/medium/large。TS 类型：`SizeEnum`。[通用类型定义](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
status | String | normal | 已废弃。组件状态。可选项：normal/active/disabled | N
suffix-icon | String / Object / Slot | - | 后置图标。[通用类型定义](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
theme | String | default | 组件风格，依次为默认色、品牌色、危险色、警告色、成功色。可选项：default/primary/danger/warning/success | N
underline | Boolean | - | 是否显示链接下划线 | N

### Link Events

名称 | 参数 | 描述
-- | -- | --
complete | \- | 页面链接执行完成后触发（失败或成功均会触发）
fail | \- | 页面链接跳转失败后触发
success | \- | 页面链接跳转成功后触发
### Link External Classes

类名 | 描述
-- | --
t-class | 根节点样式类
t-class-content | 内容样式类
t-class-hover | 悬停样式类
t-class-prefix-icon | 前置图标样式类
t-class-suffix-icon | 后置图标样式类

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述 
-- | -- | --
--td-link-danger-active-color | @error-color-active | - 
--td-link-danger-color | @error-color | - 
--td-link-danger-disabled-color | @error-color-disabled | - 
--td-link-default-active-color | @brand-color-active | - 
--td-link-default-color | @font-gray-1 | - 
--td-link-default-disabled-color | @text-color-disabled | - 
--td-link-primary-active-color | @brand-color-active | - 
--td-link-primary-color | @brand-color | - 
--td-link-primary-disabled-color | @brand-color-disabled | - 
--td-link-success-active-color | @success-color-active | - 
--td-link-success-color | @success-color | - 
--td-link-success-disabled-color | @success-color-disabled | - 
--td-link-warning-active-color | @warning-color-active | - 
--td-link-warning-color | @warning-color | - 
--td-link-warning-disabled-color | @warning-color-disabled | -