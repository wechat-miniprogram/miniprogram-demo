const sceneReadyBehavior = require('../../behavior-scene/scene-ready')
const handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML

const xmlCode = ''

const envWords = [
  'TiT创意园白天',
  'TiT创意园晚上',
  '海边夕阳',
]

Page({
  behaviors: [sceneReadyBehavior],
  data: {
    xmlCode: '<div class="codeWrap">' + handleDecodedXML(xmlCode) + '</div>',
    envIndex: 0,
    envWord: 'TiT创意园白天',
  },
  handleEnv0() {
    this.setData({ envIndex: 0, envWord: envWords[0] })
  },
  handleEnv1() {
    this.setData({ envIndex: 1, envWord: envWords[1] })
  },
  handleEnv2() {
    this.setData({ envIndex: 2, envWord: envWords[2] })
  }
})
