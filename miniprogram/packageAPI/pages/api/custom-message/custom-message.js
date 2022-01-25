Page({
  onShareAppMessage() {
    return {
      title: '客服消息',
      path: 'packageAPI/pages/api/custom-message/custom-message'
    }
  },
  handleContact (e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
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
