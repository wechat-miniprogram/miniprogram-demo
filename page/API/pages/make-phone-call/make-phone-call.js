Page({
  onShareAppMessage() {
    return {
      title: '打电话',
      path: 'page/API/pages/make-phone-call/make-phone-call'
    }
  },

  data: {
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
  }
})
