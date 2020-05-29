import CustomPage from '../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'preview',
      path: 'page/weui/example/preview/preview'
    }
  },
})