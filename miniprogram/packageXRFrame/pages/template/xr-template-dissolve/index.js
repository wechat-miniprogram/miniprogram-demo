var sceneReadyBehavior = require('../../behavior-scene/scene-ready');
var handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML;


Page({
  behaviors:[sceneReadyBehavior],
  data: {
    thresHold: 0,
    autoPlay: false,
  },
  changeThresHold(e) {
    this.setData({
        autoPlay: false
    });
    this.setData({
        thresHold: e.detail.value
    });
  },
  openAutoPlay(e) {
      if(this.data.autoPlay == false){
        this.setData({
            autoPlay: true
        });
      }else{
        this.setData({
            autoPlay: false
        });
      }
  },
});
