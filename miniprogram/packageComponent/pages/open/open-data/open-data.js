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
