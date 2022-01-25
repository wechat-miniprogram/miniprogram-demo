
Page({
  onShareAppMessage() {
    return {
      title: '音视频合成',
      path: 'packageAPI/pages/media/media-container/media-container'
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
    const canIUse = wx.canIUse('wx.createMediaContainer()')
    if (canIUse) {
      this.mediaContainer = wx.createMediaContainer()
    } else {
      this.setData({
        canIUse: false,
      })
      wx.showModal({
        title: '微信版本过低，暂不支持本功能',
      })
    }
  },
  data: {
    theme: 'light',
    targetSrc: '',
    one: '',
    two: '',
    canIUse: true,
  },
  handleChooseVideo(e) {
    const that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res.tempFilePath)
        that.setData({
          [e.currentTarget.dataset.video]: res.tempFilePath
        })
        if (e.currentTarget.dataset.video === 'one') {
          that.mediaContainer.extractDataSource({
            source: that.data.one,
            success(mt) {
              that.mediaTrackOne = mt
            }
          })
        } else {
          that.mediaContainer.extractDataSource({
            source: that.data.two,
            success(mt) {
              that.mediaTrackTwo = mt
            }
          })
        }
      }
    })
  },
  handleExport() {
    if (this.data.one === '' || this.data.two === '') {
      wx.showToast({
        title: '请先选择源视频',
        icon: 'none'
      })
    } else {
      console.log(this.mediaTrackOne, this.mediaTrackTwo)
      // 获取源视频 1 的视频轨道
      const [trackMedia] = this.mediaTrackOne.tracks.filter(item => item.kind === 'video')
      // 获取源视频 2 的音频轨道
      const [trackAudio] = this.mediaTrackTwo.tracks.filter(item => item.kind === 'audio')
      console.log(trackMedia, trackAudio)
      // 添加轨道到目标容器
      this.mediaContainer.addTrack(
        trackMedia
      )
      this.mediaContainer.addTrack(
        trackAudio
      )
      const that = this
      // 合成目标视频
      this.mediaContainer.export({
        success: (res) => {
          that.setData({
            targetSrc: res.tempFilePath
          })
        }
      })
    }
  }
})
