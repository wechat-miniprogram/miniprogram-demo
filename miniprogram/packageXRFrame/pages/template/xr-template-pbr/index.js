var sceneReadyBehavior = require('../../behavior-scene/scene-ready');

// 加载toonEffect
import '../../../xr-custom/assets/standard-shader/customPBR';

Page({
  behaviors:[sceneReadyBehavior],
  data: {
    dpiScale: 1
  }
});
