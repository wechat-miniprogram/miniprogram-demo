var sceneReadyBehavior = require('../../behavior-scene/scene-ready');
var handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML;
var escapeMarkup = require('../../behavior-scene/util').escapeMarkup;

var xmlCode = escapeMarkup(`<xr-scene id="xr-scene" bind:ready="handleReady" bind:tick="handleTick">
<xr-shadow id="shadow-root"></xr-shadow>
</xr-scene>`);
var jsCode = `
...<br>
addOne() {
  <div class="ml20">
  const xrFrameSystem = wx.getXrFrameSystem();<br>
  const pos = [Math.random(), Math.random(), Math.random()].map(v => (v * 2 - 1) * 6);<br>

  const gltfElement = this.scene.createElement(xrFrameSystem.XRGLTF);<br>
  this.shadowRoot.addChild(gltfElement);<br>
  gltfElement.getComponent(xrFrameSystem.Transform).position.setArray(pos);<br>
  gltfElement.getComponent(xrFrameSystem.GLTF).setData({model: this.gltfModle});<br>

  this.meshList.push(gltfElement);<br>
  </div>
},
removeOne() {
  <div class="ml20">
  const element = this.meshList.pop();<br>
  if (element) {<br>
    this.shadowRoot.removeChild(element);
  }
  </div>
},
handleTick: function({detail}) {
  <div class="ml20">
  const {el, value} = detail;
  </div>
},<br>
...
`;
Page({
  behaviors:[sceneReadyBehavior],
  data: {
    xmlCode: '<div class="codeWrap">' + handleDecodedXML(xmlCode) + '</div>',
    jsCode:  jsCode,
    meshCount: 0
  },
  handleIncMeshCount: function() {
    if (this.data.meshCount > 16) {
      return;
    }

    this.setData({meshCount: this.data.meshCount + 1});
  },
  handleDecMeshCount: function() {
    if (this.data.meshCount <= 0) {
      return;
    }

    this.setData({meshCount: this.data.meshCount - 1});
  }
});

