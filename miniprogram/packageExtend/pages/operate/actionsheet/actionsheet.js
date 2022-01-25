import CustomPage from '../../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'actionsheet',
      path: 'page/weui/example/actionsheet/actionsheet'
    }
  },
  open() {
    wx.showActionSheet({
      itemList: ['A', 'B', 'C'],
      success(res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
        }
      }
    })
  },
  data: {
    showDialog: false,
    groups: [
      {text: '示例菜单', value: 1},
      {text: '示例菜单', value: 2},
      {text: '负向菜单', type: 'warn', value: 3}
    ]
  },
  openDialog() {
    this.setData({
      showDialog: true
    })
  },
  closeDialog() {
    this.setData({
      showDialog: false
    })
  },
  btnClick(e) {
    console.log(e)
    this.closeDialog()
  }
})
