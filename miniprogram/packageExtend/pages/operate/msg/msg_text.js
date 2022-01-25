import CustomPage from '../../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'msg_text',
      path: 'packageExtend/pages/operate/msg_text/msg_text'
    }
  },
})
