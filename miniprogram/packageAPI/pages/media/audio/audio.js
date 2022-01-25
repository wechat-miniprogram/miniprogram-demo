Page({
  onShareAppMessage() {
    return {
      title: 'Audio',
      path: 'packageAPI/pages/media/audio/audio'
    }
  },
  onReady() {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createInnerAudioContext()
    this.audioCtx.src = 'https://dldir1.qq.com/music/release/upload/t_mm_file_publish/2339610.m4a'
    this.audioCtx.play()
  },
  data: {
    theme: 'light',
    src: ''
  },
  audioPlay() {
    this.audioCtx.play()
  },
  audioPause() {
    this.audioCtx.pause()
  },
  audio14() {
    this.audioCtx.seek(14)
  },
  audioStart() {
    this.audioCtx.seek(0)
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
