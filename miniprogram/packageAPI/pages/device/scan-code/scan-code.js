Page({
  onShareAppMessage() {
    return {
      title: '扫码',
      path: 'packageAPI/pages/device/scan-code/scan-code'
    }
  },

  data: {
    theme: 'light',
    result: ''
  },

  scanCode() {
    const that = this
    wx.scanCode({
      scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
      success(res) {
        that.setData({
          result: res.result
        })
      },
      fail(err) {
        console.log('scanCode fail: ', err)
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
