Page({
  onShareAppMessage() {
    return {
      title: 'cover-view',
      path: 'packageComponent/pages/view/cover-view/cover-view'
    }
  },

  data: {
    theme: 'light',
    latitude: 23.099994,
    longitude: 113.324520,
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
