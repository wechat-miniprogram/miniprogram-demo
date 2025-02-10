:: BASE_DOC ::

## API

### Loading Props

name | type | default | description | required
-- | -- | -- | -- | --
style | Object | - | CSS(Cascading Style Sheets) | N
custom-style | Object | - | CSS(Cascading Style Sheets)，used to set style on virtual component | N
delay | Number | 0 | \- | N
duration | Number | 800 | \- | N
fullscreen | Boolean | false | `1.8.5` | N
indicator | Boolean / Slot | true | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
inherit-color | Boolean | false | \- | N
layout | String | horizontal | options: horizontal/vertical | N
loading | Boolean | true | \- | N
pause | Boolean | false | \- | N
progress | Number | - | \- | N
reverse | Boolean | - | \- | N
size | String | '20px' | \- | N
text | String / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
theme | String | circular | options: circular/spinner/dots | N

### Loading External Classes

className | Description
-- | --
t-class | \-
t-class-indicator | \-
t-class-text | \-

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description 
-- | -- | --
--td-loading-color | @brand-color | - 
--td-loading-text-color | inherit | - 
--td-loading-text-font-size | 24rpx | - 
--td-loading-text-line-height | 40rpx | -