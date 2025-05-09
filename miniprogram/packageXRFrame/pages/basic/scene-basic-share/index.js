const sceneReadyBehavior = require('../../behavior-scene/scene-ready')

Page({
  behaviors: [sceneReadyBehavior],
  data: {
    captureState: 0,
    recordState: 0,
    captureQuality: 0.8,
    captureType: 'jpg',
    recordFPS: 30,
    recordScale: 1,
    recordWidth: 0,
    recordHeight: 0,
    recordBPS: 1000,
    sceneWidth: 0,
    sceneHeight: 0
  },
  handleReady({ detail }) {
    this.setData({
      sceneWidth: detail.width,
      sceneHeight: detail.height,
      recordWidth: detail.width,
      recordHeight: detail.height,
    })
  },
  changeCaptureState(e) {
    if (this.data.recordState) {
      wx.showToast({
        title: '录屏中不允许！',
      })
      return
    }

    if (this.data.captureState) {
      wx.showToast({
        title: '等待上次完成！',
      })
      return
    }

    this.setData({ captureState: 1 })
    // hack，其实应该等待异步方法完成
    setTimeout(() => {
      this.setData({ captureState: 0 })
    }, 1000)
  },
  changeRecordState(e) {
    this.setData({ recordState: this.data.recordState ? 0 : 1 })
  },
  changeCaptureType(e) {
    this.setData({ captureType: e.detail.value })
  },
  changeCaptureQuality(e) {
    this.setData({
      captureQuality: e.detail.value
    })
  },
  changeRecordFPS(e) {
    this.setData({
      recordFPS: e.detail.value
    })
  },
  changeRecordBPS(e) {
    this.setData({
      recordBPS: e.detail.value
    })
  },
  changeRecordScale(e) {
    const scale = e.detail.value
    this.setData({
      recordScale: scale,
      recordWidth: ~~(this.data.sceneWidth * scale),
      recordHeight: ~~(this.data.sceneHeight * scale),
    })
  }
})
