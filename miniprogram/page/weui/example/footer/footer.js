import CustomPage from '../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'footer',
      path: 'page/weui/example/footer/footer'
    }
  },
})