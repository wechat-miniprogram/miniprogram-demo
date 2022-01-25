Page({
  data: {
    theme: 'light'
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
    return {
      title: '横向拓展',
      path: 'packageExtend/pages/adapt/horizontalexpansion/horizontalexpansion'
    }
  },
})
