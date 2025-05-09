const sceneReadyBehavior = require('../../behavior-scene/scene-ready')
const handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML

const xmlCode = `&lt;xr-scene id=&quot;xr-scene&quot;&gt;
&lt;xr-assets bind:progress=&quot;handleAssetsProgress&quot; bind:loaded=&quot;handleAssetsLoaded&quot;&gt;
  &lt;xr-asset-load type=&quot;gltf&quot; asset-id=&quot;gltf-Sponza&quot; src=&quot;https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/Sponza/gltf/Sponza.gltf&quot; /&gt;
&lt;/xr-assets&gt;
&lt;xr-node&gt;
  &lt;xr-node node-id=&quot;camera-target&quot; position=&quot;0 5 0&quot;&gt;&lt;/xr-node&gt;
  &lt;xr-gltf node-id=&quot;mesh-gltf-Sponza&quot; position=&quot;0 -2 0.3&quot; rotation=&quot;0 0 0&quot; scale=&quot;2 2 2&quot; model=&quot;gltf-Sponza&quot;&gt;&lt;/xr-gltf&gt;
  &lt;xr-camera
    id=&quot;camera&quot; node-id=&quot;camera&quot; position=&quot;-1 5 0&quot; clear-color=&quot;0.925 0.925 0.925 1&quot;
    target=&quot;camera-target&quot;
    camera-orbit-control=&quot;&quot;
  &gt;&lt;/xr-camera&gt;
&lt;/xr-node&gt;
&lt;xr-node node-id=&quot;lights&quot;&gt;
  &lt;xr-light type=&quot;ambient&quot; color=&quot;1 1 1&quot; intensity=&quot;0.4&quot; /&gt;
  &lt;xr-light
    type=&quot;directional&quot; rotation=&quot;200 155 0&quot; color=&quot;1 1 1&quot; intensity=&quot;3&quot;
    anim-keyframe=&quot;gltf-anim&quot; anim-clipmap=&quot;default:directionalLight&quot; anim-autoplay=&quot;clip:directionalLight, speed:1&quot;
  /&gt;
  &lt;xr-light
    type=&quot;point&quot; position=&quot;10 0 0&quot; color=&quot;1 1 1&quot; range=&quot;10&quot; intensity=&quot;30&quot;
    anim-keyframe=&quot;gltf-anim&quot; anim-autoplay=&quot;clip:pointLight, speed:1&quot;
    /&gt;
  &lt;xr-light
    type=&quot;spot&quot; color=&quot;1 0 0&quot; position=&quot;0 8 0&quot; range=&quot;30&quot; intensity=&quot;60&quot; rotation=&quot;0 90 0&quot; inner-cone-angle=&quot;18&quot; outer-cone-angle=&quot;24&quot;
    anim-keyframe=&quot;gltf-anim&quot; anim-autoplay=&quot;clip:spotLight, speed:1&quot;
  /&gt;
&lt;/xr-node&gt;
&lt;/xr-scene&gt;
`
Page({
  behaviors: [sceneReadyBehavior],
  data: {
    xmlCode: '<div class="codeWrap">' + handleDecodedXML(xmlCode) + '</div>',
    progressInfo: '',
    loaded: false
  },
  handleProgress({ detail }) {
    console.log('assets progress', detail)

    this.setData({ progressInfo: `${~~(detail.progress * 100)} %\n\n${detail.asset.assetId}(${detail.asset.type}): ${detail.asset.src}` })
  },
  handleLoaded({ detail }) {
    console.log('assets loaded', detail)

    this.setData({ loaded: true })
  }
})
