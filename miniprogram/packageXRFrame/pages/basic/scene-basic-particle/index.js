var sceneReadyBehavior = require('../../behavior-scene/scene-ready');
var handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML;

var xmlCode = `;`;

Page({
  behaviors:[sceneReadyBehavior],
  data: {
    xmlCode: '',
    capacity: 0,
    emitRate: 0,
    lifeTime: 0,
  },

  calc: function(variable, add = true, number=1){
    var temp = variable;
    var result = temp;
    var count = 1;
    while(Math.floor(temp/10)){
      count++;
      temp = Math.floor(temp/10);
    }
    if(add){
      result += number * Math.pow(10, count-1);
    }else{
      if(result<=number * Math.pow(10,count-1)){
        count--;
        if(count < 1 ){
          count = 1;
        }
      }
      result -= number * Math.pow(10, count-1);
      if(result < 0 ){
        result = 0;
      }
    }
    return Number(result.toFixed(1));
  },
  handleAdd: function() {
    this.setData({capacity:this.calc(this.data.capacity, true)});
  },
  handleSub: function() {
    this.setData({capacity:this.calc(this.data.capacity, false)});
  },
  handleRateAdd: function() {
    this.setData({emitRate:this.calc(this.data.emitRate, true)});
  },
  handleRateSub: function() {
    this.setData({emitRate:this.calc(this.data.emitRate, false)});
  },
  handleTimeAdd: function() {
    this.setData({lifeTime:this.calc(this.data.lifeTime, true, 0.1)});
  },
  handleTimeSub: function() {
    this.setData({lifeTime:this.calc(this.data.lifeTime, false, 0.1)});
  }
});




