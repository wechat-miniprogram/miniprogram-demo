const sceneReadyBehavior = require('../../behavior-scene/scene-ready')
const handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML

const xmlCode = `&lt;xr-scene id=&quot;xr-scene&quot;&gt;
&lt;xr-assets bind:progress=&quot;handleAssetsProgress&quot; bind:loaded=&quot;handleAssetsLoaded&quot;&gt;
  &lt;xr-asset-load type=&quot;gltf&quot; asset-id=&quot;gltf-just_a_girl&quot; src=&quot;https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/just_a_girl/scene.gltf&quot; /&gt;
&lt;/xr-assets&gt;
&lt;xr-node&gt;
  &lt;xr-node node-id=&quot;camera-target&quot; position=&quot;0 0 0&quot;&gt;&lt;/xr-node&gt;
  &lt;xr-gltf node-id=&quot;gltf-just_a_girl&quot; position=&quot;0 -0.5 0&quot; rotation=&quot;0 0 0&quot; scale=&quot;0.01 0.01 0.01&quot; model=&quot;gltf-just_a_girl&quot;&gt;&lt;/xr-gltf&gt;
  &lt;xr-camera
    id=&quot;camera&quot; node-id=&quot;camera&quot; position=&quot;0 0.4 1.6&quot; clear-color=&quot;0.9 0.9 0.9 1&quot;
    target=&quot;camera-target&quot;
    camera-orbit-control=&quot;&quot;
  &gt;&lt;/xr-camera&gt;
&lt;/xr-node&gt;
&lt;xr-node node-id=&quot;lights&quot;&gt;
  &lt;xr-light type=&quot;ambient&quot; color=&quot;1 1 1&quot; intensity=&quot;0.3&quot; /&gt;
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
