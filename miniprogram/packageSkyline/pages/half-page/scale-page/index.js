import { showTips } from '../../../common/tips'
import { worklet, supportWorklet } from '../../../common/worklet-api'

Page({
  data: {},
  onLoad: function onLoad() {
    if (this.renderer !== 'skyline' || !supportWorklet()) {
      showTips()
    }
  },
  jump: function jump() {
    wx.navigateTo({
      routeType: 'HalfScreenDialog',
      url: '/packageSkyline/pages/half-page/half-page/index'
    })
  },
  back: function back() {
    wx.navigateBack()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '自定义路由',
      path: 'packageSkyline/pages/half-page/scale-page/index'
    }
  },
})
