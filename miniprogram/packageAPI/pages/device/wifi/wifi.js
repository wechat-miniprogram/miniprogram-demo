Page({
  onShareAppMessage() {
    return {
      title: 'Wi-Fi',
      path: 'packageAPI/pages/device/wifi/wifi'
    }
  },

  data: {
    theme: 'light',
    wifiList: []
  },

  onUnload() {
    this.stopSearch()
  },

  startSearch() {
    const getWifiList = () => {
      wx.getWifiList({
        success: () => {
          wx.onGetWifiList((res) => {
            const wifiList = res.wifiList
              .sort((a, b) => b.signalStrength - a.signalStrength)
              .map(wifi => {
                const strength = Math.ceil(wifi.signalStrength * 4)
                return Object.assign(wifi, {strength})
              })
            this.setData({
              wifiList
            })
          })
        },
        fail(err) {
          console.error(err)
        }
      })
    }

    const startWifi = () => {
      wx.startWifi({
        success: getWifiList,
        fail(err) {
          console.error(err)
        }
      })
    }

    wx.getSystemInfo({
      success(res) {
        const isIOS = res.platform === 'ios'
        if (isIOS) {
          wx.showModal({
            title: '提示',
            content: '由于系统限制，iOS用户请手动进入系统WiFi页面，然后返回小程序。',
            showCancel: false,
            success() {
              startWifi()
            }
          })
          return
        }
        startWifi()
      }
    })
  },

  stopSearch() {
    wx.stopWifi({
      success(res) {
        console.log(res)
      },
      fail(err) {
        console.error(err)
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
