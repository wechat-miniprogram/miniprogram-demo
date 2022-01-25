// miniprogram/packageAPI/pages/framework/resizable/resizable.js
Page({
  onShareAppMessage() {
    return {
      title: '屏幕旋转',
      path: 'packageAPI/pages/framework/resizable/resizable'
    }
  },
  data: {
    theme: 'light',
    status: 'lock',
  },
  handleStatusChange(e) {
    this.setData({
      status: e.currentTarget.dataset.status,
    })
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
