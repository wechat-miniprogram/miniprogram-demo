---
title: Slider 滑动选择器
description: 用于选择横轴上的数值、区间、档位。
spline: data
isComponent: true
---

<span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20lines-95%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20functions-100%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20statements-94%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20branches-82%25-blue" /></span>
## 引入

全局引入，在 miniprogram 根目录下的`app.json`中配置，局部引入，在需要引入的页面或组件的`index.json`中配置。

```json
"usingComponents": {
  "t-slider": "tdesign-miniprogram/slider/slider"
}
```

## 代码演示

<img src="https://tdesign.gtimg.com/miniprogram/readme/slider.png" width="375px" height="50%">

<a href="https://developers.weixin.qq.com/s/2p6gkime7CSn" title="在开发者工具中预览效果" target="_blank" rel="noopener noreferrer"> 在开发者工具中预览效果 </a>

<blockquote style="background-color: #d9e1ff; font-size: 15px; line-height: 26px;margin: 16px 0 0;padding: 16px; border-radius: 6px; color: #0052d9" >
<p>Tips: 请确保开发者工具为打开状态。导入开发者工具后，依次执行：npm i > 构建npm包 > 勾选 "将JS编译成ES5"</p>
</blockquote>

### 组件类型

单游标滑块

{{ base }}

双游标滑块

{{ range }}

带数值滑动选择器

{{ label }}

带刻度滑动选择器

{{ step }}

### 组件状态

滑块禁用状态

{{ disabled }}

#### 特殊样式

胶囊型滑块

{{ capsule }}

#### 垂直状态

垂直方向的滑块

{{ vertical }}


## API


### Slider Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
style | Object | - | 样式 | N
custom-style | Object | - | 样式，一般用于开启虚拟化组件节点场景 | N
colors | Array | [] | 已废弃。颜色，[已选择, 未选择]。TS 类型：`Array<string>` | N
disabled | Boolean | undefined | 是否禁用组件 | N
disabled-color | Array | [] | 已废弃。禁用状态滑动条的颜色，[已选, 未选]。TS 类型：`Array<string>` | N
label | String / Boolean | false | 滑块当前值文本。<br />值为 true 显示默认文案；值为 false 不显示滑块当前值文本；<br />值为 `${value}%` 则表示组件会根据占位符渲染文案；<br />值类型为函数时，参数 `value` 标识滑块值，参数 `position=start` 表示范围滑块的起始值，参数 `position=end` 表示范围滑块的终点值。TS 类型：`string \| boolean` | N
marks | Object / Array | {} | 刻度标记，示例：`[0, 10, 40, 200]` 或者 `{ 5:  '5¥', 10: '10%' }`。TS 类型：`Record<number, string> \| Array<number>` | N
max | Number | 100 | 滑块范围最大值 | N
min | Number | 0 | 滑块范围最小值 | N
range | Boolean | false | 双游标滑块 | N
show-extreme-value | Boolean | false | 是否边界值 | N
step | Number | 1 | 步长 | N
theme | String | default | `0.30.0`。滑块风格。可选项：default/capsule | N
value | Number / Array | 0 | 滑块值。TS 类型：`SliderValue` `type SliderValue = number \| Array<number>`。[详细类型定义](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/slider/type.ts) | N
default-value | Number / Array | undefined | 滑块值。非受控属性。TS 类型：`SliderValue` `type SliderValue = number \| Array<number>`。[详细类型定义](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/slider/type.ts) | N
vertical | Boolean | false | 是否是垂直的滑块（渲染垂直滑块时，默认高度为400rpx，可通过修改`--td-slider-bar-height`来自定义高度） | N

### Slider Events

名称 | 参数 | 描述
-- | -- | --
change | `(value: SliderValue)` | 滑块值变化时触发
dragend | `(value: SliderValue, e: TouchEvent)` | 结束拖动时触发
dragstart | `(e: TouchEvent)` | 开始拖动时触发
### Slider External Classes

类名 | 描述
-- | --
t-class | 根节点样式类
t-class-bar | 滑道底部样式类
t-class-bar-active | 滑道激活态样式类
t-class-bar-disabled | 滑道禁用态样式类
t-class-cursor | 游标样式类

## FAQ

当 slider 外层使用 `hidden` 包裹，需要在 `hidden = false` 时，重新调用组件的 `init` 方法，才能正常渲染（在t-popup/t-dialog中同理）。如下：

```html
<t-slider id="slider" />
```

```js
const $slider = this.selectComponent('#slider');

$slider.init();
```

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述 
-- | -- | --
--td-slider-active-color | @brand-color | - 
--td-slider-bar-height | 8rpx | vertical为true时默认为400rpx 
--td-slider-bar-width | 8rpx | vertical为true时有效 
--td-slider-capsule-bar-color | @bg-color-component | - 
--td-slider-capsule-bar-heihgt | 48rpx | - 
--td-slider-capsule-bar-width | 48rpx | vertical为true时有效 
--td-slider-capsule-line-heihgt | 36rpx | - 
--td-slider-default-color | @bg-color-component | - 
--td-slider-default-color | @bg-color-component-disabled | - 
--td-slider-disabled-color | @brand-color-disabled | - 
--td-slider-disabled-text-color | @text-color-disabled | - 
--td-slider-dot-bg-color | #fff | - 
--td-slider-dot-color | @component-border | - 
--td-slider-dot-disabled-bg-color | #fff | - 
--td-slider-dot-disabled-border-color | #f3f3f3 | - 
--td-slider-dot-size | 40rpx | - 
--td-slider-text-color | @text-color-primary | - 
