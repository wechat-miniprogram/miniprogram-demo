const windowWidth = wx.getSystemInfoSync().windowWidth
Page({
  data: {
    imgUrls: [
      './image/1.jpeg',
      './image/2.jpg',
      './image/3.jpg',
      './image/4.jpg'
    ],
    imgSize: [{
      height: 150
    }, {
      height: 200
    }, {
      height: 150
    }, {
      height: 150
    }],
    indicatorDots: true,
    autoplay: false,
    interval: 3000,
    duration: 500,
    left: 0,
    windowWidth: windowWidth
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  swiperTransition1(e) {
    console.log('e.transition', e)
    this.setData({
      left: (e.detail.x) / 4
    })
  },
  onReady() {
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  }
})