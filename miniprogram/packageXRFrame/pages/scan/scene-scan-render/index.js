var sceneReadyBehavior = require('../../behavior-scene/scene-ready');
var handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML;

var xmlCode = ``;


var envWords = [
  "TiT创意园白天",
  "TiT创意园晚上",
  "海边夕阳",
];

Page({
  behaviors:[sceneReadyBehavior],
  data: {
    xmlCode: '<div class="codeWrap">' + handleDecodedXML(xmlCode) + '</div>',
    envIndex: 0,
    envWord: "TiT创意园白天",
  },
  handleEnv0: function() {
    this.setData({envIndex: 0, envWord: envWords[0]});
  },
  handleEnv1: function() {
    this.setData({envIndex: 1, envWord: envWords[1]});
  },
  handleEnv2: function() {
    this.setData({envIndex: 2, envWord: envWords[2]});
  }
});
