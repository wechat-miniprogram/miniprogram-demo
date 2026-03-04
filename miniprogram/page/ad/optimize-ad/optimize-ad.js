Page({
  onShareAppMessage() {
    return {
      title: '广告调优',
      path: 'page/ad/optimize-ad/optimize-ad'
    }
  },

  data: {
    theme: 'light'
  },

  onUnload() {
    if (wx.offThemeChange) {
      wx.offThemeChange()
    }
  },

  onLoad() {
    this.setData({
      theme: getApp().globalData.theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        this.setData({ theme })
      })
    }
  }
})

