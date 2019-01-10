const AUTH_MODE = 'fingerPrint'

Page({
  onShareAppMessage() {
    return {
      title: '生物认证',
      path: 'page/API/pages/soter-authentication/soter-authentication'
    }
  },

  startAuth() {
    const startSoterAuthentication = () => {
      wx.startSoterAuthentication({
        requestAuthModes: [AUTH_MODE],
        challenge: 'test',
        authContent: '小程序示例',
        success: () => {
          wx.showToast({
            title: '认证成功'
          })
        },
        fail: (err) => {
          console.error(err)
          wx.showModal({
            title: '失败',
            content: '认证失败',
            showCancel: false
          })
        }
      })
    }

    const checkIsEnrolled = () => {
      wx.checkIsSoterEnrolledInDevice({
        checkAuthMode: AUTH_MODE,
        success: (res) => {
          console.log(res)
          if (parseInt(res.isEnrolled, 10) <= 0) {
            wx.showModal({
              title: '错误',
              content: '您暂未录入指纹信息，请录入后重试',
              showCancel: false
            })
            return
          }
          startSoterAuthentication()
        },
        fail: (err) => {
          console.error(err)
        }
      })
    }

    const notSupported = () => {
      wx.showModal({
        title: '错误',
        content: '您的设备不支持指纹识别',
        showCancel: false
      })
    }

    wx.checkIsSupportSoterAuthentication({
      success: (res) => {
        console.log(res)
        if (
          !res ||
          res.supportMode.length === 0 ||
          res.supportMode.indexOf('fingerPrint') < 0
        ) {
          notSupported()
          return
        }
        checkIsEnrolled()
      },
      fail: (err) => {
        console.error(err)
        notSupported()
      }
    })
  }
})
