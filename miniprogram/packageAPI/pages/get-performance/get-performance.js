// miniprogram/page/API/pages/get-performance/get-performance.js

const util = require('./util')
const performance = wx.getPerformance();
const performanceObserver = performance.createObserver();

Page({

  data: {
    array: []
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