import CustomPage from '../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'badge',
      path: 'page/weui/example/badge/badge'
    }
  },
})