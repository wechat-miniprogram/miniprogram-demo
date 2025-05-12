Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {
    cubeAlpha: {
      type: Number,
      value: 1
    },
    sphereAlpha: {
      type: Number,
      value: 1
    },
    clearColor: {
      type: String,
      value: '0 0 0 0'
    }
  },
  lifetimes: {},
  methods: {
    handleReady({ detail }) {
      const xrScene = this.scene = detail.value
      console.log('xr-scene', xrScene)
    }
  }
})
