const util = require('../../../../util/util.js')

let playTimeInterval
let recordTimeInterval
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
Page({
  onShareAppMessage() {
    return {
      title: '录音',
      path: 'packageAPI/pages/media/voice/voice'
    }
  },
  data: {
    theme: 'light',
    recording: false, // 录音中
    playing: false, // 播放中
    hasRecord: false, // 已经录音
    recordTime: 0, // 录音时长
    playTime: 0, // 播放时长
    formatedRecordTime: '00:00:00', // 录音时间
    formatedPlayTime: '00:00:00' // 播放时间
  },

  onHide() {
    if (this.data.playing) {
      this.stopVoice()
    } else if (this.data.recording) {
      this.stopRecordUnexpectedly()
    }
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
    // 监听录音开始事件
    recorderManager.onStart(() => {
      console.log('recorderManage: onStart')
      // 录音时长记录 每秒刷新
      recordTimeInterval = setInterval(() => {
        that.data.recordTime += 1
        const recordTime = that.data.recordTime
        that.setData({
          formatedRecordTime: util.formatTime(that.data.recordTime),
          recordTime
        })
      }, 1000)
    })

    // 监听录音停止事件
    recorderManager.onStop((res) => {
      console.log('recorderManage: onStop')
      that.setData({
        hasRecord: true, // 录音完毕
        recording: false,
        tempFilePath: res.tempFilePath,
        formatedPlayTime: util.formatTime(that.data.playTime),
      })
      // 清除录音计时器
      clearInterval(recordTimeInterval)
    })

    // 监听播放开始事件
    innerAudioContext.onPlay(() => {
      console.log('innerAudioContext: onPlay')
      playTimeInterval = setInterval(() => {
        const playTime = that.data.playTime + 1
        if (that.data.playTime === that.data.recordTime) {
          that.stopVoice()
        } else {
          console.log('update playTime', playTime)
          that.setData({
            formatedPlayTime: util.formatTime(playTime),
            playTime
          })
        }
      }, 1000)
    })

    innerAudioContext.onStop(() => {

    })
  },

  startRecord() {
    this.setData({
      recording: true // 录音开始
    })
    // 设置 Recorder 参数
    const options = {
      duration: 10000, // 持续时长
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'aac',
      frameSize: 50
    }
    recorderManager.start(options) // 开始录音
  },

  stopRecord() {
    recorderManager.stop() // 停止录音
  },

  stopRecordUnexpectedly() {
    const that = this
    wx.stopRecord({
      success() {
        console.log('stop record success')
        clearInterval(recordTimeInterval)
        that.setData({
          recording: false,
          hasRecord: false,
          recordTime: 0,
          formatedRecordTime: util.formatTime(0)
        })
      }
    })
  },

  playVoice() {
    innerAudioContext.src = this.data.tempFilePath
    this.setData({
      playing: true,

    }, () => {
      innerAudioContext.play()
    })
  },

  pauseVoice() {
    clearInterval(playTimeInterval)
    innerAudioContext.pause()
    this.setData({
      playing: false
    })
  },

  stopVoice() {
    clearInterval(playTimeInterval)
    innerAudioContext.stop()
    this.setData({
      playing: false,
      formatedPlayTime: util.formatTime(0),
      playTime: 0
    })
  },

  clear() {
    clearInterval(playTimeInterval)
    innerAudioContext.stop()
    this.setData({
      playing: false,
      hasRecord: false,
      tempFilePath: '',
      formatedRecordTime: util.formatTime(0),
      recordTime: 0,
      playTime: 0
    })
  }
})
