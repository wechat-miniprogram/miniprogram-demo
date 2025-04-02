// 加载toonEffect
import '../../../xr-custom/assets/standard-shader/customPBR'

const sceneReadyBehavior = require('../../behavior-scene/scene-ready')

Page({
  behaviors: [sceneReadyBehavior],
  data: {
    dpiScale: 1
  }
})
