:: BASE_DOC ::

## API

### Cell Props

name | type | default | description | required
-- | -- | -- | -- | --
style | Object | - | CSS(Cascading Style Sheets) | N
custom-style | Object | - | CSS(Cascading Style Sheets)，used to set style on virtual component | N
align | String | middle | options: top/middle/bottom | N
arrow | Boolean / Object | false | \- | N
bordered | Boolean | true | \- | N
description | String / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
hover | Boolean | - | \- | N
image | String / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
jump-type | String | navigateTo | options: switchTab/reLaunch/redirectTo/navigateTo | N
left-icon | String / Object / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
note | String / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
required | Boolean | false | \- | N
right-icon | String / Object / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
title | String / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
url | String | - | \- | N

### Cell Events

name | params | description
-- | -- | --
click | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts)
### Cell External Classes

className | Description
-- | --
t-class | \-
t-class-center | \-
t-class-description | \-
t-class-hover | \-
t-class-image | \-
t-class-left | \-
t-class-left-icon | \-
t-class-note | \-
t-class-right | \-
t-class-right-icon | \-
t-class-title | \-

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description 
-- | -- | --
--td-cell-group-border-color | @border-color | - 
--td-cell-group-title-bg-color | @bg-color-secondarycontainer | - 
--td-cell-group-title-color | @font-gray-3 | - 
--td-cell-group-title-font-size | 28rpx | - 
--td-cell-group-title-line-height | 90rpx | - 
--td-cell-group-title-padding-left | 32rpx | - 
--td-cell-bg-color | @bg-color-container | - 
--td-cell-border-color | @component-stroke | - 
--td-cell-border-width | 1px | - 
--td-cell-border-left-space | @cell-horizontal-padding | - 
--td-cell-border-right-space | 0 | - 
--td-cell-description-color | @font-gray-2 | - 
--td-cell-description-font-size | @font-size-base | - 
--td-cell-description-line-height | 44rpx | - 
--td-cell-height | auto | - 
--td-cell-horizontal-padding | 32rpx | - 
--td-cell-hover-color | @bg-color-secondarycontainer | - 
--td-cell-image-height | 96rpx | - 
--td-cell-image-width | 96rpx | - 
--td-cell-left-icon-color | @brand-color | - 
--td-cell-left-icon-font-size | 48rpx | - 
--td-cell-line-height | 48rpx | - 
--td-cell-note-color | @font-gray-3 | - 
--td-cell-note-font-size | @font-size-m | - 
--td-cell-required-color | @error-color-6 | - 
--td-cell-required-font-size | @font-size-m | - 
--td-cell-right-icon-color | @font-gray-3 | - 
--td-cell-right-icon-font-size | 48rpx | - 
--td-cell-title-color | @font-gray-1 | - 
--td-cell-title-font-size | @font-size-m | - 
--td-cell-vertical-padding | 32rpx | -