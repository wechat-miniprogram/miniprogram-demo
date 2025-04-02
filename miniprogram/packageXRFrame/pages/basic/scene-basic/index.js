const sceneReadyBehavior = require('../../behavior-scene/scene-ready')
const handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML

const xmlCode = `&lt;xr-scene id=&quot;xr-scene&quot;&gt;
&lt;xr-assets bind:progress=&quot;handleAssetsProgress&quot; bind:loaded=&quot;handleAssetsLoaded&quot;&gt;
  &lt;xr-asset-material asset-id=&quot;standard-mat&quot; effect=&quot;standard&quot; /&gt;
&lt;/xr-assets&gt;
&lt;xr-node&gt;
  &lt;xr-mesh node-id=&quot;mesh-plane&quot; position=&quot;0 -0.05 -4&quot; rotation=&quot;0 0 0&quot; scale=&quot;5 1 5&quot; geometry=&quot;plane&quot; material=&quot;standard-mat&quot; uniforms=&quot;u_baseColorFactor:0.48 0.78 0.64 1&quot;&gt;&lt;/xr-mesh&gt;
  &lt;xr-mesh node-id=&quot;mesh-cube&quot; position=&quot;-1 0.5 -3.5&quot; scale=&quot;1 1 1&quot; rotation=&quot;0 45 0&quot; geometry=&quot;cube&quot; material=&quot;standard-mat&quot; uniforms=&quot;u_baseColorFactor:0.298 0.764 0.85 1&quot;&gt;&lt;/xr-mesh&gt;
  &lt;xr-mesh node-id=&quot;mesh-sphere&quot; position=&quot;0 1.25 -5&quot; scale=&quot;1.25 1.25 1.25&quot; geometry=&quot;sphere&quot; material=&quot;standard-mat&quot; uniforms=&quot;u_baseColorFactor:0.937 0.176 0.368 1&quot;&gt;&lt;/xr-mesh&gt;
  &lt;xr-mesh node-id=&quot;mesh-cylinder&quot; position=&quot;1 0.7 -3.5&quot; scale=&quot;1 0.7 1&quot; geometry=&quot;cylinder&quot; material=&quot;standard-mat&quot; uniforms=&quot;u_baseColorFactor:1 0.776 0.364 1&quot;&gt;&lt;/xr-mesh&gt;
  &lt;xr-camera
    id=&quot;camera&quot; node-id=&quot;camera&quot; position=&quot;0 1.6 0&quot; clear-color=&quot;0.925 0.925 0.925 1&quot;
    target=&quot;mesh-sphere&quot;
    camera-orbit-control=&quot;&quot;
  &gt;&lt;/xr-camera&gt;
&lt;/xr-node&gt;
&lt;xr-node node-id=&quot;lights&quot;&gt;
  &lt;xr-light type=&quot;ambient&quot; color=&quot;1 1 1&quot; intensity=&quot;1&quot; /&gt;
  &lt;xr-light type=&quot;directional&quot; rotation=&quot;40 170 0&quot; color=&quot;1 1 1&quot; intensity=&quot;3&quot; /&gt;
&lt;/xr-node&gt;
&lt;/xr-scene&gt;`

Page({
  behaviors: [sceneReadyBehavior],
  data: {
    xmlCode: '<div class="codeWrap">' + handleDecodedXML(xmlCode) + '</div>',
  }
})
