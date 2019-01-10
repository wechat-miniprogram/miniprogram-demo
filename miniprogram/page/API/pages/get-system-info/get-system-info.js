Page({
  onShareAppMessage() {
    return {
      title: '获取手机系统信息',
      path: 'page/API/pages/get-system-info/get-system-info'
    }
  },

  data: {
    systemInfo: {}
  },
  getSystemInfo() {
    const that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          systemInfo: res
        })
      }
    })
  }
})
