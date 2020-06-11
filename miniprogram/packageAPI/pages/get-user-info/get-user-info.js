Page({
  onShareAppMessage() {
    return {
      title: '获取用户信息',
      path: 'packageAPI/pages/get-user-info/get-user-info'
    }
  },

  data: {
    hasUserInfo: false
  },
  getUserInfo(info) {
    const userInfo = info.detail.userInfo
    this.setData({
      userInfo,
      hasUserInfo: true
    })
  },
  clear() {
    this.setData({
      hasUserInfo: false,
      userInfo: {}
    })
  }
})
