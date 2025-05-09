const sceneReadyBehavior = require('../../behavior-scene/scene-ready')
const handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML

const xmlCode = `&lt;xr-scene id=&quot;xr-scene&quot;&gt;
&lt;xr-assets bind:progress=&quot;handleAssetsProgress&quot; bind:loaded=&quot;handleAssetsLoaded&quot;&gt;
  &lt;xr-asset-load asset-id=&quot;basic-anim&quot; type=&quot;keyframe&quot; src=&quot;/assets/animation/basic-animation.json&quot;/&gt;
  &lt;xr-asset-material asset-id=&quot;standard-mat&quot; effect=&quot;standard&quot; /&gt;
&lt;/xr-assets&gt;
&lt;xr-node&gt;
  &lt;xr-node node-id=&quot;camera-target&quot; position=&quot;0 0 0&quot;&gt;&lt;/xr-node&gt;
  &lt;xr-mesh
    node-id=&quot;mesh-plane&quot; position=&quot;0 -0.8 0&quot; rotation=&quot;0 0 0&quot; scale=&quot;10 1 8&quot; geometry=&quot;plane&quot; material=&quot;standard-mat&quot; uniforms=&quot;u_baseColorFactor:0.48 0.78 0.64 1&quot;
    anim-keyframe=&quot;basic-anim&quot; anim-autoplay=&quot;clip:plane, speed:4&quot;
  &gt;&lt;/xr-mesh&gt;
  &lt;xr-mesh
    node-id=&quot;mesh-cube&quot; position=&quot;-3 0 2&quot; scale=&quot;1 1 1&quot; rotation=&quot;0 0 0&quot; geometry=&quot;cube&quot; material=&quot;standard-mat&quot; uniforms=&quot;u_baseColorFactor:0.298 0.764 0.85 1&quot;
    anim-keyframe=&quot;basic-anim&quot; anim-clipmap=&quot;default:cube&quot; anim-autoplay=&quot;clip:cube, speed:2&quot;
  &gt;&lt;/xr-mesh&gt;
  &lt;xr-mesh 
    node-id=&quot;mesh-sphere&quot; position=&quot;-3 0 0&quot; scale=&quot;0.8 0.8 0.8&quot; geometry=&quot;sphere&quot; material=&quot;standard-mat&quot; uniforms=&quot;u_baseColorFactor:0.937 0.176 0.368 1&quot;
    anim-keyframe=&quot;basic-anim&quot; anim-autoplay=&quot;clip:sphere, speed:2&quot;
  &gt;&lt;/xr-mesh&gt;
  &lt;xr-mesh 
    node-id=&quot;mesh-cylinder&quot; position=&quot;-3 0 -2&quot; scale=&quot;1 0.6 1&quot; geometry=&quot;cylinder&quot; material=&quot;standard-mat&quot; uniforms=&quot;u_baseColorFactor:1 0.776 0.364 1&quot;
    anim-keyframe=&quot;basic-anim&quot; anim-autoplay=&quot;clip:cylinder, speed:2&quot;
  &gt;&lt;/xr-mesh&gt;
  &lt;xr-mesh node-id=&quot;mesh-light-cube&quot; position=&quot;-5 1 0&quot; scale=&quot;0.5 2 10&quot; rotation=&quot;0 0 0&quot; geometry=&quot;cube&quot; material=&quot;standard-mat&quot; uniforms=&quot;u_baseColorFactor:0.3 0.3 0.3 1&quot;&gt;&lt;/xr-mesh&gt;
  &lt;xr-camera
    id=&quot;camera&quot; node-id=&quot;camera&quot; position=&quot;5 3 0&quot; clear-color=&quot;0.925 0.925 0.925 1&quot;
    target=&quot;camera-target&quot;
    camera-orbit-control=&quot;&quot;
  &gt;&lt;/xr-camera&gt;
&lt;/xr-node&gt;
&lt;xr-node node-id=&quot;lights&quot;&gt;
  &lt;xr-light type=&quot;ambient&quot; color=&quot;1 1 1&quot; intensity=&quot;1&quot; /&gt;
  &lt;xr-light type=&quot;directional&quot; rotation=&quot;30 230 0&quot; color=&quot;1 1 1&quot; intensity=&quot;3&quot; /&gt;
  &lt;xr-light
    type=&quot;spot&quot; position=&quot;-4 1 0&quot; rotation=&quot;0 -90 0&quot; color=&quot;0 0 1&quot; range=&quot;20&quot; intensity=&quot;100&quot; inner-cone-angle=&quot;30&quot; outer-cone-angle=&quot;40&quot;
    anim-keyframe=&quot;basic-anim&quot; anim-autoplay=&quot;clip:spotLight, speed:2&quot;
  /&gt;
&lt;/xr-node&gt;
&lt;/xr-scene&gt;
`

const json = `
{
  <div class="ml20">
  "keyframe": {
    <div class="ml20">
    "cube": {
      <div class="ml20">
      "0": {
        <div class="ml20">
        "position": [-3, 0, 2]
        </div>
      },<br>
      "50": {
        <div class="ml20">
        "rotation": [0, 0, 0],
        "scale": [1, 1, 1]
        </div>
      },<br>
      "100": {
        <div class="ml20">
        "position": [3, 0, 2],
        "rotation": [0, 3.14, 0],
        "scale": [1.4, 1.4, 1.4]
        </div>
      }
      </div>
    }
    </div>
    ...<br>
  },<br>
  "animation": {
    <div class="ml20">
    "default": {
      <div class="ml20">
      "keyframe": "cube",<br>
      "duration": 1,<br>
      "ease": "ease-in-out",<br>
      "loop": 400000,<br>
      "delay": 1,<br>
      "direction": "both"<br>
      </div>
    }
    </div>
    ...<br>
  }
  </div>

}`

Page({
  behaviors: [sceneReadyBehavior],
  data: {
    xmlCode: '<div class="codeWrap">' + handleDecodedXML(xmlCode) + '</div>',
    json
  }
})
