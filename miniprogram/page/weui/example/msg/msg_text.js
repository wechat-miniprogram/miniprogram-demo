import CustomPage from '../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'msg_text',
      path: 'page/weui/example/msg_text/msg_text'
    }
  },
})