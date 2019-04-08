const config = require('../../../../config')

Page({
  onShareAppMessage() {
    return {
      title: 'image',
      path: 'page/component/pages/image/image'
    }
  },
  data: {
    imageUrl: config.downloadExampleUrl
  }
})
