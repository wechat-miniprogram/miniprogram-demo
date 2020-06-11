import CustomPage from '../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'article',
      path: 'page/weui/example/article/article'
    }
  },
});