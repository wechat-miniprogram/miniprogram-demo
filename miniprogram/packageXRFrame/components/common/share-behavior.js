export default Behavior({
  created: function () {
    this.checkInitShare();
  },
  methods: {
    checkInitShare() {
      wx.xrScene = undefined;

      if (!this.scene) {
        setTimeout(() => {
          this.checkInitShare()
        }, 100);
        return;
      }

      if (this.scene.ar) {
        if (this.scene.ar.ready) {
          this.initARTrackerState(this.scene);    
        } else { 
          this.scene.event.add('ar-ready', () => this.initARTrackerState(this.scene));
        }
      }

      if (!this.scene.share.supported) {
        console.warn('Not support xr-frame share system now!');
        return;
      }

      this.sharing = false;
      wx.xrScene = this.scene;
    },
    initARTrackerState(scene) {
      const xrFrameSystem = wx.getXrFrameSystem();
      scene.dfs(() => {}, undefined, true, el => {
        const comp = el.getComponent(xrFrameSystem.ARTracker);
        if (comp) {
          if (typeof comp.state === 'number') {
            this.triggerEvent('arTrackerState', {state: comp.state, error: comp.errorMessage});
            el.event.add('ar-tracker-state', tracker => {
              this.triggerEvent('arTrackerState', {state: tracker.state, error: tracker.errorMessage});
            });
          }
          return true;
        }
      });
    }
  }
})