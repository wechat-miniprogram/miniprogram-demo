Page({
  onShareAppMessage() {
    return {
      title: '振动',
      path: 'packageAPI/pages/device/vibrate/vibrate'
    }
  },

  vibrateShort() {
    wx.vibrateShort({
      success(res) {
        console.log(res)
      },
      fail(err) {
        console.error(err)
      },
      complete() {
        console.log('completed')
      }
    })
  },

  vibrateLong() {
    wx.vibrateLong({
      success(res) {
        console.log(res)
      },
      fail(err) {
        console.error(err)
      },
      complete() {
        console.log('completed')
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
