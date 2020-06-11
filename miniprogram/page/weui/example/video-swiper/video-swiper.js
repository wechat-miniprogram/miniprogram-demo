const urls = [

  'https://res.wx.qq.com/wxaliveplayer/htdocs/video14e1eea.mov',
  'https://res.wx.qq.com/wxaliveplayer/htdocs/video24e1eeb.mov',
  'https://res.wx.qq.com/wxaliveplayer/htdocs/video34e1eeb.mov',
  'https://res.wx.qq.com/wxaliveplayer/htdocs/video44e1eeb.mov',
  'https://res.wx.qq.com/wxaliveplayer/htdocs/video54e1eeb.mov'

]
import CustomPage from '../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'video-swiper',
      path: 'page/weui/example/video-swiper/video-swiper'
    }
  },
  data: {
    videoList: [],
  },
  onLoad() {

    const videoList = urls.map((item, index) => {
      return {
        id: index, 
        url: item,
        objectFit: 'contain'
      }
    })
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
  onPlay(e) {},

  onPause(e) {
    //  console.log('pause', e.detail.activeId)
  },

  onEnded(e) {},

  onError(e) {},

  onWaiting(e) {},

  onTimeUpdate(e) {},

  onProgress(e) {},

  onLoadedMetaData(e) {
    console.log('LoadedMetaData', e)
  }
});