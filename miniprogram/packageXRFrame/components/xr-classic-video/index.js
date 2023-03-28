Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {},
  data: {
    loaded: false,
    arReady: false,
  },
  lifetimes: {
    async attached() {
      console.log('data', this.data);
    }
  },
  methods: {
    handleReady: function ({detail}) {
      const xrScene = this.scene = detail.value;
      console.log('xr-scene', xrScene);
    },
    handleAssetsProgress: function ({detail}) {
      console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function ({detail}) {
      console.log('assets loaded', detail.value);
      this.setData({
        loaded: true
      });
    },
    handleTrackerSwitch: function ({detail}) {
      const active = detail.value;
      console.log('handleTrackerSwitch', detail);
      const video = this.scene.assets.getAsset('video-texture', 'hikari');
      if (active) {
        video.play();
      } else {
        video.stop();
      }
    }
  }
})