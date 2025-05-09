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
    handleReady({
      detail
    }) {
      const xrScene = this.scene = detail.value
      console.log('xr-scene', xrScene)
      const xrFrameSystem = wx.getXrFrameSystem()

      // orb vfx
      const orb = xrScene.getElementById('orb')
      let tempSystem = orb.getComponent(xrFrameSystem.Particle)
      tempSystem.addAlphaGradient(0, 0, 0)
      tempSystem.addAlphaGradient(0.5, 1, 1)
      tempSystem.addAlphaGradient(1, 0, 0)
      tempSystem.addSizeGradient(0, 1, 1)
      tempSystem.addSizeGradient(1, 0, 0)

      // orbline vfx
      const orbLine = xrScene.getElementById('orbLine')
      tempSystem = orbLine.getComponent(xrFrameSystem.Particle)
      tempSystem.addColorGradient(0, xrFrameSystem.Vector4.createFromNumber(1, 1, 0, 1))
      tempSystem.addColorGradient(1, xrFrameSystem.Vector4.createFromNumber(1, 0.68, 0, 1))
      tempSystem.addAlphaGradient(0, 0, 0)
      tempSystem.addAlphaGradient(0.5, 1, 1)
      tempSystem.addAlphaGradient(1, 0, 0)
      tempSystem.addSizeGradient(0, 1, 1)
      tempSystem.addSizeGradient(1, 0, 0)
    },

    handleAssetsProgress({
      detail
    }) {
      console.log('assets progress', detail.value)
    },
    handleAssetsLoaded({
      detail
    }) {
      console.log('assets loaded', detail.value)
      this.setData({
        loaded: true
      })
    }
  }
})
