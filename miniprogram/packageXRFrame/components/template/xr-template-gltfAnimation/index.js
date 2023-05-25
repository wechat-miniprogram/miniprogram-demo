Component({
  behaviors: [require('../../common/share-behavior').default],
  properties: {
    a: Number,
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
    },

    handleGLTFLoaded({ detail }) {
      const xrFrameSystem = wx.getXrFrameSystem();

      const wrapElement = this.scene.getElementById("wrap");
      this.wrapTRS = wrapElement.getComponent(xrFrameSystem.Transform);
      const gltfElement = this.scene.getElementById("gltf");
      this.gltfTRS = gltfElement.getComponent(xrFrameSystem.Transform);
      this.editGLTF = gltfElement.getComponent(xrFrameSystem.GLTF);

      console.log(this.wrapTRS, this.gltfTRS)

      // Birds
      const brid = this.editGLTF.getInternalNodeByName("Birds");
      this.bridTRS = brid.getComponent(xrFrameSystem.Transform);

      // TurtleAndCastle
      const turtle = this.editGLTF.getInternalNodeByName("TurtleAndCastle");
      this.turtleTRS = turtle.getComponent(xrFrameSystem.Transform);

      // 都用四元数
      this.rotation = this.turtleTRS.quaternion.toEulerAngles();

      this.scene.event.add('tick', this.handleTick.bind(this));
    },

    handleTick: function (time) {
      const xrSystem = wx.getXrFrameSystem();

      this.wrapTRS.position.x -= 0.002;
      // this.wrapTRS.rotation.y += Math.PI * 0.0001;

      // 比例尺不一样，需要放大改变数值
      this.bridTRS.position.x += 1;
      this.bridTRS.position.y += Math.random() * 4 - 2;

      // 欧拉角直接设置有误 v2.31.0
      // this.turtleTRS.rotation.y += Math.PI * 0.0004;

      // 目前使用四元数兼容
      this.rotation.y += Math.PI * 0.0004;
      xrSystem.Quaternion.fromEulerAngles(this.rotation, this.turtleTRS.quaternion);

    }
  }
})