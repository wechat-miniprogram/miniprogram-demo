:: BASE_DOC ::

## API

### Divider Props

name | type | default | description | required
-- | -- | -- | -- | --
style | Object | - | CSS(Cascading Style Sheets) | N
custom-style | Object | - | CSS(Cascading Style Sheets)，used to set style on virtual component | N
align | String | center | options: left/right/center | N
content | String / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
dashed | Boolean | false | \- | N
layout | String | horizontal | options: horizontal/vertical | N
### Divider External Classes

className | Description
-- | --
t-class | \-
t-class-content | \-

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description 
-- | -- | --
--td-divider-color | @bg-color-component | - 
--td-divider-content-color | @font-gray-3 | - 
--td-divider-content-font-size | 24rpx | - 
--td-divider-content-line-height | 40rpx | - 
--td-divider-content-line-style | solid | -