
## API

### Search Props

name | type | default | description | required
-- | -- | -- | -- | --
style | Object | - | CSS(Cascading Style Sheets) | N
custom-style | Object | - | CSS(Cascading Style Sheets)，used to set style on virtual component | N
action | String / Slot | '' | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
adjust-position | Boolean | true | \- | N
always-embed | Boolean | false | \- | N
center | Boolean | false | \- | N
clearable | Boolean | true | \- | N
confirm-hold | Boolean | false | \- | N
confirm-type | String | search | options: send/search/next/go/done | N
cursor | Number | - | required | Y
cursor-spacing | Number | 0 | \- | N
disabled | Boolean | false | \- | N
focus | Boolean | false | \- | N
hold-keyboard | Boolean | false | \- | N
label | String | '' | `deprecated` | N
left-icon | String / Slot | 'search' | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
maxcharacter | Number | - | \- | N
maxlength | Number | -1 | \- | N
placeholder | String | '' | \- | N
placeholder-class | String | input-placeholder | \- | N
placeholder-style | String | - | required | Y
result-list | Array | [] | Typescript：`Array<string>` | N
right-icon | String / Slot | 'close-circle-filled' | `deprecated`。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
selection-end | Number | -1 | \- | N
selection-start | Number | -1 | \- | N
shape | String | 'square' | options: square/round | N
type | String | 'text' | options: text/number/idcard/digit/nickname | N
value | String | '' | \- | N

### Search Events

name | params | description
-- | -- | --
action-click | `({})` | \-
blur | `({ value: string })` | \-
change | `({ value: string })` | \-
clear | `({ value: string })` | \-
focus | `({ value: string })` | \-
submit | `({ value: string })` | \-
### Search External Classes

className | Description
-- | --
t-class | \-
t-class-action | \-
t-class-clear | \-
t-class-input | \-
t-class-input-container | \-
t-class-left | \-

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description 
-- | -- | --
--td-search-action-color | @brand-color | - 
--td-search-bg-color | @bg-color-secondarycontainer | - 
--td-search-clear-icon-color | @font-gray-3 | - 
--td-search-font-size | @font-size-m | - 
--td-search-height | 80rpx | - 
--td-search-icon-color | @font-gray-3 | - 
--td-search-label-color | @font-gray-1 | - 
--td-search-padding | 16rpx 24rpx | - 
--td-search-placeholder-color | @font-gray-3 | - 
--td-search-square-radius | @radius-default | - 
--td-search-text-color | @font-gray-1 | -