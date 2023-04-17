var sceneReadyBehavior = require('../../behavior-scene/scene-ready');
var handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML;
var xmlCode = ``;
Page({
  behaviors: [sceneReadyBehavior],
  data: {
    xmlCode: '<div class="codeWrap">' + handleDecodedXML(xmlCode) + '</div>',
    gesture: undefined,
    score: undefined
  },
  handleInfo: function({detail}) {
    this.setData({gesture: detail.gesture, score: detail.score.toFixed(2)});
  },
});