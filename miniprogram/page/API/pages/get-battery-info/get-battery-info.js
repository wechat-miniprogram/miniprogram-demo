// miniprogram/page/API/pages/get-battery-info/get-battery-info.js
Page({
  data: {
    level: 0,
    isCharging: false,
  },

  getBatteryInfo() {
    wx.getBatteryInfo({
      complete: (res) => {
        this.setData({
          level: res.level,
          isCharging: res.isCharging,
        })
      },
    })
  }
})