Page({
  onShareAppMessage() {
    return {
      title: 'iBeacon',
      path: 'page/API/pages/ibeacon/ibeacon'
    }
  },

  data: {
    uuid: '',
    beacons: []
  },

  onUnload() {
    this.stopSearch()
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
        wx.onBeaconUpdate(({beacons}) => {
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
  }
})
