const STATE = {
  NONE: -1,
  MOVE: 0,
  ZOOM_OR_PAN: 1
}

Component({
  behaviors: [require('../../common/share-behavior').default],
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
      console.log('xr-scene', xrScene);
    },
    handleAssetsProgress: function({detail}) {
      console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function({detail}) {
      console.log('assets loaded', detail.value);
      // this.setData({loaded: true});
      this.placedFlag = false;
      this.scene.event.addOnce('touchstart', this.placeNode.bind(this));
    },
    handleARReady: function({detail}) {
      console.log('arReady', this.scene.ar.arVersion);
    },
    placeNode(event) {
      if (this.placedFlag) {
        return;
      }
      const xrFrameSystem = wx.getXrFrameSystem()
      this.placedFlag = true;
      this.scene.ar.placeHere('setitem', true)
      const anchorTRS = this.scene.getElementById('anchor').getComponent(xrFrameSystem.Transform)
      anchorTRS.setData({ visible: false })
      anchorTRS.scale.x = 0
      anchorTRS.scale.y = 0
      anchorTRS.scale.z = 0
      wx.setKeepScreenOn({ keepScreenOn: true })
    }
  }
})