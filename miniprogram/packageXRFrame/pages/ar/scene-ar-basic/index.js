const sceneReadyBehavior = require('../../behavior-scene/scene-ready')
const handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML

const xmlCode = `&lt;xr-scene ar-system=&quot;modes:Plane&quot; id=&quot;xr-scene&quot; bind:ready=&quot;handleReady&quot; bind:arReady=&quot;handleARReady&quot; bind:log=&quot;handleLog&quot;&gt;
&lt;xr-assets bind:progress=&quot;handleAssetsProgress&quot; bind:loaded=&quot;handleAssetsLoaded&quot;&gt;
  &lt;xr-asset-load type=&quot;gltf&quot; asset-id=&quot;gltf-item&quot; src=&quot;https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/just_a_girl/scene.gltf&quot; /&gt;
  &lt;xr-asset-material asset-id=&quot;standard-mat&quot; effect=&quot;standard&quot; /&gt;
&lt;/xr-assets&gt;
&lt;xr-node&gt;
  &lt;xr-node node-id=&quot;camera-target&quot; position=&quot;0 0 0&quot;&gt;&lt;/xr-node&gt;
  &lt;xr-ar-tracker mode=&quot;Plane&quot;&gt;
    &lt;xr-node&gt;
      &lt;xr-mesh id=&quot;ar-tracker-mesh&quot; geometry=&quot;cube&quot; scale=&quot;0.5 0.05 0.5&quot; material=&quot;standard&quot; /&gt;
    &lt;/xr-node&gt;
  &lt;/xr-ar-tracker&gt;
  &lt;xr-node node-id=&quot;setitem&quot;&gt;
    &lt;xr-gltf model=&quot;gltf-item&quot; scale=&quot;0.006 0.006 0.006&quot;&gt;&lt;/xr-gltf&gt;
  &lt;/xr-node&gt;
  &lt;xr-camera
    id=&quot;camera&quot; node-id=&quot;camera&quot; position=&quot;1 1 1&quot; clear-color=&quot;0.925 0.925 0.925 1&quot;
    target=&quot;camera-target&quot; background=&quot;ar&quot; is-ar-camera
    camera-orbit-control
  &gt;&lt;/xr-camera&gt;
&lt;/xr-node&gt;
&lt;xr-node node-id=&quot;lights&quot;&gt;
  &lt;xr-light type=&quot;ambient&quot; color=&quot;1 1 1&quot; intensity=&quot;1&quot; /&gt;
  &lt;xr-light type=&quot;directional&quot; rotation=&quot;180 0 0&quot; color=&quot;1 1 1&quot; intensity=&quot;3&quot; /&gt;
&lt;/xr-node&gt;
&lt;/xr-scene&gt;
`
Page({
  behaviors: [sceneReadyBehavior],
  data: {
    xmlCode: '<div class="codeWrap">' + handleDecodedXML(xmlCode) + '</div>',
  }
})
