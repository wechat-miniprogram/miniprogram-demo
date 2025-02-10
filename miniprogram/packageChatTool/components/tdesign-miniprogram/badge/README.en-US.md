:: BASE_DOC ::

## API

### Badge Props

name | type | default | description | required
-- | -- | -- | -- | --
style | Object | - | CSS(Cascading Style Sheets) | N
custom-style | Object | - | CSS(Cascading Style Sheets)，used to set style on virtual component | N
color | String | - | \- | N
content | String | - | \- | N
count | String / Number / Slot | 0 | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
dot | Boolean | false | \- | N
max-count | Number | 99 | \- | N
offset | Array | - | Typescript：`Array<string \| number>` | N
shape | String | circle | options: circle/square/bubble/ribbon | N
show-zero | Boolean | false | \- | N
size | String | medium | options: medium/large | N
### Badge External Classes

className | Description
-- | --
t-class | \-
t-class-content | \-
t-class-count | \-

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description 
-- | -- | --
--td-badge-basic-height | 32rpx | - 
--td-badge-basic-padding | 8rpx | - 
--td-badge-basic-width | 32rpx | - 
--td-badge-bg-color | @error-color | - 
--td-badge-border-radius | 4rpx | - 
--td-badge-bubble-border-radius | 20rpx 20rpx 20rpx 1px | - 
--td-badge-dot-size | 16rpx | - 
--td-badge-font-size | @font-size-xs | - 
--td-badge-font-weight | 600 | - 
--td-badge-large-font-size | @font-size-s | - 
--td-badge-large-height | 40rpx | - 
--td-badge-large-padding | 10rpx | - 
--td-badge-text-color | @font-white-1 | -