Page({
  onShareAppMessage() {
    return {
      title: '打电话',
      path: 'packageAPI/pages/device/make-phone-call/make-phone-call'
    }
  },

  data: {
    theme: 'light',
    disabled: true
  },
  bindInput(e) {
    this.inputValue = e.detail.value

    if (this.inputValue.length > 0) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.inputValue,
      success() {
        console.log('成功拨打电话')
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
