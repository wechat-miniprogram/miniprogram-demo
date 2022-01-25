import CustomPage from '../../../base/CustomPage'

const urls = [

  'https://res.wx.qq.com/wxaliveplayer/htdocs/video14e1eea.mov',
  'https://res.wx.qq.com/wxaliveplayer/htdocs/video24e1eeb.mov',
  'https://res.wx.qq.com/wxaliveplayer/htdocs/video34e1eeb.mov',
  'https://res.wx.qq.com/wxaliveplayer/htdocs/video44e1eeb.mov',
  'https://res.wx.qq.com/wxaliveplayer/htdocs/video54e1eeb.mov'

]

CustomPage({
  onShareAppMessage() {
    return {
      title: 'video-swiper',
      path: 'packageExtend/pages/extend/video-swiper/video-swiper'
    }
  },
  data: {
    videoList: [],
  },
  onLoad() {
    const videoList = urls.map((item, index) => ({
      id: index,
      url: item,
      objectFit: 'contain'
    }))
    this.setData({
      videoList,
    })
  },
  onReady() {

  },
  onShow() {

  },
  onHide() {

  },
  onUnload() {

  },
  onPlay() {},

  onPause() {
    //  console.log('pause', e.detail.activeId)
  },

  onEnded() {},

  onError() {},

  onWaiting() {},

  onTimeUpdate() {},

  onProgress() {},

  onLoadedMetaData(e) {
    console.log('LoadedMetaData', e)
  }
})
