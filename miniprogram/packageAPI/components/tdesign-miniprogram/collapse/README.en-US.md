:: BASE_DOC ::

## API

### Collapse Props

name | type | default | description | required
-- | -- | -- | -- | --
style | Object | - | CSS(Cascading Style Sheets) | N
custom-style | Object | - | CSS(Cascading Style Sheets)，used to set style on virtual component | N
default-expand-all | Boolean | false | \- | N
disabled | Boolean | - | \- | N
expand-icon | Boolean | true | \- | N
expand-mutex | Boolean | false | \- | N
theme | String | default | options: default/card | N
value | Array | [] | Typescript：`CollapseValue` `type CollapseValue = Array<string \| number>`。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/collapse/type.ts) | N
default-value | Array | undefined | uncontrolled property。Typescript：`CollapseValue` `type CollapseValue = Array<string \| number>`。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/collapse/type.ts) | N

### Collapse Events

name | params | description
-- | -- | --
change | `(value: CollapseValue)` | \-


### CollapsePanel Props

name | type | default | description | required
-- | -- | -- | -- | --
style | Object | - | CSS(Cascading Style Sheets) | N
custom-style | Object | - | CSS(Cascading Style Sheets)，used to set style on virtual component | N
content | String / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
disabled | Boolean | undefined | \- | N
expand-icon | Boolean / Slot | undefined | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
header | String / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
header-left-icon | String / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
header-right-content | String / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
placement | String | bottom | `0.34.0`。options: bottom/top | N
value | String / Number | - | \- | N
### CollapsePanel External Classes

className | Description
-- | --
t-class | \-
t-class-content | \-
t-class-header | \-

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description 
-- | -- | --
--td-collapse-border-color | @border-level-1-color | - 
--td-collapse-content-font-size | @font-size-base | - 
--td-collapse-content-line-height | 1.5 | - 
--td-collapse-content-padding | 32rpx | - 
--td-collapse-content-text-color | @text-color-primary | - 
--td-collapse-extra-font-size | @font-size-m | - 
--td-collapse-header-height | auto | - 
--td-collapse-header-text-color | @text-color-primary | - 
--td-collapse-header-text-disabled-color | @text-color-disabled | - 
--td-collapse-horizontal-padding | 32rpx | - 
--td-collapse-icon-color | @font-gray-3 | - 
--td-collapse-panel-bg-color | @bg-color-container | - 
--td-collapse-title-font-size | @font-size-m | - 
