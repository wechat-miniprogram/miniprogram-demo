// miniprogram/page/API/pages/get-battery-info/get-battery-info.js
Page({
  data: {
    
  },

  getBatteryInfo() {
    wx.getBatteryInfo({
      complete: (res) => {
        const msg = res.isCharging ? '充电中' : '使用电池中';
        this.setData({
          level: res.level,
          isCharging: msg,
        })
      },
    })
  }
})