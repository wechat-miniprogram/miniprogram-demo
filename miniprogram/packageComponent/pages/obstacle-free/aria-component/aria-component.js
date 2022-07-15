// miniprogram/packageComponent/pages/obstacle-free/aria-component/aria-component.js
Page({
  data: {
    theme: 'light'
  },
  onShareAppMessage() {
    return {
      title: '无障碍访问',
      path: 'packageComponent/pages/obstacle-free/aria-component/aria-component'
    }
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
