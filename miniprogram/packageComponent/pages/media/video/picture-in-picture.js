Page({
  data: {
    theme: 'light',
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
  onReady() {

  },
  onShareAppMessage() {
    return {
      title: '小窗模式',
      path: 'packageComponent/pages/media/picture-in-picture/picture-in-picture'
    }
  },
  // onShareAppMessage() {
  //   return {
  //     title: 'video',
  //     path: 'packageComponent/pages/media/video/video'
  //   }
  // },
})
