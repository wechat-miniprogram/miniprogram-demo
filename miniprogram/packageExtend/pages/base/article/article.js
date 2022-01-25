import CustomPage from '../../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'article',
      path: 'packageExtend/pages/base/article/article'
    }
  },
})
