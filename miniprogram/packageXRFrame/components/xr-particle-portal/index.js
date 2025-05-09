Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {
    capacity: {
      type: Number,
      value: 20
    },
    emitRate: {
      type: Number,
      value: 5
    },
    lifeTime: {
      type: Number,
      value: 3
    }
  },
  data: {
    loaded: false
  },
  lifetimes: {},
  methods: {
    handleReady({ detail }) {
      const xrScene = this.scene = detail.value
      console.log('xr-scene', xrScene)
      const xrFrameSystem = wx.getXrFrameSystem()

      const portal = xrScene.getElementById('portal')
      const tempSystem = portal.getComponent(xrFrameSystem.Particle)
      tempSystem.addSizeGradient(0, 1, 1)
      tempSystem.addSizeGradient(0.5, 0.8, 0.8)
      tempSystem.addSizeGradient(0.75, 0.5, 0.5)
      tempSystem.addSizeGradient(0.9, 0.2, 0.2)
      tempSystem.addSizeGradient(1, 0, 0)
    },

    handleAssetsProgress({ detail }) {
      console.log('assets progress', detail.value)
    },
    handleAssetsLoaded({ detail }) {
      console.log('assets loaded', detail.value)
      this.setData({ loaded: true })
    }
  }
})
