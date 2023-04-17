var sceneReadyBehavior = require('../../behavior-scene/scene-ready');
var handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML;
var xmlCode = ``;
Page({
  behaviors:[sceneReadyBehavior],
  data: {
    xmlCode: '',
    loaded: false,
    run: false,
    positions: [[0, 0, '瞬光'], [0, 0, 'roam'], [0, 0, 'xinyi']],
  },
  handleLoaded: function({detail}) {
    console.log('assets loaded', detail);

    this.setData({loaded: true});
  },
  handleSyncPositions: function({detail}) {
    const info = detail;
    this.setData({positions: info});
  },
  handleRun: function() {
    if (this.data.loaded && !this.data.run) {
      this.setData({run: true});
    }
  }
});

