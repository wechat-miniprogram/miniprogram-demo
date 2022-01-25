Page({
  onShareAppMessage() {
    return {
      title: '监听手机网络变化',
      path: 'packageAPI/pages/device/on-network-status-change/on-network-status-change'
    }
  },

  data: {
    theme: 'light',
    isConnected: false,
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
    const that = this
    wx.onNetworkStatusChange(function (res) {
      that.setData({
        isConnected: res.isConnected,
        networkType: res.networkType
      })
    })
  },
  onShow() {
    const that = this
    wx.getNetworkType({
      success(res) {
        that.setData({
          isConnected: res.networkType !== 'none',
          networkType: res.networkType
        })
      }
    })
  }
})
