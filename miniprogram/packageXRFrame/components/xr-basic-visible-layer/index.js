Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {
    visibleIndex: {
      type: Number,
      value: 1,
      observer: function (newVal, oldVal) {
        
      }
    },
    cullMask: {
      type: Number,
      value: 0b001,
      observer: function (newVal, oldVal) {
        
      }
    }
  },
  data: {
    loaded: false
  },
  lifetimes: {},
  methods: {
    handleReady({detail}) {
      const xrScene = this.scene = detail.value;
      console.log('xr-scene', xrScene);
    },
    handleAssetsProgress: function({detail}) {
      console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function({detail}) {
      console.log('assets loaded', detail.value);
      this.setData({loaded: true});
    }
  }
})