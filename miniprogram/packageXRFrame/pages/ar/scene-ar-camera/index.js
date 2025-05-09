const sceneReadyBehavior = require('../../behavior-scene/scene-ready')
const handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML

const xmlCode = `&lt;xr-scene id=&quot;xr-scene&quot; ar-system=&quot;modes:Marker&quot; bind:ready=&quot;handleReady&quot; bind:tick=&quot;handleTick&quot; bind:log=&quot;handleLog&quot;&gt;
&lt;xr-assets bind:progress=&quot;handleAssetsProgress&quot; bind:loaded=&quot;handleAssetsLoaded&quot;&gt;
  &lt;xr-asset-load type=&quot;env-data&quot; asset-id=&quot;env1&quot; src=&quot;https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/env-footprint/data.json&quot; /&gt;
  &lt;xr-asset-load type=&quot;gltf&quot; asset-id=&quot;gltf-table&quot; src=&quot;https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/metal_table/scene.gltf&quot; /&gt;
&lt;/xr-assets&gt;
&lt;xr-env env-data=&quot;env1&quot;/&gt;
&lt;xr-node wx:if=&quot;loaded&quot;&gt;
  &lt;xr-node node-id=&quot;camera-target&quot; position=&quot;0 0 0&quot;&gt;&lt;/xr-node&gt;
  &lt;xr-node node-id=&quot;table-wrap&quot; position=&quot;0 0 0&quot;&gt;
    &lt;xr-gltf node-id=&quot;mesh-gltf-table&quot; position=&quot;0 -1 0&quot; rotation=&quot;0 45 0&quot; scale=&quot;0.5 0.5 0.5&quot; model=&quot;gltf-table&quot;&gt;&lt;/xr-gltf&gt;
  &lt;/xr-node&gt;
  &lt;xr-camera
    id=&quot;camera&quot; node-id=&quot;camera&quot; position=&quot;2 1 2&quot; clear-color=&quot;0.925 0.925 0.925 1&quot;
    target=&quot;camera-target&quot; background=&quot;ar&quot;
    camera-orbit-control=&quot;&quot;
  &gt;&lt;/xr-camera&gt;
&lt;/xr-node&gt;
&lt;xr-node node-id=&quot;lights&quot;&gt;
  &lt;xr-light type=&quot;ambient&quot; color=&quot;1 1 1&quot; intensity=&quot;0.2&quot; /&gt;
  &lt;xr-light type=&quot;directional&quot; rotation=&quot;180 0 0&quot; color=&quot;1 1 1&quot; intensity=&quot;2&quot; /&gt;
&lt;/xr-node&gt;
&lt;/xr-scene&gt;
`
Page({
  behaviors: [sceneReadyBehavior],
  data: {
    xmlCode: '<div class="codeWrap">' + handleDecodedXML(xmlCode) + '</div>',
  }
})
