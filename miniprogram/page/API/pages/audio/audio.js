Page({
  onReady (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
    this.audioCtx.setSrc('http://m10.music.126.net/20200423163948/74f3a57b9bc58ae3587b6c76a6543c6d/ymusic/ecc8/b580/8fe6/dfa670c1193ab03b34aeb574c3a735e0.mp3')
    this.audioCtx.play()
  },
  data: {
    src: ''
  },
  audioPlay () {
    this.audioCtx.play()
  },
  audioPause () {
    this.audioCtx.pause()
  },
  audio14 () {
    this.audioCtx.seek(14)
  },
  audioStart () {
    this.audioCtx.seek(0)
  }
})