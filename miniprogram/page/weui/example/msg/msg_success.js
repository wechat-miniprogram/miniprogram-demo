import CustomPage from '../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'msg_success',
      path: 'page/weui/example/msg_success'
    }
  },
})