Component({
  behaviors: [require('../common/share-behavior').default],
  data: {
    loaded: false,
    arReady: false,
    trackerReady: false,
    syncNumber: 0,
    syncStr: '',
    syncList: [],
    syncBoxSize: 0.2
  },
  infoInited: false,
  methods: {
    handleReady({ detail }) {
      const xrScene = this.scene = detail.value
      xrScene.event.add('tick', this.handleTick.bind(this))
      console.log('xr-scene', xrScene)

      // 同步点信息
      const syncNumber = 8

      let syncStr = ''
      const syncList = []

      for (let i = 0; i < syncNumber; i++) {
        const colorFloat = i / 8
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
    handleInfoInit() {
      this.infoInited = true

      console.log('handleInfoInit')
    },
    handleTick() {
      const xrSystem = wx.getXrFrameSystem()

      if (this.data.arReady && this.data.loaded && this.data.trackerReady && !this.infoInited) {
        this.handleInfoInit()
      }

      const trackerEl = this.scene.getElementById('tracker-1')
      if (!trackerEl) {
        return
      }

      const tracker = trackerEl.getComponent(xrSystem.ARTracker)
      if (!tracker.arActive) {
        return
      }

      // 这里只是例子，实际上用的是`ARTracker`的`autoSync`属性。
      // 但也是一个更高自由度的选项。
      // 视情况需要自己同步`tracker`的`scale`和`rotation`特定节点。
      // 第一个参数是特征点编好，第二个是可选的复用结果，第三个是可选的是否相对于`ARTracker`。
      // 为`false`为世界空间的位置，需要配合`scale`自己使用
      const position = tracker.getPosition(98, new xrSystem.Vector3(), false)
    }
  }
})
