
const wxml = (url) => `<view class="container">
  <image class="img" mode="aspectFit" src="${url}"></image>
  <text class="title">
    微信开放社区简介（视频）
  </text>
  <text class="desc">
    微信开放社区，是一个为使用者提供交流、服务的平台。
  </text>
</view>
`

const style = {

  img: {
    width: 200,
    height: 120,
  },
  container: {
    height: 200,
    width: 200,
    flexDirection: 'column'
  },
  title: {
    height: 20,
    width: 200,
    color: '#15c15f',
    margin: 4,

  },
  desc: {
    fontSize: 13,
    height: 40,
    width: 200,
    color: '#4c4c4c',
    margin: 4,
  }
}

module.exports = {
  wxml,
  style
}
