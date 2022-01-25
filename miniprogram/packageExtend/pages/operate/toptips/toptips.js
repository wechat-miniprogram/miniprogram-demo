Page({
  onShareAppMessage() {
    return {
      title: 'toptips',
      path: 'packageExtend/pages/operate/toptips/toptips'
    }
  },
  data: {
    value: '',
    showTopTips: false,
    message: '请输入文本',
    type: 'info'
  },
  bindInputValue(e) {
    this.setData({
      value: e.detail.value
    })
  },
  bindConfirmTap() {
    if (this.data.value) {
      this.setData({
        showTopTips: true,
        message: this.data.value,
        type: 'success'
      })
    } else {
      this.setData({
        showTopTips: true,
        type: 'error'
      })
    }
  }
})
