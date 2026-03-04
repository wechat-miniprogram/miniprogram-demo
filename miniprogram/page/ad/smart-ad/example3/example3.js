Page({
  onShareAppMessage() {
    return {
      title: '示例 3 - 数据概览',
      path: 'page/ad/smart-ad/example3/example3'
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

