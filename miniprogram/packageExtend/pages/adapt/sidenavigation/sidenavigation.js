Page({
  data: {
    show: false,
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
  show() {
    this.setData({show: true})
  },
  hide() {
    this.setData({show: false})
  },
  onShareAppMessage() {
    return {
      title: '侧边导航栏',
      path: 'packageExtend/pages/adapt/sidenavigation/sidenavigation'
    }
  },
})
