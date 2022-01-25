Page({
  onShareAppMessage() {
    return {
      title: '标题栏加载动画',
      path: 'packageAPI/pages/page/navigation-bar-loading/navigation-bar-loading'
    }
  },

  showNavigationBarLoading() {
    wx.showNavigationBarLoading()
  },
  hideNavigationBarLoading() {
    wx.hideNavigationBarLoading()
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
