const info = wx.getSystemInfoSync()

Page({
  onShareAppMessage() {
    return {
      title: 'ad',
      path: 'packageComponent/pages/open/ad/ad'
    }
  },

  data: {
    theme: 'light',
    platform: info.platform
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
