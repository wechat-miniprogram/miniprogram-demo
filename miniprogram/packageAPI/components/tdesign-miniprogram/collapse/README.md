---
title: Collapse 折叠面板
description: 用于对复杂区域进行分组和隐藏 常用于订单信息展示等
spline: data
isComponent: true
---

<span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20lines-100%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20functions-100%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20statements-99%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20branches-87%25-blue" /></span>

<div style="background: #ecf2fe; display: flex; align-items: center; line-height: 20px; padding: 14px 24px; border-radius: 3px; color: #555a65">
  <svg fill="none" viewBox="0 0 16 16" width="16px" height="16px" style="margin-right: 5px">
    <path fill="#0052d9" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7.4 4h1.2v1.2H7.4V4zm.1 2.5h1V12h-1V6.5z" fillOpacity="0.9"></path>
  </svg>
  该组件于 0.7.3 版本上线，请留意版本。
</div>

## 引入

全局引入，在 miniprogram 根目录下的`app.json`中配置，局部引入，在需要引入的页面或组件的`index.json`中配置。

```json
"usingComponents": {
  "t-collapse": "tdesign-miniprogram/collapse/collapse",
  "t-collapse-panel": "tdesign-miniprogram/collapse-panel/collapse-panel"
}
```

## 代码演示

<a href="https://developers.weixin.qq.com/s/P67sAimx75Sy" title="在开发者工具中预览效果" target="_blank" rel="noopener noreferrer"> 在开发者工具中预览效果 </a>

<blockquote style="background-color: #d9e1ff; font-size: 15px; line-height: 26px;margin: 16px 0 0;padding: 16px; border-radius: 6px; color: #0052d9" >
<p>Tips: 请确保开发者工具为打开状态。导入开发者工具后，依次执行：npm i > 构建npm包 > 勾选 "将JS编译成ES5"</p>
</blockquote>

### 类型

基础折叠面板

{{ base }}


带操作说明

{{ action }}

手风琴模式

{{ accordion }}

### 样式

卡片折叠面板

{{ theme }}

## API

### Collapse Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
style | Object | - | 样式 | N
custom-style | Object | - | 样式，一般用于开启虚拟化组件节点场景 | N
default-expand-all | Boolean | false | 默认是否展开全部 | N
disabled | Boolean | - | 是否禁用面板展开/收起操作 | N
expand-icon | Boolean | true | 展开图标 | N
expand-mutex | Boolean | false | 每个面板互斥展开，每次只展开一个面板 | N
theme | String | default | 折叠面板风格。可选项：default/card | N
value | Array | [] | 展开的面板集合。TS 类型：`CollapseValue` `type CollapseValue = Array<string \| number>`。[详细类型定义](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/collapse/type.ts) | N
default-value | Array | undefined | 展开的面板集合。非受控属性。TS 类型：`CollapseValue` `type CollapseValue = Array<string \| number>`。[详细类型定义](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/collapse/type.ts) | N

### Collapse Events

名称 | 参数 | 描述
-- | -- | --
change | `(value: CollapseValue)` | 切换面板时触发，返回变化的值


### CollapsePanel Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
style | Object | - | 样式 | N
custom-style | Object | - | 样式，一般用于开启虚拟化组件节点场景 | N
content | String / Slot | - | 折叠面板内容。[通用类型定义](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
disabled | Boolean | undefined | 禁止当前面板展开，优先级大于 Collapse 的同名属性 | N
expand-icon | Boolean / Slot | undefined | 当前折叠面板展开图标，优先级大于 Collapse 的同名属性。[通用类型定义](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
header | String / Slot | - | 面板头内容。[通用类型定义](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
header-left-icon | String / Slot | - | 面板头左侧图标。[通用类型定义](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
header-right-content | String / Slot | - | 面板头的右侧区域，一般用于呈现面板操作。[通用类型定义](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
placement | String | bottom | `0.34.0`。选项卡内容的位置。可选项：bottom/top | N
value | String / Number | - | 当前面板唯一标识，如果值为空则取当前面下标兜底作为唯一标识 | N
### CollapsePanel External Classes

类名 | 描述
-- | --
t-class | 根节点样式类
t-class-content | 内容样式类
t-class-header | 头部样式类

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述 
-- | -- | --
--td-collapse-border-color | @border-level-1-color | - 
--td-collapse-content-font-size | @font-size-base | - 
--td-collapse-content-line-height | 1.5 | - 
--td-collapse-content-padding | 32rpx | - 
--td-collapse-content-text-color | @text-color-primary | - 
--td-collapse-extra-font-size | @font-size-m | - 
--td-collapse-header-height | auto | - 
--td-collapse-header-text-color | @text-color-primary | - 
--td-collapse-header-text-disabled-color | @text-color-disabled | - 
--td-collapse-horizontal-padding | 32rpx | - 
--td-collapse-icon-color | @font-gray-3 | - 
--td-collapse-panel-bg-color | @bg-color-container | - 
--td-collapse-title-font-size | @font-size-m | - 
