const {wxml, style} = require('./demo.js')

Page({
  onShareAppMessage() {
    return {
      title: 'wxml-to-canvas',
      path: 'packageExtend/pages/extend/wxml-to-canvas/wxml-to-canvas'
    }
  },
  data: {
    src: '',
    wxmlTemplate: wxml('your_img_url'),
    showCanvas: false,
  },
  onLoad() {
    this.widget = this.selectComponent('.widget')
    wx.cloud.getTempFileURL({
      fileList: ['cloud://release-b86096.7265-release-b86096-1258211818/开放社区.jpeg'],
      success: res => {
        const url = res.fileList[0].tempFileURL
        console.log(url)
        this.url = url
      },
      fail: console.error
    })
  },
  renderToCanvas() {
    console.log(wxml(this.url))
    const p1 = this.widget.renderToCanvas({wxml: wxml(this.url), style})
    p1.then((re) => {
      console.log('container', re.layoutBox)
      this.data.showCanvas = true
      this.container = re
      return re
    }).catch(() => {})
  },
  extraImage() {
    console.log(this.widget, this.widget.canvasToTempFilePath)
    if (!this.data.showCanvas) {
      wx.showModal({
        title: '提示',
        content: '请先渲染到canvas'
      })
      return
    }
    const p2 = this.widget.canvasToTempFilePath()
    p2.then(res => {
      this.setData({
        src: res.tempFilePath,
        width: this.container.layoutBox.width,
        height: this.container.layoutBox.height
      })
      return res
    }).catch(() => {})
  }
})
