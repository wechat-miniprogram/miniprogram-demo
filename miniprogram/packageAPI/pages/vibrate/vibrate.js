Page({
  onShareAppMessage() {
    return {
      title: '振动',
      path: 'packageAPI/pages/vibrate/vibrate'
    }
  },

  vibrateShort() {
    wx.vibrateShort({
      success(res) {
        console.log(res)
      },
      fail(err) {
        console.error(err)
      },
      complete() {
        console.log('completed')
      }
    })
  },

  vibrateLong() {
    wx.vibrateLong({
      success(res) {
        console.log(res)
      },
      fail(err) {
        console.error(err)
      },
      complete() {
        console.log('completed')
      }
    })
  }
})
