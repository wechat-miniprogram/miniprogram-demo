Page({
  onShareAppMessage() {
    return {
      title: '跳转',
      path: 'packageAPI/pages/api/jump/jump'
    }
  },

  data: {
    theme: 'light',
    setting: {}
  },
  //打开半屏小程序
  openhalfscreenminiprogram(){
    wx.openEmbeddedMiniProgram({
        appId: 'wxfdcee92a299bcaf1', // 腾讯公益
        extraData: {
          foo: 'bar'
        },
        // envVersion: 'develop',
        success(res) {
          // 打开成功
        }
    })
  },
  //打开另一个小程序
  openanotherminiprogram(){
    wx.navigateToMiniProgram({
        appId: 'wxfdcee92a299bcaf1', // 腾讯公益
        // extraData: {
        //   foo: 'bar'
        // },
        // envVersion: 'develop',
        success(res) {
          // 打开成功
        }
    })
  },
  //退出当前小程序
  exitminiprogram(){
    wx.exitMiniProgram({
        success(){
            wx.showToast({
                title: '退出成功',
                icon: 'none',
                duration: 2000
              })
        },
        fail(){
            wx.showToast({
                title: '退出失败',
                icon: 'none',
                duration: 2000
              })
        }
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
