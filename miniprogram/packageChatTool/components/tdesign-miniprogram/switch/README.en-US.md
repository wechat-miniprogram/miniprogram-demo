:: BASE_DOC ::

## API

### Switch Props

name | type | default | description | required
-- | -- | -- | -- | --
style | Object | - | CSS(Cascading Style Sheets) | N
custom-style | Object | - | CSS(Cascading Style Sheets)，used to set style on virtual component | N
custom-value | Array | [true, false] | Typescript：`Array<SwitchValue>` | N
disabled | Boolean | undefined | \- | N
icon | Array | [] | `0.27.0`。Typescript：`string[]` | N
label | Array | [] | `0.27.0`。Typescript：`string[]` | N
loading | Boolean | false | `0.27.0` | N
size | String | medium | `0.27.0`。options: small/medium/large | N
value | String / Number / Boolean | null | Typescript：`SwitchValue` `type SwitchValue = string \| number \| boolean`。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/switch/type.ts) | N
default-value | String / Number / Boolean | undefined | uncontrolled property。Typescript：`SwitchValue` `type SwitchValue = string \| number \| boolean`。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/switch/type.ts) | N

### Switch Events

name | params | description
-- | -- | --
change | `(value: SwitchValue)` | \-

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description 
-- | -- | --
--td-switch-checked-color | @brand-color | - 
--td-switch-checked-disabled-color | @brand-color-disabled | - 
--td-switch-dot-border-color | @bg-color-secondarycontainer | - 
--td-switch-dot-horizontal-margin | 6rpx | - 
--td-switch-dot-large-size | 52rpx | - 
--td-switch-dot-plain-horizontal-margin | 10rpx | - 
--td-switch-dot-plain-large-size | 44rpx | - 
--td-switch-dot-plain-size | 36rpx | - 
--td-switch-dot-plain-small-size | 28rpx | - 
--td-switch-dot-shadow | @shadow-1 | - 
--td-switch-dot-size | 44rpx | - 
--td-switch-dot-small-size | 36rpx | - 
--td-switch-height | 56rpx | - 
--td-switch-icon-large-size | 48rpx | - 
--td-switch-icon-size | 40rpx | - 
--td-switch-icon-small-size | 32rpx | - 
--td-switch-label-checked-color | @switch-checked-color | - 
--td-switch-label-color | @font-gray-4 | - 
--td-switch-label-font-size | 28rpx | - 
--td-switch-label-large-font-size | 32rpx | - 
--td-switch-label-small-font-size | 24rpx | - 
--td-switch-large-height | 64rpx | - 
--td-switch-large-radius | calc(@switch-large-height / 2) | - 
--td-switch-large-width | 104rpx | - 
--td-switch-radius | calc(@switch-height / 2) | - 
--td-switch-small-height | 48rpx | - 
--td-switch-small-radius | calc(@switch-small-height / 2) | - 
--td-switch-small-width | 78rpx | - 
--td-switch-unchecked-color | @font-gray-4 | - 
--td-switch-unchecked-disabled-color | @bg-color-component-disabled | - 
--td-switch-width | 90rpx | -