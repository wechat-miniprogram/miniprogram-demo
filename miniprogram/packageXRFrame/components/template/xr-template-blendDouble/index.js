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
      this.setBlend();
    },
    setBlend() {
      const scene = this.scene;
      const xrSystem = wx.getXrFrameSystem();

      // 替换状态
      const blendElm = this.scene.getElementById('blend');
      const blendGLTF = blendElm.getComponent(xrSystem.GLTF);
      // 延时保证glTF解析完毕
      setTimeout(()=>{
        const frontMesh = blendGLTF.getPrimitivesByMeshName('柱体')[0].primitives[0];
        const frontMat = frontMesh.material;
        // 正面
        // 改变 RenderQueue 先绘制
        frontMat.setRenderState('renderQueue', 2500);
        // 开启剔除，去掉背面
        frontMat.setRenderState('cullOn', true);
        frontMat.setRenderState('cullFace', xrSystem.ECullMode.BACK);

        const backMesh = blendGLTF.getPrimitivesByMeshName('柱体.001')[0].primitives[0];
        const backMat = backMesh.material;
        // 背面
        // 改变 RenderQueue 后绘制
        backMat.setRenderState('renderQueue', 2501);
        // 开启剔除，去掉正面
        backMat.setRenderState('cullOn', true);
        backMat.setRenderState('cullFace', xrSystem.ECullMode.FRONT);


      }, 200);

    }
  }
})