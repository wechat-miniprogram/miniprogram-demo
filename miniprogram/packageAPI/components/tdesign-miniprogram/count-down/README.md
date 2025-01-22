---
title: CountDown 倒计时
description: 用于实时展示倒计时数值。
spline: data
isComponent: true
---

<span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20lines-99%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20functions-100%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20statements-99%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20branches-85%25-blue" /></span>

> CountDown 组件用于实时展示倒计时数值。
如果需要与站点演示一致的数字字体效果，推荐您到 <a href="https://tdesign.tencent.com/design/fonts">数字字体章节</a>，将 TCloudNumber 字体下载并将包含的 TCloudNumberVF.ttf 做为 TCloudNumber 字体资源引入到具体项目中使用。

## 引入

全局引入，在 miniprogram 根目录下的`app.json`中配置，局部引入，在需要引入的页面或组件的`index.json`中配置。

```json
"usingComponents": {
  "t-count-down": "tdesign-miniprogram/count-down/count-down"
}
```

## 代码演示

<a href="https://developers.weixin.qq.com/s/C37tsims79Sk" title="在开发者工具中预览效果" target="_blank" rel="noopener noreferrer"> 在开发者工具中预览效果 </a>

<blockquote style="background-color: #d9e1ff; font-size: 15px; line-height: 26px;margin: 16px 0 0;padding: 16px; border-radius: 6px; color: #0052d9" >
<p>Tips: 请确保开发者工具为打开状态。导入开发者工具后，依次执行：npm i > 构建npm包 > 勾选 "将JS编译成ES5"</p>
</blockquote>

### 基础倒计时

{{ base }}

### 调整尺寸

{{ size }}

## API

### CountDown Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
style | Object | - | 样式 | N
custom-style | Object | - | 样式，一般用于开启虚拟化组件节点场景 | N
auto-start | Boolean | true | 是否自动开始倒计时 | N
content | String / Slot | 'default' | 最终倒计时的展示内容，值为'default'时使用默认的格式，否则使用自定义样式插槽。[通用类型定义](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
format | String | HH:mm:ss | 时间格式，DD-日，HH-时，mm-分，ss-秒，SSS-毫秒 | N
millisecond | Boolean | false | 是否开启毫秒级渲染 | N
size | String | 'medium' | `0.5.1`。倒计时尺寸。可选项：small/medium/large | N
split-with-unit | Boolean | false | `0.5.1`。使用时间单位分割 | N
theme | String | 'default' | `0.5.1`。倒计时风格。可选项：default/round/square | N
time | Number | 0 | 必需。倒计时时长，单位毫秒 | Y

### CountDown Events

名称 | 参数 | 描述
-- | -- | --
change | `(time: TimeData)` | 时间变化时触发。[详细类型定义](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/count-down/type.ts)。<br/>`interface TimeData {  days: number; hours: number; minutes: number; seconds: number; milliseconds: number }`<br/>
finish | \- | 倒计时结束时触发
### CountDown External Classes

类名 | 描述
-- | --
t-class | 根节点样式类
t-class-count | 计数样式类
t-class-split | 分隔线样式类

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述 
-- | -- | --
--td-countdown-bg-color | @error-color-6 | - 
--td-countdown-default-color | @font-gray-1 | - 
--td-countdown-round-border-radius | @radius-circle | - 
--td-countdown-round-color | @font-white-1 | - 
--td-countdown-square-border-radius | @radius-small | -