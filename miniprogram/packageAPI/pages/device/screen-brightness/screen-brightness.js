Page({
  onShareAppMessage() {
    return {
      title: '屏幕亮度',
      path: 'packageAPI/pages/device/screen-brightness/screen-brightness'
    }
  },

  data: {
    theme: 'light',
    screenBrightness: 0
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
    this._updateScreenBrightness()
  },

  changeBrightness(e) {
    const value = Number.parseFloat(
      (e.detail.value).toFixed(1)
    )
    this.setData({
      screenBrightness: Number.parseFloat(
        e.detail.value.toFixed(1)
      )
    })
    wx.setScreenBrightness({
      value,

    })
  },

  _updateScreenBrightness() {
    wx.getScreenBrightness({
      success: (res) => {
        console.log(res)
        this.setData({
          screenBrightness: Number.parseFloat(
            res.value.toFixed(1)
          )
        })
      },
      fail(err) {
        console.error(err)
      }
    })
  }
})
