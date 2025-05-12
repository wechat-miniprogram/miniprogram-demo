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
    handleReady({ detail }) {
      const xrScene = this.scene = detail.value
      console.log('xr-saaacene', xrScene)
    },
    handleAssetsProgress({ detail }) {
      console.log('assets progress', detail.value)
    },
    handleAssetsLoaded({ detail }) {
      console.log('assets loaded', detail.value)

      // 延时保证 glTF 解析完毕
      setTimeout(() => {
        this.setToon()
      }, 200)
    },
    setToon() {
      const scene = this.scene
      const xrFrameSystem = wx.getXrFrameSystem()

      const gltfElement = scene.getElementById('gltf')
      const gltf = gltfElement.getComponent(xrFrameSystem.GLTF)

      console.log('custom-pbr gltf', gltf)

      for (const mesh of gltf.meshes) {
        console.log('custom-pbr mesh material', mesh.material)

        console.log('custom-pbr effect', scene.assets.getAsset('effect', 'custom-pbr'))

        const pbrMaterial = scene.createMaterial(
          // 使用定制的效果
          scene.assets.getAsset('effect', 'custom-pbr'),
          {
            u_brdfLUT: mesh.material.getTexture('u_brdfLUT'),
            u_baseColorMap: mesh.material.getTexture('u_baseColorMap'),
            u_metallicRoughnessMap: mesh.material.getTexture('u_metallicRoughnessMap'),
            u_normalMap: mesh.material.getTexture('u_normalMap'),
            u_emissiveMap: mesh.material.getTexture('u_emissiveMap'),
            u_emissiveFactor: mesh.material.getTexture('u_emissiveFactor'),
            u_occlusionMap: mesh.material.getTexture('u_occlusionMap'),
            u_clearcoatMap: mesh.material.getTexture('u_clearcoatMap'),
            u_specularGlossinessMap: mesh.material.getTexture('u_specularGlossinessMap'),
            u_transmissionMap: mesh.material.getTexture('u_transmissionMap'),
            u_sheenColorMap: mesh.material.getTexture('u_sheenColorMap'),
            u_metallicMap: mesh.material.getTexture('u_metallicMap'),
            u_roughnessMap: mesh.material.getTexture('u_roughnessMap'),
            u_clearcoatRoughnessMap: mesh.material.getTexture('u_clearcoatRoughnessMap'),
            u_clearcoatNormalMap: mesh.material.getTexture('u_clearcoatNormalMap'),
            u_sheenRoughnessMap: mesh.material.getTexture('u_sheenRoughnessMap'),
            u_specularEnvMapMat: mesh.material.getTexture('u_specularEnvMapMat'),
          }
        )

        console.log('custom-pbr material', pbrMaterial)
        mesh.material = pbrMaterial
      }
    }
  }
})
