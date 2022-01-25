const {demoImageFileId, demoVideoFileId} = require('../../../../config')

Page({
  onShareAppMessage() {
    return {
      title: '组件支持',
      path: 'packageCloud/pages/storage/cloud-file-component/cloud-file-component'
    }
  },

  data: {
    theme: 'light',
    imageFileId: demoImageFileId,
    videoFileId: demoVideoFileId
  },
  onLoad() {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({theme}) => {
        this.setData({theme})
      })
    }
  }
})
