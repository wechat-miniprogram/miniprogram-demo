Page({
  data: {
    theme: 'light'
  },
  onShareAppMessage() {
    return {
      title: 'navigatePage',
      path: 'packageComponent/pages/nav/navigator/navigate'
    }
  },
  onUnload() {
    if (wx.offThemeChange) {
      wx.offThemeChange()
    }
  },
  onLoad(options) {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({theme}) => {
        this.setData({theme})
      })
    }
  }
})
