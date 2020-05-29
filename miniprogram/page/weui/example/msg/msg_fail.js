import CustomPage from '../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'msg_fail',
      path: 'page/weui/example/msg_fail/msg_fail'
    }
  },
})