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
