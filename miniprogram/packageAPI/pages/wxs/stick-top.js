const height = wx.getSystemInfoSync().windowHeight
Page({
  data: {
    sticky: false,
    opacity: 0,
    height: height
  },
  //滚动条监听
  onPageScroll: function (e) {
    // console.log('page scroll')
  },
  onShow() {
    
  },
  onReady() {
  }
})