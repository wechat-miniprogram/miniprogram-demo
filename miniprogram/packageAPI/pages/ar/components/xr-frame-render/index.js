Component({
  behaviors: [],
  properties: {
  },
  data: {
    renderTargetWidth: 0,
    renderTargetHeight: 0,
    pixelRatioReady: false,
  },
  lifetimes: {},
  methods: {
    handleReady({ detail }) {
      const xrScene = this.scene = detail.value
      console.log('xr-scene', xrScene)

      const camera = this.scene.getElementById('camera').getComponent('camera')

      // 暴露scene对象到外部进行定制
      this.triggerEvent('sceneReady', { scene: xrScene, camera })
    },
  }
})
