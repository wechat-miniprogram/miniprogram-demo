Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {
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
    },
    handleARReady: function({detail}) {
      console.log('ar-ready', this.scene.ar.arModes, this.scene.ar.arVersion);
    },
    handleARError: function({detail}) {
      console.log('ar-error', detail);
    },
    handleLog: function({detail}) {
      const {el, value} = detail;
      console.log('log', detail.value);
    },
  }
})