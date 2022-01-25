import CustomPage from '../../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'dialog',
      path: 'page/weui/example/dialog/dialog'
    }
  },
  data: {
    dialogShow: false,
    showOneButtonDialog: false,
    buttons: [{text: '取消'}, {text: '确定'}],
    oneButton: [{text: '确定'}],
  },
  openConfirm() {
    this.setData({
      dialogShow: true
    })
  },
  tapDialogButton() {
    this.setData({
      dialogShow: false,
      showOneButtonDialog: false
    })
  },
  tapOneDialogButton() {
    this.setData({
      showOneButtonDialog: true
    })
  }
})
