Page({
  onShareAppMessage() {
    return {
      title: '智能广告',
      path: 'page/ad/smart-ad/smart-ad'
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
