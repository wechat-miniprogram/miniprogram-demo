Page({
  onShareAppMessage() {
    return {
      title: '获取用户信息',
      path: 'packageAPI/pages/api/get-user-info/get-user-info'
    }
  },

  data: {
    theme: 'light',
    hasUserInfo: false,
    canIUseGetUserProfile: false
  },
  getUserInfo(info) {
    console.log('getUserInfo')
    const userInfo = info.detail.userInfo
    this.setData({
      userInfo,
      hasUserInfo: true
    })
  },
  handleGetUserProfile(e) {
    console.log('getUserProfile')
    wx.getUserProfile({
      desc: '用于演示 wx.getUserProfile', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log('wx.getUserProfile: ', res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  clear() {
    this.setData({
      hasUserInfo: false,
      userInfo: {}
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
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  }
})
