// 着色器
import dissolveVert from './shaders/dissolveVert'
import dissolveFrag from './shaders/dissolveFrag'

const xrFrameSystem = wx.getXrFrameSystem()

Component({
  behaviors: [require('../../common/share-behavior').default],
  properties: {
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    thresHold: {
      type: Number,
      value: 0,
    },
    autoPlay: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    loaded: false,
  },
  lifetimes: {
    async attached() {
      console.log('data', this.data)
    },
    detached() {
    }
  },
  pageLifetimes: {
    hide() {
    },
    show() {
    }
  },
  methods: {
    handleReady({
      detail
    }) {
      console.log('scene progress', detail.value)
      this.scene = detail.value
      this.camera = this.scene.getElementById('camera')
      this.root = this.scene.getElementById('root')
      this.offset = -0.005
    },

    handleTick(delta) {
      if (this.data.autoPlay) {
        if (this.dissolveMaterial.getFloat('u_threshold') < 0) {
          this.dissolveMaterial.setFloat('u_threshold', 0)
          this.offset = 0.005
        }
        if (this.dissolveMaterial.getFloat('u_threshold') > 1) {
          this.dissolveMaterial.setFloat('u_threshold', 1)
          this.offset = -0.005
        }
        this.dissolveMaterial.setFloat('u_threshold', this.dissolveMaterial.getFloat('u_threshold') + this.offset)
      } else {
        this.dissolveMaterial.setFloat('u_threshold', this.data.thresHold)
      }
    },

    handleAssetsProgress({
      detail
    }) {
      console.log('assets progress', detail.value)
    },

    handleAssetsLoaded({
      detail
    }) {
      console.log('assets loaded', detail.value)
      this.setData({
        loaded: true
      })

      this.dissolveMaterial = this.scene.createMaterial(this.createDissolveEffect(), {
        u_mainTexture: this.scene.assets.getAsset('texture', 'surface_texture1'),
        u_mainTexture2: this.scene.assets.getAsset('texture', 'surface_texture2'),
        u_noiseTexture: this.scene.assets.getAsset('texture', 'noise_texture'),
      })

      const geometryPlane = this.scene.assets.getAsset('geometry', 'plane')
      const planeElem = this.scene.createElement(xrFrameSystem.XRNode, {
        position: '0 0 0',
        scale: '3 3 3',
      })

      //   this.dissolveMaterial.setVector('u_firstColor', xrFrameSystem.Vector4.createFromNumber(1.0, 0.0, 0.0, 1.0));
      //   this.dissolveMaterial.setVector('u_secondColor', xrFrameSystem.Vector4.createFromNumber(0.0, 1.0, 0.0, 1.0));
      planeElem.addComponent(xrFrameSystem.Mesh, {
        geometry: geometryPlane,
        material: this.dissolveMaterial,
      })
      // 加到场上
      this.root.addChild(planeElem)

      // 绑定tick事件
      this.scene.event.add('tick', this.handleTick.bind(this))
    },

    createDissolveEffect() {
      const effect = this.scene.createEffect({
        name: 'dissolveEffect',
        properties: [
          { key: 'u_firstColor', type: xrFrameSystem.EUniformType.FLOAT4, default: [1, 0, 0, 1] },
          { key: 'u_secondColor', type: xrFrameSystem.EUniformType.FLOAT4, default: [0, 1, 0, 1] },
          { key: 'u_threshold', type: xrFrameSystem.EUniformType.FLOAT, default: [0.5] },
          { key: 'u_edgeWidth', type: xrFrameSystem.EUniformType.FLOAT, default: [0.1] },
        ],
        images: [
          {
            key: 'u_mainTexture',
            default: 'white',
            macro: 'WX_USE_BASECOLORMAP'
          },
          {
            key: 'u_mainTexture2',
            default: 'white',
            macro: 'WX_USE_BASECOLORMAP'
          },
          {
            key: 'u_noiseTexture',
            default: 'white',
            macro: 'WX_USE_BASECOLORMAP'
          }
        ],
        defaultRenderQueue: 2000,
        passes: [
          {
            renderStates: {
              cullOn: false,
              blendOn: false,
              depthWrite: true,
              depthTestOn: true,
              cullFace: xrFrameSystem.ECullMode.BACK,
            },
            lightMode: 'ForwardBase',
            useMaterialRenderStates: false,
            shaders: [0, 1]
          }],
        shaders: [
          dissolveVert,
          dissolveFrag,
        ],
      })
      return effect
    },
  }
})
