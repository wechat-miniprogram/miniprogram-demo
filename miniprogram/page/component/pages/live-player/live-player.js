Page({
  onShareAppMessage() {
    return {
      title: 'live-player',
      path: 'page/component/pages/live-player/live-player'
    }
  },
  data: {
    videoSrc: ""
  },
  onReady(res) {
    this.ctx = wx.createLivePlayerContext('player')
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
  handleLivePlayerStateChange(e) {
    console.log('live-player code:', e.detail.code)
  },
  handleLivePlayerError(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  handlePlay() {
    this.ctx.play({
      success: res => {
        console.log('play success')
      },
      fail: res => {
        console.log('play fail')
      }
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
  handleMute() {
    this.ctx.mute({
      success: res => {
        console.log('mute success')
      },
      fail: res => {
        console.log('mute fail')
      }
    })
  },
  handleVideoSrcInput(e) {
    this.setData({
      videoSrc: e.detail.value
    })
  }
})
