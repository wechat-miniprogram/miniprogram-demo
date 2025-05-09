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

      // 获取屏幕比例，用作后处理rt比例
      const info = wx.getSystemInfoSync()
      const pixelRatio = info.pixelRatio
      this.setData({
        pixelRatioReady: true,
        renderTargetWidth: info.windowWidth * pixelRatio,
        renderTargetHeight: info.windowHeight * pixelRatio,
      })

      const camera = this.scene.getElementById('camera').getComponent('camera')

      // 暴露scene对象到外部进行定制
      this.triggerEvent('sceneReady', { scene: xrScene, camera })
    },
  }
})
