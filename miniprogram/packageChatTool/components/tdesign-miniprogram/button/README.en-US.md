---
title: Button
description: Buttons are used to open a closed-loop task, such as "delete" an object, "buy" an item, etc.
spline: base
isComponent: true
---

<span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20lines-100%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20functions-100%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20statements-100%25-blue" /></span><span class="coverages-badge" style="margin-right: 10px"><img src="https://img.shields.io/badge/coverages%3A%20branches-83%25-blue" /></span>


## Usage

For global import, configure it in `app.json` in the root directory of the miniprogram. For local import, configure it in `index.json` of the page or component that needs to be imported.

```json
"usingComponents": {
  "t-button": "tdesign-miniprogram/button/button"
}
```


## Code Demo

### 01 Component Type

#### Basic Buttons

{{ base }}

#### Icon Button

{{ icon-btn }}

#### Ghost Button

{{ ghost-btn }}

#### Combination Button

{{ group-btn }}

#### Banner Button

{{ block-btn }}

### 02 Component State

#### Buttons for different states

{{ disabled }}

### 03 Component Style

#### Different sizes of buttons

{{ size }}

#### Different shaped buttons

{{ shape }}

#### Different color theme buttons

{{ theme }}



## API

### Button Props

name | type | default | description | required
-- | -- | -- | -- | --
style | Object | - | CSS(Cascading Style Sheets) | N
custom-style | Object | - | CSS(Cascading Style Sheets)，used to set style on virtual component | N
app-parameter | String | - | \- | N
block | Boolean | false | make button to be a block-level element | N
content | String / Slot | - | button's children elements。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
custom-dataset | any | - | \- | N
disabled | Boolean | undefined | disable the button, make it can not be clicked | N
ghost | Boolean | false | make background-color to be transparent | N
hover-class | String | - | \- | N
hover-start-time | Number | 20 | \- | N
hover-stay-time | Number | 70 | \- | N
hover-stop-propagation | Boolean | false | \- | N
icon | String / Object | - | icon name | N
lang | String | - | message language。options: en/zh_CN/zh_TW | N
loading | Boolean | false | set button to be loading state | N
loading-props | Object | - | Typescript：`LoadingProps`，[Loading API Documents](./loading?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-miniprogram/tree/develop/src/button/type.ts) | N
open-type | String | - | open type of button, [Miniprogram Button](https://developers.weixin.qq.com/miniprogram/dev/component/button.html)。options: contact/share/getPhoneNumber/getUserInfo/launchApp/openSetting/feedback/chooseAvatar/agreePrivacyAuthorization | N
phone-number-no-quota-toast | Boolean | true | \- | N
send-message-img | String | 截图 | \- | N
send-message-path | String | 当前分享路径 | \- | N
send-message-title | String | 当前标题 | \- | N
session-from | String | - | \- | N
shape | String | rectangle | button shape。options: rectangle/square/round/circle | N
show-message-card | Boolean | false | \- | N
size | String | medium | a button has four size。options: extra-small/small/medium/large | N
suffix | Slot | - | [see more ts definition](https://github.com/Tencent/tdesign-miniprogram/blob/develop/src/common/common.ts) | N
t-id | String | - | id | N
theme | String | default | button theme。options: default/primary/danger/light | N
type | String | - | type of button element, same as formType of Miniprogram。options: submit/reset | N
variant | String | base | variant of button。options: base/outline/dashed/text | N

### Button Events

name | params | description
-- | -- | --
agreeprivacyauthorization | \- | \-
chooseavatar | \- | \-
contact | \- | \-
createliveactivity | \- | \-
error | \- | \-
getphonenumber | \- | \-
getrealtimephonenumber | \- | \-
getuserinfo | \- | \-
launchapp | \- | \-
opensetting | \- | \-
tap | `event` | \-

### Button External Classes

className | Description
-- | --
t-class | \-
t-class-icon | class name of icon
t-class-loading | class name of loading

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description 
-- | -- | --
--td-button-border-radius | @radius-default | - 
--td-button-border-width | 4rpx | - 
--td-button-danger-active-bg-color | @error-color-active | - 
--td-button-danger-active-border-color | @error-color-active | - 
--td-button-danger-bg-color | @error-color | - 
--td-button-danger-border-color | @error-color | - 
--td-button-danger-color | @text-color-anti | - 
--td-button-danger-dashed-border-color | @button-danger-dashed-color | - 
--td-button-danger-dashed-color | @error-color | - 
--td-button-danger-dashed-disabled-color | @button-danger-disabled-color | - 
--td-button-danger-disabled-bg | @error-color-3 | - 
--td-button-danger-disabled-border-color | @error-color-3 | - 
--td-button-danger-disabled-color | @font-white-1 | - 
--td-button-danger-outline-active-bg-color | @bg-color-container-active | - 
--td-button-danger-outline-active-border-color | @error-color-active | - 
--td-button-danger-outline-border-color | @button-danger-outline-color | - 
--td-button-danger-outline-color | @error-color | - 
--td-button-danger-outline-disabled-color | @error-color-3 | - 
--td-button-danger-text-active-bg-color | @bg-color-container-active | - 
--td-button-danger-text-color | @error-color | - 
--td-button-danger-text-disabled-color | @button-danger-disabled-color | - 
--td-button-default-active-bg-color | @bg-color-component-active | - 
--td-button-default-active-border-color | @bg-color-component-active | - 
--td-button-default-bg-color | @bg-color-component | - 
--td-button-default-border-color | @bg-color-component | - 
--td-button-default-color | @text-color-primary | - 
--td-button-default-disabled-bg | @bg-color-component-disabled | - 
--td-button-default-disabled-border-color | @bg-color-component-disabled | - 
--td-button-default-disabled-color | @text-color-disabled | - 
--td-button-default-outline-active-bg-color | @bg-color-container-active | - 
--td-button-default-outline-active-border-color | @component-border | - 
--td-button-default-outline-border-color | @component-border | - 
--td-button-default-outline-color | @text-color-primary | - 
--td-button-default-outline-disabled-color | @component-border | - 
--td-button-default-text-active-bg-color | @bg-color-container-active | - 
--td-button-extra-small-font-size | @font-size-base | - 
--td-button-extra-small-height | 56rpx | - 
--td-button-extra-small-icon-font-size | 36rpx | - 
--td-button-extra-small-padding-horizontal | 16rpx | - 
--td-button-font-weight | 600 | - 
--td-button-ghost-border-color | @button-ghost-color | - 
--td-button-ghost-color | @text-color-anti | - 
--td-button-ghost-danger-border-color | @error-color | - 
--td-button-ghost-danger-color | @error-color | - 
--td-button-ghost-danger-hover-color | @error-color-active | - 
--td-button-ghost-disabled-color | @font-white-4 | - 
--td-button-ghost-hover-color | @font-white-2 | - 
--td-button-ghost-primary-border-color | @brand-color | - 
--td-button-ghost-primary-color | @brand-color | - 
--td-button-ghost-primary-hover-color | @brand-color-active | - 
--td-button-icon-border-radius | 8rpx | - 
--td-button-icon-spacer | @spacer | - 
--td-button-large-font-size | @font-size-m | - 
--td-button-large-height | 96rpx | - 
--td-button-large-icon-font-size | 48rpx | - 
--td-button-large-padding-horizontal | 40rpx | - 
--td-button-light-active-bg-color | @brand-color-light-active | - 
--td-button-light-active-border-color | @brand-color-light-active | - 
--td-button-light-bg-color | @brand-color-light | - 
--td-button-light-border-color | @brand-color-light | - 
--td-button-light-color | @brand-color | - 
--td-button-light-disabled-bg | @brand-color-light | - 
--td-button-light-disabled-border-color | @brand-color-light | - 
--td-button-light-disabled-color | @brand-color-disabled | - 
--td-button-light-outline-active-bg-color | @brand-color-light-active | - 
--td-button-light-outline-active-border-color | @brand-color-active | - 
--td-button-light-outline-bg-color | @brand-color-light | - 
--td-button-light-outline-border-color | @button-light-outline-color | - 
--td-button-light-outline-color | @brand-color | - 
--td-button-light-outline-disabled-color | @brand-color-disabled | - 
--td-button-light-text-active-bg-color | @bg-color-container-active | - 
--td-button-light-text-color | @brand-color | - 
--td-button-medium-font-size | @font-size-m | - 
--td-button-medium-height | 80rpx | - 
--td-button-medium-icon-font-size | 40rpx | - 
--td-button-medium-padding-horizontal | 32rpx | - 
--td-button-primary-active-bg-color | @brand-color-active | - 
--td-button-primary-active-border-color | @brand-color-active | - 
--td-button-primary-bg-color | @brand-color | - 
--td-button-primary-border-color | @brand-color | - 
--td-button-primary-color | @text-color-anti | - 
--td-button-primary-dashed-border-color | @button-primary-dashed-color | - 
--td-button-primary-dashed-color | @brand-color | - 
--td-button-primary-dashed-disabled-color | @brand-color-disabled | - 
--td-button-primary-disabled-bg | @brand-color-disabled | - 
--td-button-primary-disabled-border-color | @brand-color-disabled | - 
--td-button-primary-disabled-color | @text-color-anti | - 
--td-button-primary-outline-active-bg-color | @bg-color-container-active | - 
--td-button-primary-outline-active-border-color | @brand-color-active | - 
--td-button-primary-outline-border-color | @button-primary-outline-color | - 
--td-button-primary-outline-color | @brand-color | - 
--td-button-primary-outline-disabled-color | @brand-color-disabled | - 
--td-button-primary-text-active-bg-color | @bg-color-container-active | - 
--td-button-primary-text-color | @brand-color | - 
--td-button-primary-text-disabled-color | @brand-color-disabled | - 
--td-button-small-font-size | @font-size-base | - 
--td-button-small-height | 64rpx | - 
--td-button-small-icon-font-size | 36rpx | - 
--td-button-small-padding-horizontal | 24rpx | - 
