const {demoImageFileId, demoVideoFileId} = require('../../../../config')

Page({
  onShareAppMessage() {
    return {
      title: '组件支持',
      path: 'page/cloud/pages/cloud-file-component/cloud-file-component'
    }
  },

  data: {
    imageFileId: demoImageFileId,
    videoFileId: demoVideoFileId
  }
})
