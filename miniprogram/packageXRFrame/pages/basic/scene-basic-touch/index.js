const sceneReadyBehavior = require('../../behavior-scene/scene-ready')
const handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML
const escapeMarkup = require('../../behavior-scene/util').escapeMarkup

const xmlCode = escapeMarkup(`<xr-scene id="xr-scene" bind:tick="handleTick" bind:ready="handleReady">
<xr-assets bind:progress="handleAssetsProgress" bind:loaded="handleAssetsLoaded">
  <xr-asset-load type="texture" asset-id="earth-texture" src="..." />
  <xr-asset-load type="texture" asset-id="moon-texture" src="..." />
  <xr-asset-material asset-id="standard-mat" effect="standard" />
</xr-assets>
<xr-node>
  <xr-mesh node-id="mesh-earth" position="0 0 0" scale="8 8 8" geometry="sphere" material="standard-mat" uniforms="u_baseColorMap: earth-texture" bind:dragShape="handleEarthRotation" sphere-shape></xr-mesh>
  <xr-mesh node-id="mesh-moon" position="10 0 0" scale="1.5 1.5 1.5" rotation="0 90 0" geometry="sphere" material="standard-mat" uniforms="u_baseColorMap: moon-texture" bind:dragShape="handleDragMoon" bind:touchShape="handleTouchMoon" bind:untouchShape="handleUntouchMoon" sphere-shape="radius: 1.5">
  </xr-mesh>
  <xr-camera
    id="camera" node-id="camera" position="0 20 -35" clear-color="0 0 0 1"
    target="mesh-earth"
  ></xr-camera>
</xr-node>
<xr-node node-id="lights">
  <xr-light type="ambient" color="1 1 1" intensity="0.1" />
  <xr-light id="directional-light" type="directional" rotation="0 60 0" color="1 1 1" intensity="5" />
</xr-node>
</xr-scene>`)

const jsCode = 'not implemented'

Page({
  behaviors: [sceneReadyBehavior],
  data: {
    xmlCode: '<div class="codeWrap">' + handleDecodedXML(xmlCode) + '</div>',
    jsCode
  }
})
