Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {
    a: Number,
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
    handleReady({detail}) {
      const xrScene = this.scene = detail.value;
      this.mat = new (wx.getXrFrameSystem().Matrix4)();
      console.log('xr-scene', xrScene);
    },
    handleAssetsProgress: function({detail}) {
      console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function({detail}) {
      console.log('assets loaded', detail.value);
      // this.setData({loaded: true});
      this.scene.event.addOnce('touchstart', this.placeNode.bind(this));
    },
    handleARReady: function({detail}) {
      console.log('arReady', this.scene.ar.arVersion);
    },
    placeNode(event) {
      const {clientX, clientY} = event.touches[0];
      const {frameWidth: width, frameHeight: height} = this.scene;

      if (clientY / height > 0.8 && clientX / width < 0.2) {
        this.scene.getNodeById('setitem').visible = false;
        this.scene.ar.resetPlane();
      } else {
        this.scene.ar.placeHere('setitem', true);
      }

      this.scene.event.addOnce('touchstart', this.placeNode.bind(this));
    }
  }
})