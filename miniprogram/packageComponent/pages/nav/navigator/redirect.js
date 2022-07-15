Page({
  data: {
    theme: 'light'
  },
  onShareAppMessage() {
    return {
      title: 'redirectPage',
      path: 'packageComponent/pages/nav/navigator/redirect'
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
    console.log(options)
    this.setData({
      title: options.title
    })
  }
})
