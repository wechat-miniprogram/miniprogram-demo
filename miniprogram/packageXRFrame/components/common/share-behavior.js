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

      if (!this.scene.share.supported) {
        console.warn('Not support xr-frame share system now!');
        return;
      }

      this.sharing = false;
      wx.xrScene = this.scene;
      // this.scene.event.add('touchstart', (target) => {
      //   if (this.sharing || !target.changedTouches) {
      //     return;
      //   }

      //   const touch = target.changedTouches[0];
      //   if (!touch) {
      //     return;
      //   }

      //   if (touch.x / this.scene.frameWidth > 0.9 && touch.y / this.scene.frameHeight > 0.9) {
      //     this.sharing = true;
      //     this.scene.share.captureToFriends().then(() => {
      //       this.sharing = false;
      //     });
      //   }
      // });
    }
  }
})