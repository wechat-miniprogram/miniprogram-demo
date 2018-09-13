Page({
  onShareAppMessage() {
    return {
      title: '用户截屏事件',
      path: 'page/API/pages/capture-screen/capture-screen'
    }
  },

  data: {
    captured: false,
  },
  onLoad() {
    wx.onUserCaptureScreen(() => {
      this.setData({
        captured: true
      })
    })
  }
})
