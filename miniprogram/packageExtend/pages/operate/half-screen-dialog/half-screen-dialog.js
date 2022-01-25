import CustomPage from '../../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'half-screen-dialog',
      path: 'page/weui/example/half-screen-dialog/half-screen-dialog'
    }
  },
  data: {
    typeF: false,
    typeS: false,
    typeT: false,
    buttons: [
      {
        type: 'default',
        className: '',
        text: '辅助操作',
        value: 0
      },
      {
        type: 'primary',
        className: '',
        text: '主操作',
        value: 1
      }
    ]
  },
  openTypeF() {
    this.setData({
      typeF: true
    })
  },
  openTypeS() {
    this.setData({
      typeS: true
    })
  },
  openTypeT() {
    this.setData({
      typeT: true
    })
  },
  buttontap(e) {
    console.log(e.detail)
  }
})
