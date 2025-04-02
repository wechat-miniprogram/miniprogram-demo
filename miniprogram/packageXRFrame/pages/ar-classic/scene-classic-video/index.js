const sceneReadyBehavior = require('../../behavior-scene/scene-ready')
const handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML

const xmlCode = `&lt;xr-scene ar-system=&quot;modes:Marker&quot; bind:ready=&quot;handleReady&quot;&gt;
  &lt;xr-assets bind:progress=&quot;handleAssetsProgress&quot; bind:loaded=&quot;handleAssetsLoaded&quot;&gt;
  &lt;xr-asset-load
      type=&quot;video-texture&quot; asset-id=&quot;hikari&quot;
      src=&quot;https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/xr-frame-team/2dmarker/hikari.mp4&quot; options=&quot;autoPlay:true,loop:true&quot;
    /&gt;
  &lt;/xr-assets&gt;
  &lt;xr-node wx:if=&quot;{{loaded}}&quot;&gt;
    &lt;xr-ar-tracker mode=&quot;Marker&quot; src=&quot;https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/xr-frame-team/2dmarker/hikari.jpg&quot;&gt;
      &lt;xr-mesh node-id=&quot;mesh-plane&quot; geometry=&quot;plane&quot; uniforms=&quot;u_baseColorMap: video-hikari&quot; /&gt;
    &lt;/xr-ar-tracker&gt;
    &lt;xr-camera
      id=&quot;camera&quot; node-id=&quot;camera&quot; position=&quot;1 1 1&quot; clear-color=&quot;0.925 0.925 0.925 1&quot;
      background=&quot;ar&quot; is-ar-camera
    /&gt;
  &lt;/xr-node&gt;
&lt;/xr-scene&gt;`
Page({
  behaviors: [sceneReadyBehavior],
  data: {
    xmlCode: '<div class="codeWrap">' + handleDecodedXML(xmlCode) + '</div>'
  }
})
