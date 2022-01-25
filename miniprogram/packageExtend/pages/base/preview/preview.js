import CustomPage from '../../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'preview',
      path: 'packageExtend/pages/base/preview/preview'
    }
  },
})
