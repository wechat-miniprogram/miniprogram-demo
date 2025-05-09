Page({
  data: {
    theme: 'light'
  },
  onShareAppMessage() {
    return {
      title: 'open-data',
      path: 'packageComponent/pages/open/open-data/open-data'
    }
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
