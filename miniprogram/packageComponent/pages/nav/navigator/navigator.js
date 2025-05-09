Page({
  data: {
    theme: 'light'
  },
  onShareAppMessage() {
    return {
      title: 'navigator',
      path: 'packageComponent/pages/nav/navigator/navigator'
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
