// miniprogram/page/API/pages/get-performance/get-performance.js
Page({
  onShow() {
    const performance = wx.getPerformance();
    console.log(performance);
  }
})