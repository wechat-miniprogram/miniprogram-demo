// 加载toonEffect
import '../../../xr-custom/assets/effect-toon'

const sceneReadyBehavior = require('../../behavior-scene/scene-ready')

Page({
  behaviors: [sceneReadyBehavior],
  data: {
    dpiScale: 1
  }
})
