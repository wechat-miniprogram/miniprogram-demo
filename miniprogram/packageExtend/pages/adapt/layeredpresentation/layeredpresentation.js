Page({
  data: {
    theme: 'light',
    hide1: false,
    hide2: false
  },
  onUnload() {
    if (wx.offThemeChange) {
      wx.offThemeChange()
    }
  },
  onLoad() {
    this.setData({
      theme: getApp().globalData.theme || 'light'
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
      path: 'packageExtend/pages/adapt/layeredpresentation/layeredpresentation'
    }
  },
})
