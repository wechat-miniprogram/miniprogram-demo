const app = getApp()
Page({
  onShareAppMessage() {
    return {
      title: '微信登录',
      path: 'packageAPI/pages/api/login/login'
    }
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
    this.setData({
      hasLogin: app.globalData.hasLogin
    })
  },
  data: {
    theme: 'light',},
  login() {
    const that = this
    wx.login({
      success() {
        app.globalData.hasLogin = true
        that.setData({
          hasLogin: true
        })
      }
    })
  }
})
