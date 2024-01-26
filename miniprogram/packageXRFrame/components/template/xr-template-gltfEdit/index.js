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
      this.setBallon();
    },
    async setBallon() {
      const scene = this.scene;
      const xrSystem = wx.getXrFrameSystem();

      // 替换贴图
      const ballonElm = this.scene.getElementById('ballon');
      const ballonGLTF = ballonElm.getComponent(xrSystem.GLTF);
      const textureAsset = await scene.assets.loadAsset({
        type: 'texture',
        assetId: `texture-1`,
        src: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/waifu.png',
      });
      for(const mesh of ballonGLTF.meshes) {
        console.log('textureAsset', textureAsset.value);
        mesh.material.setTexture('u_baseColorMap', textureAsset.value);
      }

      // 替换状态
      const ballonBlendElm = this.scene.getElementById('ballonBlend');
      const ballonBlendGLTF = ballonBlendElm.getComponent(xrSystem.GLTF);
      for(const mesh of ballonBlendGLTF.meshes) {
        // 清理模型金属度
        mesh.material.setVector('u_specularFactor', xrSystem.Vector3.createFromNumber(0, 0, 0));

        // 通过alphaMode 的 Setter 设置，或者写入renderState，但需要手动控制宏
        mesh.material.alphaMode = "BLEND";
        mesh.material.setVector('u_baseColorFactor', xrSystem.Vector4.createFromNumber(0, 0.5, 0, 0.5));
      }

    }
  }
})