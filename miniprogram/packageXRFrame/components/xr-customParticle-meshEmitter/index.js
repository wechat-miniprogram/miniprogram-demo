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
    },

    handleAssetsProgress({ detail }) {
      console.log('assets progress', detail.value)
    },
    handleAssetsLoaded({ detail }) {
      console.log('assets loaded', detail.value)
      this.setData({ loaded: true })
      this.setMeshRender()
    },
    async setMeshRender() {
      const xrFrameSystem = wx.getXrFrameSystem()
      const magicField = this.scene.getElementById('magicField')
      const tempSystem = magicField.getComponent('custom-particle')

      tempSystem.addSizeGradient(0, 0.7)
      tempSystem.addSizeGradient(0.5, 1.0)
      tempSystem.addColorGradient(0, xrFrameSystem.Vector4.createFromNumber(1, 0.89, 0.27, 1))
      tempSystem.addColorGradient(1, xrFrameSystem.Vector4.createFromNumber(1, 0.64, 0, 1))
      tempSystem.addAlphaGradient(0, 0, 0)
      tempSystem.addAlphaGradient(0.5, 1, 1)
      tempSystem.addAlphaGradient(1, 0, 0)
    }
  }
})
