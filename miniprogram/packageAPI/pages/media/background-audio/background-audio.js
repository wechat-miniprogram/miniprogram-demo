// const app = getApp()
const util = require('../../../../util/util.js')


const backgroundAudioManager = wx.getBackgroundAudioManager()
let updateInterval

Page({
  onShareAppMessage() {
    return {
      title: '背景音乐',
      path: 'packageAPI/pages/media/background-audio/background-audio'
    }
  },
  onShow() {
    if (!backgroundAudioManager.paused && backgroundAudioManager.paused !== undefined) {
      this._enableInterval()
      this.setData({
        playing: true
      })
    }
    
  },


  data: {
    theme: 'light',
    playing: false, // 播放状态
    pause: false,
    playTime: 0, // 播放时长
    formatedPlayTime: '00:00:00' // 格式化后的播放时长
  },

  play() {
    backgroundAudioManager.title = '此时此刻'
    backgroundAudioManager.epname = '此时此刻'
    backgroundAudioManager.singer = '许巍'
    backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'

    const that = this
    if (that.data.pause) {
      backgroundAudioManager.play()
      this.setData({
        playing: true,
      })
    } else {
      that.setData({
        playing: true,
      }, () => {
        // 设置src后会自动播放
        backgroundAudioManager.src = 'https://dldir1.qq.com/music/release/upload/t_mm_file_publish/2339610.m4a'
      })
    }
  },

  seek(e) {
    backgroundAudioManager.seek(e.detail.value)
  },

  pause() {
    clearInterval(updateInterval)
    backgroundAudioManager.pause()

  },

  stop() {
    clearInterval(updateInterval)
    backgroundAudioManager.stop()
  },

  _enableInterval() {
    const that = this
    function update() {
      that.setData({
        playTime: backgroundAudioManager.currentTime + 1,
        formatedPlayTime: util.formatTime(backgroundAudioManager.currentTime + 1)
      })
    }
    updateInterval = setInterval(update, 1000)
  },

  onUnload() {
    clearInterval(updateInterval)
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
    const that = this
    // 监听播放事件
    backgroundAudioManager.onPlay(() => {
      // 刷新播放时间
      that._enableInterval()
      that.setData({
        pause: false,
      })
    })

    // 监听暂停事件
    backgroundAudioManager.onPause(() => {
      clearInterval(updateInterval)
      that.setData({
        playing: false,
        pause: true,
      })
    })

    backgroundAudioManager.onEnded(() => {
      clearInterval(updateInterval)
      that.setData({
        playing: false,
        playTime: 0,
        formatedPlayTime: util.formatTime(0)
      })
    })

    backgroundAudioManager.onStop(() => {
      clearInterval(updateInterval)
      that.setData({
        playing: false,
        playTime: 0,
        formatedPlayTime: util.formatTime(0)
      })
    })
  },
})
