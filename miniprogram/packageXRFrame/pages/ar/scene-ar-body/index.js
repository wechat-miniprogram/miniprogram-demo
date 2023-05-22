var sceneReadyBehavior = require('../../behavior-scene/scene-ready');
var handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML;
var xmlCode = ``;
Page({
  behaviors: [sceneReadyBehavior],
  data: {
    xmlCode: '<div class="codeWrap">' + handleDecodedXML(xmlCode) + '</div>',
    score: undefined
  },
  handleInfo: function({detail}) {
    this.setData({score: detail.score.toFixed(2)});
  },
});