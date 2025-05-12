const sceneReadyBehavior = require('../../behavior-scene/scene-ready')
const handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML

const xmlCode = `&lt;xr-scene id=&quot;xr-scene&quot;&gt;
&lt;xr-assets bind:progress=&quot;handleAssetsProgress&quot; bind:loaded=&quot;handleAssetsLoaded&quot;&gt;
  &lt;xr-asset-material asset-id=&quot;standard-mat&quot; effect=&quot;standard&quot; /&gt;
&lt;/xr-assets&gt;
&lt;xr-node&gt;
  &lt;xr-node node-id=&quot;camera-target&quot; position=&quot;0 0 0&quot;&gt;&lt;/xr-node&gt;
  &lt;xr-mesh node-id=&quot;mesh-cube-floor&quot; position=&quot;2 -1.01 0&quot; rotation=&quot;0 0 0&quot; scale=&quot;10 1 10&quot; geometry=&quot;cube&quot; material=&quot;standard-mat&quot; uniforms=&quot;u_baseColorFactor:0.2 0.2 0.2 1&quot;&gt;&lt;/xr-mesh&gt;
  &lt;xr-mesh node-id=&quot;mesh-cube&quot; position=&quot;0.6 -0.25 0.8&quot; rotation=&quot;0 30 0&quot; scale=&quot;0.5 0.5 0.5&quot; geometry=&quot;cube&quot; material=&quot;standard-mat&quot; uniforms=&quot;u_baseColorFactor:1 1 1 1&quot;&gt;&lt;/xr-mesh&gt;
  &lt;xr-mesh node-id=&quot;mesh-sphere&quot; position=&quot;2 -0.15 -1&quot; scale=&quot;0.4 0.4 0.4&quot; geometry=&quot;sphere&quot; material=&quot;standard-mat&quot; uniforms=&quot;u_baseColorFactor:1 1 1 1&quot;&gt;&lt;/xr-mesh&gt;
  &lt;xr-mesh node-id=&quot;mesh-cylinder&quot; position=&quot;-0.2 -0.2 -0.8&quot; scale=&quot;0.5 0.4 0.5&quot; geometry=&quot;cylinder&quot; material=&quot;standard-mat&quot; uniforms=&quot;u_baseColorFactor:1 1 1 1&quot;&gt;&lt;/xr-mesh&gt;
  &lt;xr-mesh node-id=&quot;mesh-cube-far&quot; position=&quot;3 -0.25 1&quot; rotation=&quot;0 -30 0&quot; scale=&quot;0.5 0.5 0.5&quot; geometry=&quot;cube&quot; material=&quot;standard-mat&quot; uniforms=&quot;u_baseColorFactor:1 1 1 1&quot;&gt;&lt;/xr-mesh&gt;
&lt;xr-camera
    id=&quot;camera&quot; node-id=&quot;camera&quot; position=&quot;-2 1 0&quot; clear-color=&quot;0 0 0 1&quot;
    target=&quot;camera-target&quot;
    camera-orbit-control=&quot;&quot;
  &gt;&lt;/xr-camera&gt;
&lt;/xr-node&gt;
&lt;xr-node node-id=&quot;lights&quot;&gt;
  &lt;xr-light type=&quot;ambient&quot; color=&quot;1 1 1&quot; intensity=&quot;0.1&quot; /&gt;
  &lt;xr-light type=&quot;directional&quot; rotation=&quot;40 170 0&quot; color=&quot;1 1 1&quot; intensity=&quot;0.2&quot; /&gt;
  &lt;xr-light type=&quot;point&quot; position=&quot;0 0 0&quot; color=&quot;1 0 0&quot; range=&quot;3&quot; intensity=&quot;3&quot; /&gt;
  &lt;xr-light type=&quot;point&quot; position=&quot;2 0 1&quot; color=&quot;0 1 0&quot; range=&quot;3&quot; intensity=&quot;3&quot; /&gt;
  &lt;xr-light type=&quot;spot&quot; position=&quot;0 0 0&quot; color=&quot;0 0 1&quot; range=&quot;12&quot; intensity=&quot;12&quot; rotation=&quot;0 120 0&quot; inner-cone-angle=&quot;30&quot; outer-cone-angle=&quot;35&quot; /&gt;
&lt;/xr-node&gt;
&lt;/xr-scene&gt;
`
Page({
  behaviors: [sceneReadyBehavior],
  data: {
    xmlCode: '<div class="codeWrap">' + handleDecodedXML(xmlCode) + '</div>',
  }
})
