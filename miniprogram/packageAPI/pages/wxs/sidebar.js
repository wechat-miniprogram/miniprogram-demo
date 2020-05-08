// page/one/index.js
Page({
  data: {
    open: false,
    mark: 0,
    newmark: 0,
    startmark: 0,
    endmark: 0,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    staus: 1,
    translate: ''
  },
  onReady() {
    // setTimeout(() => {
      // this.initInteraction()
    // }, 5000)
  }
})