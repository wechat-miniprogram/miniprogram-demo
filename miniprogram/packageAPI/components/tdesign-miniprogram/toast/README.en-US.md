:: BASE_DOC ::

## API

### Toast Props

name | type | default | description | required
-- | -- | -- | -- | --
style | Object | - | CSS(Cascading Style Sheets) | N
custom-style | Object | - | CSS(Cascading Style Sheets)，used to set style on virtual component | N
direction | String | row | options: row/column | N
duration | Number | 2000 | \- | N
icon | String / Object / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
message | String / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
overlay-props | Object | - | Typescript：`OverlayProps `，[Overlay API Documents](./overlay?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/toast/type.ts) | N
placement | String | middle | options:  top/middle/bottom | N
prevent-scroll-through | Boolean | false | \- | N
show-overlay | Boolean | false | \- | N
theme | String | - | options: loading/success/error | N
using-custom-navbar | Boolean | false | \- | N

### Toast Events

name | params | description
-- | -- | --
close | \- | \-
destroy | \- | \-
### Toast External Classes

className | Description
-- | --
t-class | \-

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description 
-- | -- | --
--td-toast-bg-color | @font-gray-2 | - 
--td-toast-color | @font-white-1 | - 
--td-toast-column-icon-size | 64rpx | - 
--td-toast-max-width | 374rpx | - 
--td-toast-radius | 8rpx | - 
--td-toast-row-icon-size | 48rpx | -