const demoImageFileId = require('../../../../config').demoImageFileId

// 参考文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-client-api/storage/downloadFile.html

const app = getApp()

Page({
  onShareAppMessage() {
    return {
      title: '下载文件',
      path: 'page/cloud/pages/download-file/download-file'
    }
  },

  data: {
    fileDownloaded: false,
    fileId: '',
    filePath: '',
    loading: false
  },

  onLoad() {
    this.setData({
      fileId: app.globalData.fileId || demoImageFileId
    })
  },

  downloadFile() {
    const fileId = this.data.fileId
    if (!fileId) {
      return
    }
    const self = this

    this.setData({
      loading: true
    })
    wx.cloud.downloadFile({
      fileID: fileId,
      success: res => {
        console.log('[下载文件] 成功：', res)
        self.setData({
          fileDownloaded: true,
          filePath: res.tempFilePath
        })
      },
      fail: err => {
        console.error('[下载文件] 失败：', err)
      },
      complete: () => {
        self.setData({
          loading: false
        })
      }
    })
  }
})
