const sceneReadyBehavior = require('../../behavior-scene/scene-ready')
const handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML

const xmlCode = `&lt;xr-scene ar-system=&quot;modes:Marker&quot; id=&quot;xr-scene&quot; bind:ready=&quot;handleReady&quot; bind:arReady=&quot;handleARReady&quot; bind:log=&quot;handleLog&quot;&gt;
&lt;xr-assets bind:progress=&quot;handleAssetsProgress&quot; bind:loaded=&quot;handleAssetsLoaded&quot;&gt;
  &lt;xr-asset-material asset-id=&quot;ar-anchor&quot; effect=&quot;standrand&quot; uniforms=&quot;u_baseColorFactor:0 1 0 1&quot;&gt;&lt;/xr-asset-material&gt;
&lt;/xr-assets&gt;
&lt;xr-node&gt;
  &lt;xr-node node-id=&quot;id2&quot; scale=&quot;2 2 2&quot; position=&quot;0 0 0&quot;&gt;&lt;/xr-node&gt;
  &lt;xr-ar-tracker mode=&quot;Marker&quot; src=&quot;{{markerImg}}&quot;&gt;
    &lt;xr-mesh geometry=&quot;cylinder&quot; material=&quot;ar-anchor&quot; /&gt;
  &lt;/xr-ar-tracker&gt;
  &lt;xr-camera
    id=&quot;camera&quot; node-id=&quot;camera&quot; position=&quot;0.8 2.2 -5&quot; clear-color=&quot;0.925 0.925 0.925 1&quot;
    target=&quot;id2&quot; background=&quot;ar&quot; is-ar-camera
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
    markerImg: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/marker/2dmarker-test.jpg'
  },
  handleChangeMarkerImg() {
    wx.chooseMedia({
      count: 1,
      sizeType: ['compressed'],
      mediaType: ['image'],
      sourceType: ['album'],
      success: res => {
        const fp = res.tempFiles[0].tempFilePath
        this.setData({ markerImg: fp })
      },
      fail: err => {
        console.error('[xr-demo]chooseImage failed', err)
      }
    })
  }
})
