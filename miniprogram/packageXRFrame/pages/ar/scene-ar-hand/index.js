const sceneReadyBehavior = require('../../behavior-scene/scene-ready')
const handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML

const xmlCode = ''
Page({
  behaviors: [sceneReadyBehavior],
  data: {
    xmlCode: '<div class="codeWrap">' + handleDecodedXML(xmlCode) + '</div>',
    gesture: undefined,
    score: undefined
  },
  handleInfo({ detail }) {
    this.setData({ gesture: detail.gesture, score: detail.score.toFixed(2) })
  },
})
