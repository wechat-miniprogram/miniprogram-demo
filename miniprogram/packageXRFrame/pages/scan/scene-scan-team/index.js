const sceneReadyBehavior = require('../../behavior-scene/scene-ready')
const handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML

const xmlCode = ''
Page({
  behaviors: [sceneReadyBehavior],
  data: {
    xmlCode: '',
    loaded: false,
    run: false,
    positions: [[0, 0, '瞬光'], [0, 0, 'roam'], [0, 0, 'xinyi']],
  },
  handleLoaded({ detail }) {
    console.log('assets loaded', detail)

    this.setData({ loaded: true })
  },
  handleSyncPositions({ detail }) {
    const info = detail
    this.setData({ positions: info })
  },
  handleRun() {
    if (this.data.loaded && !this.data.run) {
      this.setData({ run: true })
    }
  }
})
