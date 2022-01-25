
Page({
  onShareAppMessage() {
    return {
      title: '生物认证',
      path: 'packageAPI/pages/api/soter-authentication/soter-authentication'
    }
  },

  startAuth(e) {
    console.log(e)
    const AUTH_MODE = e.currentTarget.dataset.mode
    console.log(AUTH_MODE)
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
              content: `您暂未录入${AUTH_MODE === 'facial' ? '人脸' : '指纹'}信息，请录入后重试`,
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
        content: `您的设备不支持${AUTH_MODE === 'facial' ? '人脸' : '指纹'}识别`,
        showCancel: false
      })
    }

    wx.checkIsSupportSoterAuthentication({
      success: (res) => {
        console.log(res)
        if (!res || res.supportMode.length === 0 || res.supportMode.indexOf(AUTH_MODE) < 0) {
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
