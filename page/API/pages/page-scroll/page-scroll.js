Page({
  onShareAppMessage() {
    return {
      title: '页面滚动',
      path: 'page/API/pages/page-scroll/page-scroll'
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
  }
})
