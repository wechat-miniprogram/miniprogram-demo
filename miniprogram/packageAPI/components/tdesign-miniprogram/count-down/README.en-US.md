:: BASE_DOC ::

## API

### CountDown Props

name | type | default | description | required
-- | -- | -- | -- | --
style | Object | - | CSS(Cascading Style Sheets) | N
custom-style | Object | - | CSS(Cascading Style Sheets)，used to set style on virtual component | N
auto-start | Boolean | true | \- | N
content | String / Slot | 'default' | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
format | String | HH:mm:ss | \- | N
millisecond | Boolean | false | \- | N
size | String | 'medium' | `0.5.1`。options: small/medium/large | N
split-with-unit | Boolean | false | `0.5.1` | N
theme | String | 'default' | `0.5.1`。options: default/round/square | N
time | Number | 0 | required | Y

### CountDown Events

name | params | description
-- | -- | --
change | `(time: TimeData)` | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/count-down/type.ts)。<br/>`interface TimeData {  days: number; hours: number; minutes: number; seconds: number; milliseconds: number }`<br/>
finish | \- | \-
### CountDown External Classes

className | Description
-- | --
t-class | \-
t-class-count | \-
t-class-split | \-

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description 
-- | -- | --
--td-countdown-bg-color | @error-color-6 | - 
--td-countdown-default-color | @font-gray-1 | - 
--td-countdown-round-border-radius | @radius-circle | - 
--td-countdown-round-color | @font-white-1 | - 
--td-countdown-square-border-radius | @radius-small | -