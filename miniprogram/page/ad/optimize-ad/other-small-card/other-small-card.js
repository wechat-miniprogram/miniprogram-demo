// 广告调优测试-非首页小卡
Page({
  data: {
    theme: 'light'
  },

  onShareAppMessage() {
    return {
      title: '广告调优测试-非首页小卡',
      path: 'page/ad/optimize-ad/other-small-card/other-small-card'
    }
  },

  onUnload() {
    if (wx.offThemeChange) {
      wx.offThemeChange()
    }
  },

  onLoad(options) {
    this.setData({
      theme: getApp().globalData.theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        this.setData({ theme })
      })
    }
  },

  /**
   * 广告加载成功回调
   */
  onadload(e) {
    console.log('广告加载成功:', e)
  },

  /**
   * 广告加载失败回调
   */
  onaderror(e) {
    console.log('广告加载失败:', e)
  },

  /**
   * 广告视频结束回调
   */
  onvideoended(e) {
    console.log('广告视频播放结束:', e)
  }
})

