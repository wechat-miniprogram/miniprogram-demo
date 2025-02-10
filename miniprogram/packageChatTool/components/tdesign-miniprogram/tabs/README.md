---
title: Tabs 选项卡
description: 用于内容分类后的展示切换。
spline: navigation
isComponent: true
---

<span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20lines-93%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20functions-88%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20statements-90%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20branches-80%25-blue" /></span>
## 引入

全局引入，在 miniprogram 根目录下的`app.json`中配置，局部引入，在需要引入的页面或组件的`index.json`中配置。

```json
"usingComponents": {
  "t-tabs": "tdesign-miniprogram/tabs/tabs",
  "t-tab-panel": "tdesign-miniprogram/tab-panel/tab-panel"
}
```

## 代码演示

<a href="https://developers.weixin.qq.com/s/YR98fimt7MSV" title="在开发者工具中预览效果" target="_blank" rel="noopener noreferrer"> 在开发者工具中预览效果 </a>

<blockquote style="background-color: #d9e1ff; font-size: 15px; line-height: 26px;margin: 16px 0 0;padding: 16px; border-radius: 6px; color: #0052d9" >
<p>Tips: 请确保开发者工具为打开状态。导入开发者工具后，依次执行：npm i > 构建npm包 > 勾选 "将JS编译成ES5"</p>
</blockquote>

### 基础选项卡

{{ base }}

### 等距选项卡

{{ scroll }}

### 带图标选项卡

{{ with-icon }}

### 带徽章选项卡

{{ with-badge }}

### 带内容区选项卡

{{ with-content }}

### 选项卡状态

{{ status }}

### 选项卡尺寸

{{ size }}

### 选项卡样式

使用 theme 属性可以变换风格，支持 line = 线条（默认）；tag = 标签；card = 卡片

{{ theme }}

<!-- 横向选项卡支持超过屏幕滑动 -->

<img src="https://tdesign.gtimg.com/miniprogram/readme/tabs-3.png" width="375px" height="50%">


### 受控用法

```html
<t-tabs value="{{value}}" bind:change="onTabsChange">
  <t-tab-panel label="标签页一" value="0">标签一内容</t-tab-panel>
  <t-tab-panel label="标签页二" value="1">标签二内容</t-tab-panel>
</t-tabs>
```

```js
Page({
  data: {
    value: '0',
  },
  onTabsChange(e) {
    this.setData({ value: e.detail.value })
  },
});
```

### 与 Popup 使用

```html
 <t-popup visible="{{visible}}" bind:visible-change="onVisibleChange">
  <t-tabs id="tabs" defaultValue="{{0}}" bind:change="onTabsChange" bind:click="onTabsClick" t-class="custom-tabs">
    <t-tab-panel label="标签页一" value="0">标签一内容</t-tab-panel>
    <t-tab-panel label="标签页二" value="1">标签二内容</t-tab-panel>
    <t-tab-panel label="标签页三" value="2">标签三内容</t-tab-panel>
  </t-tabs>
</t-popup>
```

```js
Page({
  data: {
    visible: false
  },
  showPopup() {
    this.setData({
      visible: true
    }, () => {
      const tabs = this.selectComponent('tabs');

      tabs.setTrack(); // 这一步很重要，因为小程序的无法正确执行生命周期，所以需要手动设置下 tabs 的滑块
    })
  }
})
```

## API

### Tabs Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
style | Object | - | 样式 | N
custom-style | Object | - | 样式，一般用于开启虚拟化组件节点场景 | N
animation | Object | - | 动画效果设置。其中 duration 表示动画时长。（单位：秒）。TS 类型：`TabAnimation` `type TabAnimation = { duration: number } & Record<string, any>`。[详细类型定义](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/tabs/type.ts) | N
middle | Slot | - | 中间内容，介于头部和内容之间。[通用类型定义](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
show-bottom-line | Boolean | true | 是否展示底部激活线条 | N
space-evenly | Boolean | true | 选项卡头部空间是否均分 | N
split | Boolean | true | `1.1.10`。是否展示分割线 | N
sticky | Boolean | false | 是否开启粘性布局 | N
sticky-props | Object | - | 透传至 Sticky 组件。TS 类型：`StickyProps`，[Sticky API Documents](./sticky?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/tabs/type.ts) | N
swipeable | Boolean | true | 是否可以滑动切换 | N
theme | String | line | 标签的样式。可选项：line/tag/card | N
value | String / Number | - | 激活的选项卡值。TS 类型：`TabValue` `type TabValue = string \| number`。[详细类型定义](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/tabs/type.ts) | N
default-value | String / Number | undefined | 激活的选项卡值。非受控属性。TS 类型：`TabValue` `type TabValue = string \| number`。[详细类型定义](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/tabs/type.ts) | N

### Tabs Events

名称 | 参数 | 描述
-- | -- | --
change | `(value: TabValue, label: string)` | 激活的选项卡发生变化时触发
click | `(value: TabValue, label: string)` | 点击选项卡时触发
scroll | `(scrollTop: number, isFixed: boolean)` | 页面滚动时触发
### Tabs External Classes

类名 | 描述
-- | --
t-class | 根节点样式类
t-class-active | 激活态样式类
t-class-content | 内容样式类
t-class-item | 选项样式类
t-class-track | 滚动条样式类


### TabPanel Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
style | Object | - | 样式 | N
custom-style | Object | - | 样式，一般用于开启虚拟化组件节点场景 | N
badge-props | Object | - | 透传至 Badge 组件 | N
disabled | Boolean | false | 是否禁用当前选项卡 | N
icon | String / Object | - | `1.0.0-rc.1`。图标，传对象则透传至 Icon | N
label | String | - | 选项卡名称 | N
panel | String / Slot | - | 用于自定义选项卡面板内容。[通用类型定义](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
value | String / Number | - | 选项卡的值，唯一标识。TS 类型：`TabValue`，[Tabs API Documents](./tabs?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/tab-panel/type.ts) | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述 
-- | -- | --
--td-tab-border-color | @component-stroke | - 
--td-tab-font-size | 28rpx | - 
--td-tab-icon-size | 36rpx | - 
--td-tab-item-active-color | @brand-color | - 
--td-tab-item-color | @font-gray-1 | - 
--td-tab-item-disabled-color | @font-gray-4 | - 
--td-tab-item-height | 96rpx | - 
--td-tab-item-tag-active-bg | @brand-color-light | - 
--td-tab-item-tag-bg | @bg-color-secondarycontainer | - 
--td-tab-item-tag-height | 64rpx | - 
--td-tab-item-vertical-height | 108rpx | - 
--td-tab-item-vertical-width | 208rpx | - 
--td-tab-nav-bg-color | @bg-color-container | - 
--td-tab-track-color | @brand-color | - 
--td-tab-track-radius | 8rpx | - 
--td-tab-track-thickness | 6rpx | - 
--td-tab-track-width | 32rpx | -
