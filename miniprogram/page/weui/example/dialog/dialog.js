import CustomPage from '../../base/CustomPage'

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
    openConfirm: function () {
        this.setData({
            dialogShow: true
        })
    },
    tapDialogButton(e) {
        this.setData({
            dialogShow: false,
            showOneButtonDialog: false
        })
    },
    tapOneDialogButton(e) {
        this.setData({
            showOneButtonDialog: true
        })
    }
});
