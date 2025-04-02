Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {
  },
  data: {
    loaded: false,
    arReady: false,
  },
  lifetimes: {
    async attached() {
      console.log('data', this.data)
    }
  },
  methods: {
    handleReady({
      detail
    }) {
      const xrScene = this.scene = detail.value
      console.log('xr-scene', xrScene)
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
