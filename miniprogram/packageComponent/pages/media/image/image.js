
Page({
  onShareAppMessage() {
    return {
      title: 'image',
      path: 'packageComponent/pages/media/image/image'
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
    wx.cloud.getTempFileURL({
      fileList: [{
        fileID: 'cloud://release-b86096.7265-release-b86096-1258211818/开发者社区.webp',
        maxAge: 60 * 60,
      }]
    }).then(res => {
      console.log(res)
      this.setData({
        webpImageUrl: res.fileList[0].tempFileURL
      })
      return res
    }).catch(error => {
      console.log('CLOUD：image 临时链接获取失败', error)
    })
  },
  data: {
    theme: 'light',
    imageUrl: 'cloud://release-b86096.7265-release-b86096-1258211818/demo.jpg',
    webpImageURL: '',
  }
})
