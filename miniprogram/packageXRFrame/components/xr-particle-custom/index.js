import cont from './earring'

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
      const particle = xrScene.getElementById('human-face')
      // // 来自图片数据的二元数组content
      const content = cont
      // // 影响画作的大小与粒子疏密程度的因子
      const step = 0.02
      const height = Math.floor(step * content.length)
      // 设置箱型发射器的发射方向，与粒子初始位置范围
      particle.getComponent(xrFrameSystem.Particle).createBoxEmitter(
        xrFrameSystem.Vector3.createFromNumber(1.0, 0.0, 0),
        xrFrameSystem.Vector3.createFromNumber(1.0, 0.0, 0),
        xrFrameSystem.Vector3.createFromNumber(0, 0, 0.5),
        xrFrameSystem.Vector3.createFromNumber(0, height, 0.0)
      )
      // 实现发射器的自定义粒子运作接口
      particle.getComponent(xrFrameSystem.Particle).particleEmitter.processInstance = (instance, deltaTime) => {
        const contentTemp = content
        const cellNumY = contentTemp.length
        const cellNumX = contentTemp[0].length
        const width = Math.floor(step * cellNumX)
        if (instance.position.x - instance.particleSystem.emitterPosition.x > width) {
          instance.age = instance.lifeTime
          return
        }
        instance.age = 0
        const posX = Math.floor((instance.position.x - instance.particleSystem.emitterPosition.x) / step)
        const posY = Math.floor(instance.position.y / step)
        const speed = contentTemp[cellNumY - 1 - posY][posX] * 0.97
        instance.position.x += (1 - speed * 0.97) * 0.03 + Math.random() * 0.007
        instance.color.w = speed * 0.3
      }
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
