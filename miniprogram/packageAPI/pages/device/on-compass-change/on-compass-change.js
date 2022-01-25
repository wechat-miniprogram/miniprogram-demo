Page({
  onShareAppMessage() {
    return {
      title: '监听罗盘数据',
      path: 'packageAPI/pages/device/on-compass-change/on-compass-change'
    }
  },

  data: {
    theme: 'light',
    enabled: true,
    direction: 0
  },
  onReady() {
    const that = this
    wx.onCompassChange(function (res) {
      that.setData({
        direction: parseInt(res.direction, 10)
      })
    })
  },
  startCompass() {
    if (this.data.enabled) {
      return
    }
    const that = this
    wx.startCompass({
      success() {
        that.setData({
          enabled: true
        })
      }
    })
  },
  stopCompass() {
    if (!this.data.enabled) {
      return
    }
    const that = this
    wx.stopCompass({
      success() {
        that.setData({
          enabled: false
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
