// 参考文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-client-api/storage/deleteFile.html

const app = getApp()

Page({
  onShareAppMessage() {
    return {
      title: '删除文件',
      path: 'packageCloud/pages/storage/delete-file/delete-file'
    }
  },

  data: {
    theme: 'light',
    fileId: '',
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
      fileId: app.globalData.fileId || ''
    })
  },

  onShow() {
    this.setData({
      fileId: app.globalData.fileId || ''
    })
  },

  deleteFile() {
    const fileId = this.data.fileId
    if (!fileId) {
      return
    }
    const self = this

    this.setData({
      loading: true
    })
    wx.cloud.deleteFile({
      fileList: [fileId],
      success: res => {
        console.log('[删除文件] 成功：', res)
        if (res.fileList && res.fileList.length) {
          self.setData({
            fileId: ''
          })
        }
        app.globalData.fileId = ''
        wx.showToast({
          title: '删除成功'
        })
      },
      fail: err => {
        console.error('[删除文件] 失败：', err)
      },
      complete: () => {
        self.setData({
          loading: false
        })
      }
    })
  }
})
