// miniprogram/page/API/pages/wxs/wxs.js
Page({
  onShareAppMessage() {
    return {
      title: 'wxs',
      path: 'packageAPI/pages/framework/wxs/wxs'
    }
  },
  handleNavChange(e) {
    console.log(e)
    wx.navigateTo({
      url: `/packageAPI/pages/framework/framework/wxs/${e.currentTarget.dataset.nav}`,
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
