import CustomPage from '../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'loadmore',
      path: 'page/weui/example/loadmore/loadmore'
    }
  },
})