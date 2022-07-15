Page({
  data: {
    theme: 'light'
  },
  onShareAppMessage() {
    return {
      title: 'icon',
      path: 'packageComponent/pages/content/icon/icon'
    }
  },
  onUnload() {
    if (wx.offThemeChange) {
      wx.offThemeChange()
    }
  },
  onLoad() {
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
