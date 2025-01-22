:: BASE_DOC ::

## API

### Link Props

name | type | default | description | required
-- | -- | -- | -- | --
style | Object | - | CSS(Cascading Style Sheets) | N
custom-style | Object | - | CSS(Cascading Style Sheets)，used to set style on virtual component | N
content | String / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
disabled | Boolean | false | make link to be disabled | N
hover | Boolean | - | \- | N
navigator-props | Object | - | \- | N
prefix-icon | String / Object / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
size | String | medium | options: small/medium/large。Typescript：`SizeEnum`。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
status | String | normal | `deprecated`。options: normal/active/disabled | N
suffix-icon | String / Object / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
theme | String | default | options: default/primary/danger/warning/success | N
underline | Boolean | - | \- | N

### Link Events

name | params | description
-- | -- | --
complete | \- | \-
fail | \- | \-
success | \- | \-
### Link External Classes

className | Description
-- | --
t-class | class name of root node
t-class-content | \-
t-class-hover | \-
t-class-prefix-icon | \-
t-class-suffix-icon | \-

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description 
-- | -- | --
--td-link-danger-active-color | @error-color-active | - 
--td-link-danger-color | @error-color | - 
--td-link-danger-disabled-color | @error-color-disabled | - 
--td-link-default-active-color | @brand-color-active | - 
--td-link-default-color | @font-gray-1 | - 
--td-link-default-disabled-color | @text-color-disabled | - 
--td-link-primary-active-color | @brand-color-active | - 
--td-link-primary-color | @brand-color | - 
--td-link-primary-disabled-color | @brand-color-disabled | - 
--td-link-success-active-color | @success-color-active | - 
--td-link-success-color | @success-color | - 
--td-link-success-disabled-color | @success-color-disabled | - 
--td-link-warning-active-color | @warning-color-active | - 
--td-link-warning-color | @warning-color | - 
--td-link-warning-disabled-color | @warning-color-disabled | -