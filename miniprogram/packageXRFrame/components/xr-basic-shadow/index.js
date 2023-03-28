Component({
  behaviors: [require('../common/share-behavior').default],
  shadowRoot: null,
  gltfModle: null,
  properties: {
    meshCount: {
      type: Number,
      value: 0,
      observer: function(newVal, oldVal) {
        if (newVal > oldVal) {
          this.addOne();
        } else if (newVal < oldVal) {
          this.removeOne();
        }
      }
    }
  },
  data: {
    loaded: false,
    arReady: false
  },
  methods: {
    async handleReady({detail}) {
      const scene = this.scene = detail.value;
      console.log('xr-scene', scene);
      this.meshList = [];
      const xrFrameSystem = wx.getXrFrameSystem()
      this.shadowRoot = scene.getElementById('shadow-root');

      const {value: envData} = await scene.assets.loadAsset({type: 'env-data', assetId: 'env1', src: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/env-test.bin'});
      const envElement = scene.createElement(xrFrameSystem.XREnv);
      this.shadowRoot.addChild(envElement);
      const envComp = envElement.getComponent(xrFrameSystem.Env);
      envComp.setData({envData: envData});

      const {value: model} = await scene.assets.loadAsset({type: 'gltf', assetId: 'damage-helmet', src: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/damage-helmet/index.glb'});
      this.gltfModle = model;
      const gltfElement = scene.createElement(xrFrameSystem.XRGLTF);
      this.shadowRoot.addChild(gltfElement);
      const gltfComp = gltfElement.getComponent(xrFrameSystem.GLTF);
      gltfComp.setData({model: model});

      const cameraElement = scene.createElement(xrFrameSystem.XRCamera);
      this.shadowRoot.addChild(cameraElement);
      cameraElement.getComponent(xrFrameSystem.Transform).position.setValue(0, 0, 9);
      cameraElement.getComponent(xrFrameSystem.Camera).setData({
        target: gltfElement.getComponent(xrFrameSystem.Transform),
        background: 'skybox'
      });
      cameraElement.addComponent(xrFrameSystem.CameraOrbitControl, {});
    },
    addOne() {
      const xrFrameSystem = wx.getXrFrameSystem()
      const pos = [Math.random(), Math.random(), Math.random()].map(v => (v * 2 - 1) * 6);

      const gltfElement = this.scene.createElement(xrFrameSystem.XRGLTF);
      this.shadowRoot.addChild(gltfElement);
      gltfElement.getComponent(xrFrameSystem.Transform).position.setArray(pos);
      gltfElement.getComponent(xrFrameSystem.GLTF).setData({model: this.gltfModle});

      this.meshList.push(gltfElement);
    },
    removeOne() {
      const element = this.meshList.pop();
      if (element) {
        this.shadowRoot.removeChild(element);
      }
    },
    handleTick: function({detail}) {
      const {el, value} = detail;
    },
    handleDesotry() {

    },
  }
})