Page({
  data: {
    hide1: false,
    hide2: false,
    theme: 'light'
  },
  onLoad() {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        this.setData({ theme })
      })
    }
  },
  onClick(e) {
    this.setData({ [e.target.dataset.set]: true })
  },
  onShareAppMessage() {
    return {
      title: '分层展现',
      path: 'page/weui/example/layeredpresentation/layeredpresentation'
    }
  },
})