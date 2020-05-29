Page({
  onShareAppMessage() {
    return {
      title: 'live-pusher',
      path: 'page/component/pages/live-pusher/live-pusher'
    }
  },
  data: {
    videoSrc: '',
  },
  onReady(res) {
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
      success: res => {
        console.log('start success')
      },
      fail: res => {
        console.log('start fail')
      }
    })
  },
  handleScanQRCode() {
    wx.scanCode({
      complete: (res) => {
        const { result } = res;
        this.setData({
          videoSrc: result
        })
      },
    })
  },
  handlePause() {
    this.ctx.pause({
      success: res => {
        console.log('pause success')
      },
      fail: res => {
        console.log('pause fail')
      }
    })
  },
  handleStop() {
    this.ctx.stop({
      success: res => {
        console.log('stop success')
      },
      fail: res => {
        console.log('stop fail')
      }
    })
  },
  handleResume() {
    this.ctx.resume({
      success: res => {
        console.log('resume success')
      },
      fail: res => {
        console.log('resume fail')
      }
    })
  },
  handleSwitchCamera() {
    this.ctx.switchCamera({
      success: res => {
        console.log('switch camera success')
      },
      fail: res => {
        console.log('switch camera fail')
      }
    })
  },
  handleVideoSrcInput(e) {
    this.setData({
      videoSrc: e.detail.value
    })
  }
})