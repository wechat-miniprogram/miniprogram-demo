import CustomPage from '../../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'msg_success',
      path: 'packageExtend/pages/operate/msg_success'
    }
  },
})
