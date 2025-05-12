Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {
    loaded: false
  },
  lifetimes: {},
  methods: {
    handleReady({ detail }) {
      const xrScene = this.scene = detail.value
      console.log('xr-scene', xrScene)
    },
    handleAssetsProgress({ detail }) {
      this.triggerEvent('assetsProgress', detail.value)
    },
    handleAssetsLoaded({ detail }) {
      this.triggerEvent('assetsLoaded', detail.value)
    },
    handleRaf({ detail }) {
      console.log('raf', detail.value)
    }
  }
})
