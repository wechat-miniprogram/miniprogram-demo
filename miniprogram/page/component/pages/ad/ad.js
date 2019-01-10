const info = wx.getSystemInfoSync()

Page({
  onShareAppMessage() {
    return {
      title: 'ad',
      path: 'page/component/pages/ad/ad'
    }
  },

  data: {
    platform: info.platform
  }
})
