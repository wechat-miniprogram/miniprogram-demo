Page({
  onShareAppMessage() {
    return {
      title: '获取手机系统信息',
      path: 'packageAPI/pages/device/get-system-info/get-system-info'
    }
  },

  data: {
    theme: 'light',
    systemInfo: {}
  },
  getSystemInfo() {
    const that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          systemInfo: res
        })
      }
    })
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
