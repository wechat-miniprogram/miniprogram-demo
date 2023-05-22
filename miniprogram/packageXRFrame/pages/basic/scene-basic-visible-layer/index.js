var sceneReadyBehavior = require('../../behavior-scene/scene-ready');
var handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML;

var xmlCode = ``;

Page({
  behaviors:[sceneReadyBehavior],
  data: {
    xmlCode: '',
    visibleIndex: 1,
    cullMask: 0b011
  },
  handleChangeVisible() {
    this.setData({
      visibleIndex: 3 - this.data.visibleIndex
    });
  },
  handleChangeCullMask() {
    this.setData({
      cullMask: ((this.data.cullMask ^ (((this.data.cullMask & 0b100) >> 2) * 0b111)) << 1) | 0b1
    });
  }
});
