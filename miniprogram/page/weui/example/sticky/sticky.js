import CustomPage from '../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'sticky',
      path: 'page/weui/example/sticky/sticky'
    }
  },
  data: {

  },

  onLoad() {

  },

  onReady() {
    this.setData({
      container: () => wx.createSelectorQuery().select('#container')
    })
  },

  onScroll(e) {
    console.log('onScroll', e)
  }
})
