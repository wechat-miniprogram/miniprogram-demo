Page({
  data: {
    theme: 'light',
    sharedata: {
    theme: 'light',
      title: '自定义转发标题',
      desc: '自定义转发描述',
      path: 'packageAPI/pages/api/share/share'
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
  },

  onShareAppMessage() {
    return this.data.shareData
  }
})
