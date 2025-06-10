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
  // 打开半屏小程序
  openhalfscreenminiprogram() {
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
  // 打开另一个小程序
  openanotherminiprogram() {
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
  // 退出当前小程序
  exitminiprogram() {
    wx.exitMiniProgram({
      success() {
        wx.showToast({
          title: '退出成功',
          icon: 'none',
          duration: 2000
        })
      },
      fail() {
        wx.showToast({
          title: '退出失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 打开公众号主页
  openofficialaccountprofile() {
    wx.openOfficialAccountProfile({
      username: 'gh_56fc3b00cc4f',
      success: (res) => {
      },
      fail: (res) => {
      }
    })
  },
  // 打开公众号文章
  openofficialaccountarticle() {
    wx.openOfficialAccountArticle({
      url: 'https://mp.weixin.qq.com/s/vTt8sZ_tTkTEVYgcydKqew', // 此处填写公众号文章连接
      success: (res) => {
      },
      fail: (res) => {
      }
    })
  },
  onUnload() {
    if (wx.offThemeChange) {
      wx.offThemeChange()
    }
  },
  onLoad() {
    this.setData({
      theme: getApp().globalData.theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        this.setData({ theme })
      })
    }
  }
})
