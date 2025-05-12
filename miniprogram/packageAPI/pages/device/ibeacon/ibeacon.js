Page({
  onShareAppMessage() {
    return {
      title: 'iBeacon',
      path: 'packageAPI/pages/device/ibeacon/ibeacon'
    }
  },

  data: {
    theme: 'light',
    uuid: '',
    beacons: []
  },

  enterUuid(e) {
    this.setData({
      uuid: e.detail.value
    })
  },

  startSearch() {
    if (this._searching) return
    this._searching = true
    wx.startBeaconDiscovery({
      uuids: [this.data.uuid],
      success: (res) => {
        console.log(res)
        wx.onBeaconUpdate(({ beacons }) => {
          this.setData({
            beacons
          })
        })
      },
      fail: (err) => {
        console.error(err)
      }
    })
  },

  stopSearch() {
    this._searching = false
    wx.stopBeaconDiscovery()
  },
  onUnload() {
    if (wx.offThemeChange) {
      wx.offThemeChange()
    }
    this.stopSearch()
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
