Page({
  onShareAppMessage() {
    return {
      title: '公众号',
      path: 'packageAPI/pages/api/official-account/official-account'
    }
  },

  data: {
    theme: 'light',
    setting: {}
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
