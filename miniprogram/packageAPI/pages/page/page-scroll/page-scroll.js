Page({
  onShareAppMessage() {
    return {
      title: '页面滚动',
      path: 'packageAPI/pages/page/page-scroll/page-scroll'
    }
  },

  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },

  scrollToBottom() {
    wx.pageScrollTo({
      scrollTop: 3000,
      duration: 300
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
