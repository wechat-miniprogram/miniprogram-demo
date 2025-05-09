const sceneReadyBehavior = require('../../behavior-scene/scene-ready')
const handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML

const xmlCode = ''
Page({
  behaviors: [sceneReadyBehavior],
  data: {
    xmlCode: '',
    type: 0,

    blurRadius: 16,
    bloomRadius: 16,
    bloomIntensity: 2,
    bloomThreshold: 0.5,
    vignetteIntensity: 1,
    vignetteSmoothness: 2,
    vignetteRoundness: 1,
    fxaaEnabled: false
  },
  handleProgress({ detail }) {
    this.setData({ progressInfo: `${~~(detail.progress * 100)} %\n\n${detail.asset.assetId}(${detail.asset.type}): ${detail.asset.src}` })
  },
  handleLoaded({ detail }) {
    this.setData({ loaded: true })
  },
  changeType(e) {
    const type = e.detail.value
    if (type === 'blur') {
      this.setData({
        type: 0
      })
    } else if (type === 'bloom') {
      this.setData({
        type: 1
      })
    } else if (type === 'vignette') {
      this.setData({
        type: 2
      })
    } else if (type === 'fxaa') {
      this.setData({
        type: 3
      })
    }
  },
  changeBlurRadius(e) {
    this.setData({
      blurRadius: e.detail.value
    })
  },
  changeBloomRadius(e) {
    this.setData({
      bloomRadius: e.detail.value
    })
  },
  changeBloomIntensity(e) {
    this.setData({
      bloomIntensity: e.detail.value
    })
  },
  changeBloomThreshold(e) {
    this.setData({
      bloomThreshold: e.detail.value
    })
  },
  changeVignetteIntensity(e) {
    this.setData({
      vignetteIntensity: e.detail.value
    })
  },
  changeVignetteSmoothness(e) {
    this.setData({
      vignetteSmoothness: e.detail.value
    })
  },
  changeVignetteRoundness(e) {
    this.setData({
      vignetteRoundness: e.detail.value
    })
  },
  switchFXAA(e) {
    this.setData({
      fxaaEnabled: !this.data.fxaaEnabled
    })
  }
})
