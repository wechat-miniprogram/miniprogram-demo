:: BASE_DOC ::

## API

### Navbar Props

name | type | default | description | required
-- | -- | -- | -- | --
style | Object | - | CSS(Cascading Style Sheets) | N
custom-style | Object | - | CSS(Cascading Style Sheets)，used to set style on virtual component | N
animation | Boolean | true | \- | N
capsule | Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
delta | Number | 1 | \- | N
fixed | Boolean | true | \- | N
left | Slot | - | `0.26.0`。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
left-arrow | Boolean | false | `0.26.0` | N
title | String / Slot | - | page title。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
title-max-length | Number | - | \- | N
visible | Boolean | true | \- | N

### Navbar Events

name | params | description
-- | -- | --
complete | \- | \-
fail | \- | \-
go-back | \- | \-
success | \- | \-
### Navbar External Classes

className | Description
-- | --
t-class | \-
t-class-capsule | \-
t-class-center | \-
t-class-home-icon | \-
t-class-left | \-
t-class-left-icon | \-
t-class-nav-btn | \-
t-class-title | \-

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description 
-- | -- | --
--td-navbar-bg-color | @bg-color-container | - 
--td-navbar-capsule-border-color | #e3e6ea | - 
--td-navbar-capsule-border-radius | 32rpx | - 
--td-navbar-capsule-height | 64rpx | - 
--td-navbar-capsule-width | 176rpx | - 
--td-navbar-color | @font-gray-1 | - 
--td-navbar-height | 96rpx | - 
--td-navbar-left-arrow-size | 48rpx | - 
--td-navbar-title-font-size | 36rpx | - 
--td-navbar-title-font-weight | 600 | -