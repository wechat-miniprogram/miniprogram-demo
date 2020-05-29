
Page({
  onShareAppMessage() {
    return {
      title: 'image',
      path: 'page/component/pages/image/image'
    }
  },
  onLoad() {
    wx.cloud.getTempFileURL({
      fileList: [{
        fileID: 'cloud://release-b86096.7265-release-b86096-1258211818/开发者社区.webp',
        maxAge: 60 * 60, 
      }]
    }).then(res => {
      console.log(res);
      this.setData({
        webpImageUrl: res.fileList[0].tempFileURL
      })
    }).catch(error => {
      console.log('CLOUD：image 临时链接获取失败')
    })
  },
  data: {
    imageUrl: 'cloud://release-b86096.7265-release-b86096-1258211818/demo.jpg',
    webpImageURL: '',
  }
})
