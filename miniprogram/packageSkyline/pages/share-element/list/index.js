// @ts-nocheck
import { supportWorklet } from '../../../common/worklet-api'
import { cardList } from '../data'
import CustomRouteType from '../../../common/custom-route/index'
import { showTips } from '../../../common/tips'

Page({
  data: {
    cardList
  },

  onLoad() {
    if (this.renderer !== 'skyline' || !supportWorklet()) {
      showTips()
    }
  },

  go(e) {
    const { idx } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/packageSkyline/pages/share-element/card/index?idx=${idx}`,
      routeType: CustomRouteType.OpacityTransition,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '共享元素动画',
      path: 'packageSkyline/pages/share-element/list/index'
    }
  },
})
