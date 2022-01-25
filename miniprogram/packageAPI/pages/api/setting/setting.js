Page({
  onShareAppMessage() {
    return {
      title: '设置',
      path: 'packageAPI/pages/api/setting/setting'
    }
  },

  data: {
    theme: 'light',
    setting: {}
  },

  getSetting() {
    wx.getSetting({
      success: (res) => {
        console.log(res)
        this.setData({setting: res.authSetting})
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
