Page({
  onShareAppMessage() {
    return {
      title: 'match-media',
      path: 'packageComponent/pages/view/match-media/match-media'
    }
  },

  data: {
    theme: 'light'
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
  }
})
