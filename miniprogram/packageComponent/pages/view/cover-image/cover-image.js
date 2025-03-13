Page({
    onShareAppMessage() {
      return {
        title: 'cover-image',
        path: 'packageComponent/pages/view/cover-image/cover-image'
      }
    },
  
    data: {
      theme: 'light',
    },
    onUnload() {
      if (wx.offThemeChange) {
        wx.offThemeChange()
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
    }
  })
  