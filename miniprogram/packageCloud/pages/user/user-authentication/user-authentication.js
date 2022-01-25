const app = getApp()

Page({
  onShareAppMessage() {
    return {
      title: '用户鉴权',
      path: 'packageCloud/pages/user/user-authentication/user-authentication'
    }
  },

  data: {
    theme: 'light',
    openid: '',
    loading: false
  },

  onGetOpenid() {
    this.setData({
      loading: true
    })
    app.getUserOpenIdViaCloud()
      .then(openid => {
        this.setData({
          openid,
          loading: false
        })
        return openid
      })
      .catch(err => {
        console.error(err)
      })
  },

  clear() {
    this.setData({
      openid: '',
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
