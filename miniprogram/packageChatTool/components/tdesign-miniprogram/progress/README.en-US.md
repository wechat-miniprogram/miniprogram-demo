:: BASE_DOC ::

## API

### Progress Props

name | type | default | description | required
-- | -- | -- | -- | --
style | Object | - | CSS(Cascading Style Sheets) | N
custom-style | Object | - | CSS(Cascading Style Sheets)，used to set style on virtual component | N
color | String / Object / Array | '' | Typescript：`string \| Array<string> \| Record<string, string>` | N
label | String / Boolean / Slot | true | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
percentage | Number | 0 | \- | N
status | String | - | options: success/error/warning/active。Typescript：`ProgressStatus` `type ProgressStatus = 'success' \| 'error' \| 'warning' \| 'active'`。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/progress/type.ts) | N
stroke-width | String / Number | - | \- | N
theme | String | line | options: line/plump/circle。Typescript：`ProgressTheme` `type ProgressTheme = 'line' \| 'plump' \| 'circle'`。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/progress/type.ts) | N
track-color | String | '' | \- | N

### Progress External Classes

className | Description
-- | --
t-class | \-
t-class-bar | \-
t-class-label | \-

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.

Name | Default Value | Description
-- | -- | --
--td-progress-circle-inner-bg-color | @font-white-1 | -
--td-progress-circle-width | 224rpx | -
--td-progress-circle-from | 0deg | -
--td-progress-inner-bg-color | @brand-color | -
--td-progress-line-stroke-width | 12rpx | -
--td-progress-stroke-circle-width | 12rpx | -
--td-progress-stroke-plump-width | 40rpx | -
--td-progress-track-bg-color | @bg-color-component | -
--td-progress-circle-label-font-size | 40rpx | -
--td-progress-circle-label-line-height | 56rpx | -
--td-progress-circle-label-font-weight | 700 | -
