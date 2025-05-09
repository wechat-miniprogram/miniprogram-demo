Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {
    captureState: {
      type: Number,
      value: 0,
      observer(newVal, oldVal) {
        if (newVal !== oldVal) {
          if (newVal === 1) {
            this.capture()
          }
        }
      },
    },
    recordState: {
      type: Number,
      value: 0,
      observer(newVal, oldVal) {
        if (newVal !== oldVal) {
          if (newVal === 0) {
            this.recordEnd()
          } else {
            this.recordStart()
          }
        }
      }
    },
    captureQuality: {
      type: Number,
      value: 0.8,
    },
    captureType: {
      type: String,
      value: 'jpg',
    },
    recordFPS: {
      type: Number,
      value: 30,
    },
    recordWidth: {
      type: Number,
      value: undefined,
    },
    recordHeight: {
      type: Number,
      value: undefined,
    },
    recordBPS: {
      type: Number,
      value: 1000,
    },
  },
  data: {
    loaded: false
  },
  lifetimes: {},
  methods: {
    handleReady({ detail }) {
      const scene = this.scene = detail.value
      const appHide = () => this.scene.share.recordPause()
      const appShow = () => this.scene.share.recordResume()
      wx.onAppHide(appHide)
      wx.onAppShow(appShow)
      wx.offAppHide(appHide)
      wx.offAppShow(appShow)

      this.triggerEvent('sceneReady', { width: scene.width, height: scene.height })
    },
    capture() {
      this.scene.share.captureToFriends({
        fileType: this.data.captureType,
        quality: this.data.captureQuality
      })
    },
    recordStart() {
      console.log('recordStart')
      this.scene.share.recordStart({
        fps: this.data.recordFPS,
        videoBitsPerSecond: this.data.recordBPS,
        width: this.data.recordWidth,
        height: this.data.recordHeight
      })
    },
    recordEnd() {
      console.log('recordEnd')
      this.scene.share.recordFinishToAlbum()
    }
  }
})
