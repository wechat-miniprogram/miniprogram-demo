Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {
    loaded: false
  },
  lifetimes: {},
  methods: {
    handleReady({detail}) {
      const xrScene = this.scene = detail.value;
      console.log('xr-scene', xrScene);
    },
    handleAssetsProgress: function({detail}) {
      this.triggerEvent('assetsProgress', detail.value);
    },
    handleAssetsLoaded: function({detail}) {
      this.triggerEvent('assetsLoaded', detail.value);
    },
    handleRaf: function({detail}) {
      console.log('raf', detail.value);
    }
  }
})