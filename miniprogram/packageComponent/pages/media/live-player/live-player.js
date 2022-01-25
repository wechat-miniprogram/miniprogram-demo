Page({
  onShareAppMessage() {
    return {
      title: 'live-player',
      path: 'packageComponent/pages/media/live-player/live-player'
    }
  },
  data: {
    theme: 'light',
    videoSrc: ''
  },
  onReady() {
    this.ctx = wx.createLivePlayerContext('player')
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
  handleLivePlayerStateChange(e) {
    console.log('live-player code:', e.detail.code)
  },
  handleLivePlayerError(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  handlePlay() {
    this.ctx.play({
      success: () => {
        console.log('play success')
      },
      fail: () => {
        console.log('play fail')
      }
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
  handleMute() {
    this.ctx.mute({
      success: () => {
        console.log('mute success')
      },
      fail: () => {
        console.log('mute fail')
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
