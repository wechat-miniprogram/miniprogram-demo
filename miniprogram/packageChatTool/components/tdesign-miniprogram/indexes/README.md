---
title: Indexes 索引
description: 用于页面中信息快速检索，可以根据目录中的页码快速找到所需的内容。
spline: navigation
isComponent: true
---

<span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20lines-88%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20functions-87%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20statements-85%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20branches-65%25-red" /></span>

<div style="background: #ecf2fe; display: flex; align-items: center; line-height: 20px; padding: 14px 24px; border-radius: 3px; color: #555a65">
  <svg fill="none" viewBox="0 0 16 16" width="16px" height="16px" style="margin-right: 5px">
    <path fill="#0052d9" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7.4 4h1.2v1.2H7.4V4zm.1 2.5h1V12h-1V6.5z" fillOpacity="0.9"></path>
  </svg>
  IndexesAnchor 索引锚点组件于 0.32.0 版本上线，请留意版本。
</div>


## 引入

全局引入，在 miniprogram 根目录下的`app.json`中配置，局部引入，在需要引入的页面或组件的`index.json`中配置。

```json
"usingComponents": {
  "t-indexes": "tdesign-miniprogram/indexes/indexes",
  "t-indexes-anchor": "tdesign-miniprogram/indexes-anchor/indexes-anchor"
}
```

## 代码演示

<a href="https://developers.weixin.qq.com/s/BH9tQimJ7mSj" title="在开发者工具中预览效果" target="_blank" rel="noopener noreferrer"> 在开发者工具中预览效果 </a>

<blockquote style="background-color: #d9e1ff; font-size: 15px; line-height: 26px;margin: 16px 0 0;padding: 16px; border-radius: 6px; color: #0052d9" >
<p>Tips: 请确保开发者工具为打开状态。导入开发者工具后，依次执行：npm i > 构建npm包 > 勾选 "将JS编译成ES5"</p>
</blockquote>

### 基础索引


{{ base }}

### 自定义索引

{{ custom }}

### API

### Indexes Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
style | Object | - | 样式 | N
custom-style | Object | - | 样式，一般用于开启虚拟化组件节点场景 | N
index-list | Array | - | `0.32.0`。索引字符列表。不传默认 `A-Z`。TS 类型：`string [] \| number[]` | N
list | Array | [] | 已废弃。索引列表的列表数据。每个元素包含三个子元素，index(string)：索引值，例如1，2，3，...或A，B，C等；title(string): 索引标题，可不填将默认设为索引值；children(Array<{title: string}>): 子元素列表，title为子元素的展示文案。TS 类型：`ListItem[] ` `interface ListItem { title: string;  index: string;  children: { title: string; [key: string]: any} [] }`。[详细类型定义](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/indexes/type.ts) | N
sticky | Boolean | true | 索引是否吸顶，默认为true。TS 类型：`Boolean` | N
sticky-offset | Number | 0 | `1.0.0`。锚点吸顶时与顶部的距离	 | N

### Indexes Events

名称 | 参数 | 描述
-- | -- | --
change | `(index: string \| number)` | `0.34.0`。索引发生变更时触发事件
select | `(index: string \| number)` | 点击侧边栏时触发事件


### IndexesAnchor Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
style | Object | - | 样式 | N
custom-style | Object | - | 样式，一般用于开启虚拟化组件节点场景 | N
index | String / Number | - | 索引字符 | N
### IndexesAnchor External Classes

类名 | 描述
-- | --
t-class | 根节点样式类
t-class-sidebar | 侧边栏样式类
t-class-sidebar-item | 侧边栏选项样式类

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述 
-- | -- | --
--td-indexes-sidebar-active-bg-color | @brand-color | - 
--td-indexes-sidebar-active-color | @font-white-1 | - 
--td-indexes-sidebar-color | @font-gray-1 | - 
--td-indexes-sidebar-font-size | 24rpx | - 
--td-indexes-sidebar-item-size | 40rpx | - 
--td-indexes-sidebar-line-height | 40rpx | - 
--td-indexes-sidebar-right | 16rpx | - 
--td-indexes-sidebar-tips-bg-color | @brand-color-light | - 
--td-indexes-sidebar-tips-color | @brand-color | - 
--td-indexes-sidebar-tips-font-size | 40rpx | - 
--td-indexes-sidebar-tips-right | calc(100% + 32rpx) | - 
--td-indexes-sidebar-tips-size | 96rpx | - 
--td-indexes-anchor-active-bg-color | @bg-color-container | - 
--td-indexes-anchor-active-color | @brand-color | - 
--td-indexes-anchor-active-font-weight | 600 | - 
--td-indexes-anchor-bg-color | @bg-color-secondarycontainer | - 
--td-indexes-anchor-color | @font-gray-1 | - 
--td-indexes-anchor-font-size | 28rpx | - 
--td-indexes-anchor-line-height | 44rpx | -