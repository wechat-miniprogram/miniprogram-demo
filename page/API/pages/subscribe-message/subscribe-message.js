const subscribeMessageUrl = require('../../../../config').subscribeMessageUrl

const app = getApp()

Page({
  onShareAppMessage() {
    return {
      title: '订阅消息',
      path: 'page/API/pages/subscribe-message/subscribe-message'
    }
  },

  data: {
    hasAuth: false,
    authType: 0, // 0 - 已授权，1 - 已拒绝授权
  },

  onShow() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting) {
          if (res.authSetting['scope.subscribemsg'] === true || res.authSetting['scope.subscribemsg'] === false) {
            this.setData({
              hasAuth: true,
              authType: res.authSetting['scope.subscribemsg'] ? 0 : 1
            })
          }
        }
      }
    })
  },

  openSetting() {
    wx.openSetting({})
  },

  onsubscribe(res) {
    console.log(res.detail.errMsg)

    if (res.detail.errMsg === 'subscribeMessage:fail auth deny') {
      this.setData({
        hasAuth: true,
        authType: 1,
      })
    }

    if (res.detail.errMsg === 'subscribeMessage:ok') {
      this.setData({
        hasAuth: true,
        authType: 0,
      })
    }
  },

  dosendmsg() {
    this.setData({
      loading: true
    })

    app.getUserOpenId((err, openid) => {
      if (!err) {
        wx.request({
          url: subscribeMessageUrl,
          method: 'POST',
          data: {
            openid,
          },
          success: (res) => {
            console.log('send subscribe message success', res)
            wx.showToast({
              title: '发送成功',
              icon: 'success'
            })
            this.setData({
              loading: false
            })
          },
          fail: ({errMsg}) => {
            console.log('send subscribe message fail, errMsg is:', errMsg)
          }
        })
      } else {
        console.log('err:', err)
      }
    })
  }
})
