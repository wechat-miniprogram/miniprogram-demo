Component({
  properties: {
    behaviors: [require('../common/share-behavior').default],
    a: Number,
  },
  data: {
    loaded: false
  },
  lifetimes: {
    attached() {
      console.log('data.a', this.data.a) // expected 123
    }
  },
  methods: {
    handleReady({ detail }) {
      this.scene = detail.value
      console.log('scene', detail.value)
    },
    handleAssetsProgress({ detail }) {
      console.log('assets progress', detail.value)
    },
    handleAssetsLoaded({ detail }) {
      console.log('assets loaded', detail.value)
      this.setData({ loaded: true })
    },
    handleRaf({ detail }) {
      console.log('raf', detail.value)
    }
  }
})
