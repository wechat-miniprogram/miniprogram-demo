Page({
  onShareAppMessage() {
    return {
      title: '获取手机网络状态',
      path: 'packageAPI/pages/device/get-network-type/get-network-type'
    }
  },

  data: {
    theme: 'light',
    hasNetworkType: false
  },
  getNetworkType() {
    const that = this
    wx.getNetworkType({
      success(res) {
        console.log(res)
        that.setData({
          hasNetworkType: true,
          networkType: res.subtype || res.networkType
        })
      }
    })
  },
  clear() {
    this.setData({
      hasNetworkType: false,
      networkType: ''
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
