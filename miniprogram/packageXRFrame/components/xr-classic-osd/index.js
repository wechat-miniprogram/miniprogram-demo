Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {
    markerImg: {
      type: String
    },
  },
  data: {
    loaded: false,
    arReady: false,
    toyReady: false,
    gzDayReady: false,
    gzNightReady: false,
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
    },
    handleToySwitch({ detail }) {
      const active = detail.value
      if (active) {
        this.setData({ toyReady: true })
      } else {
        this.setData({ toyReady: false })
      }
    },
    handleDaySwitch({ detail }) {
      const active = detail.value
      if (active) {
        this.setData({ gzDayReady: true })
      } else {
        this.setData({ gzDayReady: false })
      }
    },
    handleNightSwitch({ detail }) {
      const active = detail.value
      if (active) {
        this.setData({ gzNightReady: true })
      } else {
        this.setData({ gzNightReady: false })
      }
    }
  }
})
