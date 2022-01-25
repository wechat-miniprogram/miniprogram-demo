Page({
  onShareAppMessage() {
    return {
      title: '上传文件',
      path: 'packageAPI/pages/network/upload-file/upload-file'
    }
  },

  chooseImage() {
    const self = this

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: async function(res) {
        const imageSrc = res.tempFilePaths[0]
        const r = await wx.cloud.callFunction({
          name: 'login',
          data: {
            action: 'openid'
          },
        })
        const openId = r.result.openid;
        const cloudPath = `upload/${openId}.png`
        wx.cloud.uploadFile({
          cloudPath,  // 上传至云端的路径
          filePath: imageSrc, // 小程序临时文件路径
          config: {
            env: 'release-b86096'
          },
          success: res => {
            // 返回文件 ID
            console.log(res.fileID)
            console.log('uploadImage success, res is:', res)
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })

            self.setData({
              imageSrc,
              fileID: res.fileID,
            })
          },
          fail({errMsg}) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })
      },

      fail: res => {
        wx.showToast({
          icon: 'none',
          title: '上传失败',
        })
        console.log('uploadImage fail, errMsg is', res.errMsg)
      }
    })
  },
  onUnload() {
    if (this.data.fileID) {
      wx.cloud.deleteFile({
        fileList: [this.data.fileID]
      })
    }
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
