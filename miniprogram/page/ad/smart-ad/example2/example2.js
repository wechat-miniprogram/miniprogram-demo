Page({
  onShareAppMessage() {
    return {
      title: '示例 2 - 广告投放流程',
      path: 'page/ad/smart-ad/example2/example2'
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

