:: BASE_DOC ::

## API

### Radio Props

name | type | default | description | required
-- | -- | -- | -- | --
style | Object | - | CSS(Cascading Style Sheets) | N
custom-style | Object | - | CSS(Cascading Style Sheets)，used to set style on virtual component | N
allow-uncheck | Boolean | false | \- | N
block | Boolean | true | \- | N
checked | Boolean | false | \- | N
default-checked | Boolean | undefined | uncontrolled property | N
content | String / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
content-disabled | Boolean | false | \- | N
disabled | Boolean | undefined | \- | N
icon | String / Array / Slot | 'circle' | Typescript：`'circle' \| 'line' \| 'dot' \| Array<string>` | N
label | String / Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
max-content-row | Number | 5 | \- | N
max-label-row | Number | 3 | \- | N
name | String | - | \- | N
placement | String | left | options: left/right | N
readonly | Boolean | false | \- | N
value | String / Number / Boolean | false | Typescript：`T` `type RadioValue = string \| number \| boolean`。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/radio/type.ts) | N

### Radio Events

name | params | description
-- | -- | --
change | `(checked: boolean)` | \-

### Radio External Classes

className | Description
-- | --
t-class | \-
t-class-border | \-
t-class-content | \-
t-class-icon | \-
t-class-label | \-


### RadioGroup Props

name | type | default | description | required
-- | -- | -- | -- | --
style | Object | - | CSS(Cascading Style Sheets) | N
custom-style | Object | - | CSS(Cascading Style Sheets)，used to set style on virtual component | N
allow-uncheck | Boolean | false | \- | N
borderless | Boolean | false | \- | N
disabled | Boolean | undefined | \- | N
icon | String / Array | 'circle' | Typescript：`'circle' \| 'line' \| 'dot' \| Array<string>` | N
keys | Object | - | Typescript：`KeysType`。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
name | String | - | \- | N
options | Array | - | Typescript：`Array<RadioOption>` `type RadioOption = string \| number \| RadioOptionObj` `interface RadioOptionObj { label?: string; value?: string \| number; readonly?: boolean; disabled?: boolean; allowUncheck?: boolean; }`。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/radio-group/type.ts) | N
placement | String | left | options: left/right | N
value | String / Number / Boolean | - | Typescript：`T` `type RadioValue = string \| number \| boolean`。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/radio-group/type.ts) | N
default-value | String / Number / Boolean | undefined | uncontrolled property。Typescript：`T` `type RadioValue = string \| number \| boolean`。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/radio-group/type.ts) | N

### RadioGroup Events

name | params | description
-- | -- | --
change | `(value: RadioValue)` | \-

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description 
-- | -- | --
--td-radio-bg-color | @bg-color-container | - 
--td-radio-border-color | @component-stroke | - 
--td-radio-content-checked-color | @font-gray-2 | - 
--td-radio-content-color | @font-gray-2 | - 
--td-radio-content-disabled-color | @font-gray-4 | - 
--td-radio-content-font-size | 28rpx | - 
--td-radio-content-line-height | 44rpx | - 
--td-radio-font-size | 32rpx | - 
--td-radio-icon-checked-color | @brand-color | - 
--td-radio-icon-color | @component-border | - 
--td-radio-icon-disabled-bg-color | @bg-color-component-disabled | - 
--td-radio-icon-disabled-color | @brand-color-disabled | - 
--td-radio-icon-size | 48rpx | - 
--td-radio-label-checked-color | @font-gray-1 | - 
--td-radio-label-color | @font-gray-1 | - 
--td-radio-label-disabled-color | @font-gray-4 | - 
--td-radio-label-line-height | 48rpx | - 
--td-radio-vertical-padding | 32rpx | -