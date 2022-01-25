Page({
  onShareAppMessage() {
    return {
      title: 'movable-view',
      path: 'packageComponent/pages/view/movable-view/movable-view'
    }
  },

  data: {
    theme: 'light',
    x: 0,
    y: 0,
    scale: 2,
  },

  tap() {
    this.setData({
      x: 30,
      y: 30
    })
  },

  tap2() {
    this.setData({
      scale: 3
    })
  },

  onChange(e) {
    console.log(e.detail)
  },

  onScale(e) {
    console.log(e.detail)
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
