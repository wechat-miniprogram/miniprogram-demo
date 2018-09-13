const app = getApp()
const util = require('../../../../util/util.js')

const dataUrl = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
Page({
  onShareAppMessage() {
    return {
      title: '背景音乐',
      path: 'page/API/pages/background-audio/background-audio'
    }
  },

  onLoad() {
    this._enableInterval()

    if (app.globalData.backgroundAudioPlaying) {
      this.setData({
        playing: true
      })
    }
  },
  data: {
    playing: false,
    playTime: 0,
    formatedPlayTime: '00:00:00'
  },
  play() {
    const that = this
    wx.playBackgroundAudio({
      dataUrl,
      title: '此时此刻',
      coverImgUrl: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
      complete() {
        that.setData({
          playing: true
        })
      }
    })
    this._enableInterval()
    app.globalData.backgroundAudioPlaying = true
  },
  seek(e) {
    clearInterval(this.updateInterval)
    const that = this
    wx.seekBackgroundAudio({
      position: e.detail.value,
      complete() {
        // 实际会延迟两秒左右才跳过去
        setTimeout(function () {
          that._enableInterval()
        }, 2000)
      }
    })
  },
  pause() {
    const that = this
    wx.pauseBackgroundAudio({
      dataUrl,
      success() {
        that.setData({
          playing: false
        })
      }
    })
    app.globalData.backgroundAudioPlaying = false
  },
  stop() {
    const that = this
    wx.stopBackgroundAudio({
      dataUrl,
      success() {
        that.setData({
          playing: false,
          playTime: 0,
          formatedPlayTime: util.formatTime(0)
        })
      }
    })
    app.globalData.backgroundAudioPlaying = false
  },
  _enableInterval() {
    const that = this
    function update() {
      wx.getBackgroundAudioPlayerState({
        success(res) {
          that.setData({
            playTime: res.currentPosition,
            formatedPlayTime: util.formatTime(res.currentPosition + 1)
          })
        }
      })
    }

    update()
    this.updateInterval = setInterval(update, 500)
  },
  onUnload() {
    clearInterval(this.updateInterval)
  }
})
