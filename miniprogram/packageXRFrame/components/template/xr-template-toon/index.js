

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

      // 延时保证 glTF 解析完毕
      setTimeout(() => {
        this.setToon();        
      }, 200);
    },
    setToon() {
      const scene = this.scene;      
      const xrFrameSystem  = wx.getXrFrameSystem()

      const gltfElement = scene.getElementById("gltf");
      const gltf = gltfElement.getComponent(xrFrameSystem.GLTF);

      console.log('toon gltf', gltf);


      for(const mesh of gltf.meshes) {

        // console.log('toon mesh', mesh)
        console.log('toon mesh material', mesh.material)

        console.log('toon effect', scene.assets.getAsset('effect', 'toon-user'));

        const toonMaterial = scene.createMaterial(
          // 使用定制的效果
          scene.assets.getAsset('effect', 'toon-user'),
          {
            u_baseColorMap: mesh.material.getTexture('u_baseColorMap')
          }
        );

        console.log('toon toonMaterial', toonMaterial);


        // 接管渲染状态
        // toonMaterial.setRenderState('cullFace', xrFrameSystem.ECullMode.BACK);
        toonMaterial.setRenderState('cullOn', false);


        mesh.material = toonMaterial;

      }

    }
  }
})