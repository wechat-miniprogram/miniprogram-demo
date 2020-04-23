const app = getApp()
const util = require('../../../../util/util.js')


const backgroundAudioManager = wx.getBackgroundAudioManager();
let updateInterval;

Page({
  onShareAppMessage() {
    return {
      title: '背景音乐',
      path: 'page/API/pages/background-audio/background-audio'
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
  onLoad() {
    const that = this;
    // 监听播放事件
    backgroundAudioManager.onPlay(() => {
      // 刷新播放时间
      this._enableInterval()
      this.setData({
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
      clearInterval(updateInterval);
      that.setData({
        playing: false,
        playTime: 0,
        formatedPlayTime: util.formatTime(0)
      })
    })

    backgroundAudioManager.onStop(() => {
      clearInterval(updateInterval);
      that.setData({
        playing: false,
        playTime: 0,
        formatedPlayTime: util.formatTime(0)
      })
    })
  },

  data: {
    playing: false, // 播放状态
    pause: false,
    playTime: 0,  // 播放时长
    formatedPlayTime: '00:00:00' // 格式化后的播放时长
  },

  play() {
    backgroundAudioManager.title = '此时此刻'
    backgroundAudioManager.epname = '此时此刻'
    backgroundAudioManager.singer = '许巍'
    backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'

    const that = this
    if(that.data.pause) {
      backgroundAudioManager.play();
      this.setData({
        playing: true,
      });
    } else {
      that.setData({
        playing: true,
      }, () => {
        // 设置src后会自动播放
        backgroundAudioManager.src = 'http://m10.music.126.net/20200423144548/9310dfb45e03cc57fa116766d2851ac2/ymusic/ecc8/b580/8fe6/dfa670c1193ab03b34aeb574c3a735e0.mp3'
      });
    }
  },

  seek(e) {
    backgroundAudioManager.seek(e.detail.value)
  },

  pause() {
    clearInterval(updateInterval)
    backgroundAudioManager.pause();
  },

  stop() {
    clearInterval(updateInterval)
    backgroundAudioManager.stop();
  },

  _enableInterval() {
    const that = this
    function update() {
      console.log(backgroundAudioManager.currentTime)
      that.setData({
        playTime: backgroundAudioManager.currentTime + 1,
        formatedPlayTime: util.formatTime(backgroundAudioManager.currentTime + 1)
      })
    }
    updateInterval = setInterval(update, 1000)
  },

  onUnload() {
    clearInterval(updateInterval)
  }
})
