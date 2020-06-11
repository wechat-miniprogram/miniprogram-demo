// miniprogram/page/API/pages/get-performance/get-performance.js

const util = require('./util')
const performance = wx.getPerformance ? wx.getPerformance() : {};
const performanceObserver = performance.createObserver ? performance.createObserver() : null;


Page({
  onShareAppMessage() {
    return {
      title: '周期性缓存',
      path: 'packageAPI/pages/get-performance/get-performance'
    }
  },
  data: {
    array: [],
    support: false,
  },
  onLoad() {
    console.log('canIUse:getPerformance:', wx.canIUse('getPerformance'));
    let canIUse = false;
    if(wx.getPerformance) {
      canIUse = true;
    }
    this.setData({
      support: canIUse,
    })   
  },
  getPerformanceInfo() {
      const EntryList = performance.getEntries();
      const array = [];
      EntryList.forEach((item) => {
        array.push({
          entryType: util.renderEntryType(item.entryType),
          name: util.renderName(item.name),
          duration: util.renderDuration(item.duration),
          startTime: util.renderStartTime(item.startTime),
        })
      })
      this.setData({
        array: array,
      })
  },

  startObserver() {
    // 监听需要的性能指标
      performanceObserver.observe({ entryTypes: ['render', 'script', 'navigation'] });
    
  },

  stopObserver() {
    // 结束监听
      performanceObserver.disconnect();
  }
})