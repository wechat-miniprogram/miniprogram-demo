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
      const xrSystem = wx.getXrFrameSystem();

      this.mat = new (xrSystem.Matrix4)();
      console.log('xr-scene', xrScene);
      const { width, height } = this.scene


      this.cameraTrs = this.scene.getElementById('camera').getComponent(xrSystem.Transform);
      
      this.leftTRS = this.scene.getElementById('l').getComponent(xrSystem.Transform);
      this.rightTRS = this.scene.getElementById('r').getComponent(xrSystem.Transform);
      this.frontTRS = this.scene.getElementById('f').getComponent(xrSystem.Transform);
      this.backTRS = this.scene.getElementById('b').getComponent(xrSystem.Transform);

      this.FACING = xrSystem.Vector3.createFromNumber(0, 0, 0);
      this.UP = xrSystem.Vector3.createFromNumber(0, 1, 0);


      xrScene.event.add('tick', this.handleTick.bind(this));
    },
    handleTick: function () {
      const xrSystem = wx.getXrFrameSystem();

      if (this.leftTRS) {
        console.log()
        const quaternion = this.leftTRS.quaternion;
        // 算出从物体到相机的向量
        this.FACING.set(this.cameraTrs.position).sub(this.leftTRS.position, this.FACING);
        xrSystem.Quaternion.lookRotation(this.FACING, this.UP, quaternion);
      }
      if (this.rightTRS) {
        const quaternion = this.rightTRS.quaternion;
        // 算出从物体到相机的向量
        this.FACING.set(this.cameraTrs.position).sub(this.rightTRS.position, this.FACING);
        xrSystem.Quaternion.lookRotation(this.FACING, this.UP, quaternion);
      }
      if (this.frontTRS) {
        const quaternion = this.frontTRS.quaternion;
        // // 算出从物体到相机的向量
        this.FACING.set(this.cameraTrs.position).sub(this.frontTRS.position, this.FACING);
        xrSystem.Quaternion.lookRotation(this.FACING, this.UP, quaternion);
      }
      if (this.backTRS) {
        const quaternion = this.backTRS.quaternion;
        // 算出从物体到相机的向量
        this.FACING.set(this.cameraTrs.position).sub(this.backTRS.position, this.FACING);
        xrSystem.Quaternion.lookRotation(this.FACING, this.UP, quaternion);
      }
    },
  }
})