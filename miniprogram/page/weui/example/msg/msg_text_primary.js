import CustomPage from '../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'msg_text_primary',
      path: 'page/weui/example/msg_text_primary/msg_text_primary'
    }
  },
})