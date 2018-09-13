const sourceType = [['camera'], ['album'], ['camera', 'album']]
const camera = [['front'], ['back'], ['front', 'back']]

// eslint-disable-next-line
const duration = Array.apply(null, {length: 60}).map(function (n, i) {
  return i + 1
})

Page({
  onShareAppMessage() {
    return {
      title: '拍摄/选择视频',
      path: 'page/API/pages/video/video'
    }
  },

  data: {
    sourceTypeIndex: 2,
    sourceType: ['拍摄', '相册', '拍摄或相册'],

    cameraIndex: 2,
    camera: ['前置', '后置', '前置或后置'],

    durationIndex: 59,
    duration: duration.map(function (t) { return t + '秒' }),

    src: ''
  },
  sourceTypeChange(e) {
    this.setData({
      sourceTypeIndex: e.detail.value
    })
  },
  cameraChange(e) {
    this.setData({
      cameraIndex: e.detail.value
    })
  },
  durationChange(e) {
    this.setData({
      durationIndex: e.detail.value
    })
  },
  chooseVideo() {
    const that = this
    wx.chooseVideo({
      sourceType: sourceType[this.data.sourceTypeIndex],
      camera: camera[this.data.cameraIndex],
      maxDuration: duration[this.data.durationIndex],
      success(res) {
        that.setData({
          src: res.tempFilePath
        })
      }
    })
  }
})
