Page({
  onShareAppMessage() {
    return {
      title: '设置',
      path: 'packageAPI/pages/setting/setting'
    }
  },

  data: {
    setting: {}
  },

  getSetting() {
    wx.getSetting({
      success: (res) => {
        console.log(res)
        this.setData({setting: res.authSetting})
      }
    })
  }
})
