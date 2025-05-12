const sceneReadyBehavior = require('../../behavior-scene/scene-ready')
const handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML

const xmlCode = ''

Page({
  behaviors: [sceneReadyBehavior],
  data: {
    xmlCode: '',
    visibleIndex: 1,
    cullMask: 0b011
  },
  handleChangeVisible() {
    this.setData({
      visibleIndex: 3 - this.data.visibleIndex
    })
  },
  handleChangeCullMask() {
    this.setData({
      cullMask: ((this.data.cullMask ^ (((this.data.cullMask & 0b100) >> 2) * 0b111)) << 1) | 0b1
    })
  }
})
