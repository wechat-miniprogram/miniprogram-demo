Page({
  onShareAppMessage() {
    return {
      title: 'live-pusher',
      path: 'packageComponent/pages/media/live-pusher/live-pusher'
    }
  },
  data: {
    theme: 'light',
    videoSrc: '',
  },
  onReady() {
    this.ctx = wx.createLivePusherContext('pusher')
  },
  handleLivePusherStateChange(e) {
    console.log('live-pusher code:', e.detail.code)
  },
  handleLivePusherError(e) {
    console.error('live-pusher error:', e.detail.errMsg)
  },
  handleStart() {
    this.ctx.start({
      success: () => {
        console.log('start success')
      },
      fail: () => {
        console.log('start fail')
      }
    })
  },
  handleScanQRCode() {
    wx.scanCode({
      complete: (res) => {
        const {result} = res
        this.setData({
          videoSrc: result
        })
      },
    })
  },
  handlePause() {
    this.ctx.pause({
      success: () => {
        console.log('pause success')
      },
      fail: () => {
        console.log('pause fail')
      }
    })
  },
  handleStop() {
    this.ctx.stop({
      success: () => {
        console.log('stop success')
      },
      fail: () => {
        console.log('stop fail')
      }
    })
  },
  handleResume() {
    this.ctx.resume({
      success: () => {
        console.log('resume success')
      },
      fail: () => {
        console.log('resume fail')
      }
    })
  },
  handleSwitchCamera() {
    this.ctx.switchCamera({
      success: () => {
        console.log('switch camera success')
      },
      fail: () => {
        console.log('switch camera fail')
      }
    })
  },
  handleVideoSrcInput(e) {
    this.setData({
      videoSrc: e.detail.value
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
