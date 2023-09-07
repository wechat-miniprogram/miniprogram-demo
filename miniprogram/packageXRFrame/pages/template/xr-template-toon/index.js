var sceneReadyBehavior = require('../../behavior-scene/scene-ready');

// 加载toonEffect
import '../../../xr-custom/assets/effect-toon';

Page({
  behaviors:[sceneReadyBehavior],
  data: {
    dpiScale: 1
  }
});
