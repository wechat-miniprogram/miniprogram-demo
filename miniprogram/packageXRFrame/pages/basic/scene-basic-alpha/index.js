const sceneReadyBehavior = require('../../behavior-scene/scene-ready')
const handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML

const xmlCode = ''

Page({
  behaviors: [sceneReadyBehavior],
  data: {
    heightScale: 0.5,
    cubeAlpha: 100,
    sphereAlpha: 100,
    clearR: 0,
    clearG: 0,
    clearB: 0,
    clearA: 0,
    xmlCode: '<div class="codeWrap">' + handleDecodedXML(xmlCode) + '</div>',
  },
  changeClearR(e) {
    this.setData({
      clearR: e.detail.value
    })
  },
  changeClearG(e) {
    this.setData({
      clearG: e.detail.value
    })
  },
  changeClearB(e) {
    this.setData({
      clearB: e.detail.value
    })
  },
  changeClearA(e) {
    this.setData({
      clearA: e.detail.value
    })
  },
  changeCubeAlpha(e) {
    this.setData({
      cubeAlpha: e.detail.value
    })
  },
  changeSphereAlpha(e) {
    this.setData({
      sphereAlpha: e.detail.value
    })
  }
})
