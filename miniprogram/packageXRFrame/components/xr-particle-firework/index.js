Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {
    capacity: {
      type: Number,
      value: 20
    },
    emitRate: {
      type: Number,
      value: 5
    },
    lifeTime: {
      type: Number,
      value: 3
    }
  },
  data: {
    loaded: false
  },
  lifetimes: {},
  methods: {
    handleReady({ detail }) {
      const xrScene = this.scene = detail.value
      console.log('xr-scene', xrScene)
      const xrFrameSystem = wx.getXrFrameSystem()

      const fireworkField = xrScene.getElementById('firework')
      const tempSystem = fireworkField.getComponent(xrFrameSystem.Particle)
      tempSystem.addSizeGradient(0, 0.2)
      tempSystem.addSizeGradient(3, 0.5)

      let myData = {}
      myData = {
        capacity: 200,
        emitRate: 0, // 子发射器不进行每秒发射
        burstCount: 200, // 一次爆发200粒子
        burstTime: 0, // 爆发延时为0
        burstCycle: 1, // 发射一次
        size: [0.05],
        startColor: [1, 1, 0, 1],
        endColor: [1, 0, 0, 0],
        emitterType: 'SphereShape',
        emitterProps: [['radius', '0.8']],
        lifeTime: [3], // 粒子生命周期为3秒
        stopDuration: [3], // 子发射器生命周期为3秒
        speed: [1],
        texture: 'particle-texture'
      }

      const subEmitter = tempSystem.createSubEmitter(myData)

      subEmitter.state = 1 // 设置为1为当粒子消失后出现作用子发射器
      // 可以规定多个子发射器的阵列
      tempSystem.subEmitters = [subEmitter]
    },

    handleAssetsProgress({ detail }) {
      console.log('assets progress', detail.value)
    },
    handleAssetsLoaded({ detail }) {
      console.log('assets loaded', detail.value)
      this.setData({ loaded: true })
    }
  }
})
