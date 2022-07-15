Page({
  onShareAppMessage() {
    return {
      title: '用户截屏事件',
      path: 'packageAPI/pages/device/capture-screen/capture-screen'
    }
  },

  data: {
    theme: 'light',
    captured: false,
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
    wx.onUserCaptureScreen(() => {
      this.setData({
        captured: true
      })
    })
  }
})
