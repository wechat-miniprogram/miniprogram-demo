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
    result: {},
    frameWidth: 0,
    frameHeight: 0
  },
  onLoad() {
    this.ctx = wx.createCameraContext()
    const listener = this.ctx.onCameraFrame((frame) => {
      const {
        frameWidth,
        frameHeight
      } = this.data;

      // you can print buffer data by executing codes below:
      // console.log(frame.data)
      if (frameWidth === frame.width && frameHeight == frame.height) return;
      this.setData({
        frameWidth: frame.width,
        frameHeight: frame.height
      })
    })
    listener.start()
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
