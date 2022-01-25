const demoImageFileId = require('../../../../config').demoImageFileId

// 参考文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-client-api/storage/getTempFileURL.html

const app = getApp()

Page({
  onShareAppMessage() {
    return {
      title: '获取临时链接',
      path: 'packageCloud/pages/storage/get-temp-file-url/get-temp-file-url'
    }
  },

  data: {
    theme: 'light',
    fileTempURLDone: false,
    fileId: '',
    tempFileURL: '',
    // maxAge: 0,
    loading: false
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
    this.setData({
      fileId: app.globalData.fileId || demoImageFileId
    })
  },

  getTempFileURL() {
    const fileId = this.data.fileId
    if (!fileId) {
      return
    }
    const self = this

    this.setData({
      loading: true
    })
    wx.cloud.getTempFileURL({
      fileList: [fileId],
      success: res => {
        console.log('[换取临时链接] 成功：', res)
        if (res.fileList && res.fileList.length) {
          self.setData({
            fileTempURLDone: true,
            tempFileURL: res.fileList[0].tempFileURL,
            // maxAge: res.fileList[0].maxAge
          })
        }
      },
      fail: err => {
        console.error('[换取临时链接] 失败：', err)
      },
      complete: () => {
        self.setData({
          loading: false
        })
      }
    })
  }
})
