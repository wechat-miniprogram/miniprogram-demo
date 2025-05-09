// 加载 planeShadow Effect
import '../../../xr-custom/assets/effect-planeShadow'

const sceneReadyBehavior = require('../../behavior-scene/scene-ready')

Page({
  behaviors: [sceneReadyBehavior],
  data: {
    dpiScale: 1
  }
})
