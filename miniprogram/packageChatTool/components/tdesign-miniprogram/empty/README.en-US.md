:: BASE_DOC ::

## API

### Empty Props

name | type | default | description | required
-- | -- | -- | -- | --
style | Object | - | CSS(Cascading Style Sheets) | N
custom-style | Object | - | CSS(Cascading Style Sheets)，used to set style on virtual component | N
action | Slot | - | action block。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
description | String / Slot | - | empty component description。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
icon | String / Object | - | \- | N
image | String / Slot | - | image url, or Image component props, or custom any node you need.。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
### Empty External Classes

className | Description
-- | --
t-class | \-
t-class-description | \-
t-class-image | \-

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description 
-- | -- | --
--td-empty-action-margin-top | @spacer-4 | - 
--td-empty-description-color | @font-gray-3 | - 
--td-empty-description-font-size | @font-size-base | - 
--td-empty-description-line-height | 44rpx | - 
--td-empty-description-margin-top | @spacer-2 | - 
--td-empty-icon-color | @font-gray-3 | -