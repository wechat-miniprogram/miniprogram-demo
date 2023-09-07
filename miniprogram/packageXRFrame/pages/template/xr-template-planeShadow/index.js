var sceneReadyBehavior = require('../../behavior-scene/scene-ready');

// 加载 planeShadow Effect
import '../../../xr-custom/assets/effect-planeShadow';

Page({
  behaviors:[sceneReadyBehavior],
  data: {
    dpiScale: 1
  }
});
