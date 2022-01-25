// miniprogram/page/API/pages/get-battery-info/get-battery-info.js
Page({
  onShareAppMessage() {
    return {
      title: '获取电池信息',
      path: 'packageAPI/pages/device/get-battery-info/get-battery-info'
    }
  },
  data: {
    theme: 'light',

  },

  getBatteryInfo() {
    wx.getBatteryInfo({
      complete: (res) => {
        const msg = res.isCharging ? '充电中' : '使用电池中'
        this.setData({
          level: res.level,
          isCharging: msg,
        })
      },
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
