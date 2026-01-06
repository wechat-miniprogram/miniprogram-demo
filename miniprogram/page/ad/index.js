let interstitialAd = null

Page({
  onShareAppMessage() {
    return {
      title: '微信广告展示',
      path: 'page/ad/index'
    }
  },

  data: {
    theme: 'light'
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

    // 创建插屏广告
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-7c0acfb6438237aa'
      })
      interstitialAd.onLoad(() => {
        console.log('插屏广告加载成功')
      })
      interstitialAd.onError((err) => {
        console.error('插屏广告加载失败', err)
      })
      interstitialAd.onClose(() => {
        console.log('插屏广告关闭')
      })
    }
  },

  onShow() {
    // 显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error('插屏广告显示失败', err)
      })
    }
  },

  onItemTap(e) {
    const type = e.currentTarget.dataset.type
    if (type === 'smart') {
      wx.navigateTo({
        url: '/page/ad/smart-ad/smart-ad'
      })
      return
    }
    const typeMap = {
      optimize: '广告调优',
      hosting: '广告托管',
      custom: '自主开发'
    }
    wx.showToast({
      title: `点击了${typeMap[type]}`,
      icon: 'none'
    })
  }
})

