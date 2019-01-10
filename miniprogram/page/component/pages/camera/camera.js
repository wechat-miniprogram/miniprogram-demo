Page({
  onShareAppMessage() {
    return {
      title: 'camera',
      path: 'page/component/pages/camera/camera'
    }
  },

  data: {
    src: '',
    videoSrc: '',
    position: 'back',
    mode: 'scanCode',
    result: {}
  },
  onLoad() {
    this.ctx = wx.createCameraContext()
  },
  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },
  startRecord() {
    this.ctx.startRecord({
      success: () => {
        console.log('startRecord')
      }
    })
  },
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        this.setData({
          src: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
      }
    })
  },
  togglePosition() {
    this.setData({
      position: this.data.position === 'front'
        ? 'back' : 'front'
    })
  },
  error(e) {
    console.log(e.detail)
  }
})
