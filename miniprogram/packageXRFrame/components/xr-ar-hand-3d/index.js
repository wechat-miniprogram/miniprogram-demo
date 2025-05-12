Component({
  behaviors: [require('../common/share-behavior').default],
  data: {
    loaded: false,
    arReady: false,
    trackerReady: false,
    syncNumber: 0,
    syncStr: '',
    syncList: [],
    syncBoxSize: 0.006
  },
  methods: {
    handleReady({ detail }) {
      const xrScene = this.scene = detail.value
      xrScene.event.add('tick', this.handleTick.bind(this))
      console.log('xr-scene', xrScene)

      // 同步点信息
      const syncNumber = 16

      let syncStr = ''
      const syncList = []

      for (let i = 0; i <= syncNumber; i++) {
        const colorFloat = i / 16
        const colorR = 1.0 - colorFloat
        syncStr += ` ${i}`
        syncList.push(`1.0 ${colorR} ${colorR} 1.0`)
      }

      this.setData({
        trackerReady: true,
        syncNumber,
        syncStr,
        syncList
      })
    },
    handleAssetsProgress({ detail }) {
      console.log('assets progress', detail.value)
    },
    handleAssetsLoaded({ detail }) {
      console.log('assets loaded', detail.value)
      this.setData({ loaded: true })
    },
    handleARReady({ detail }) {
      console.log('arReady')
      this.setData({ arReady: true })
    },
    handleTick() {
      const xrSystem = wx.getXrFrameSystem()
      const trackerEl = this.scene.getElementById('tracker')
      if (!trackerEl) {
        return
      }

      const tracker = trackerEl.getComponent(xrSystem.ARTracker)
      if (!tracker.arActive) {

      }
    }
  }
})
