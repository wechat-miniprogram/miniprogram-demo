const demoImageFileId = require('../../../../config').demoImageFileId

Page({
  onShareAppMessage() {
    return {
      title: '下载文件',
      path: 'packageAPI/pages/network/download-file/download-file'
    }
  },

  downloadImage() {
    const self = this

    wx.cloud.downloadFile({
      fileID: demoImageFileId, // 文件 ID
      success: res => {
        console.log('downloadFile success, res is', res)

        self.setData({
          imageSrc: res.tempFilePath
        })
      },
      fail: console.error
    })
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
