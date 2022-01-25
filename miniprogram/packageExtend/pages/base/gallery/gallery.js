import CustomPage from '../../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'gallery',
      path: 'page/weui/example/gallery/gallery'
    }
  },
  data: {
    imgUrls: [
      'https://res.wx.qq.com/op_res/0TZreUFL8sWsS1cFx5_f7MF5aY767_cWsd9JiKdHxL9Ktu6O6JLAJwvF-jLVxpB3',
      'https://res.wx.qq.com/op_res/0TZreUFL8sWsS1cFx5_f7MF5aY767_cWsd9JiKdHxL9Ktu6O6JLAJwvF-jLVxpB3',
      'https://res.wx.qq.com/op_res/0TZreUFL8sWsS1cFx5_f7MF5aY767_cWsd9JiKdHxL9Ktu6O6JLAJwvF-jLVxpB3'
    ],
    show: true
  },
  change(e) {
    console.log('current index has changed', e.detail)
  },
  delete(e) {
    console.log('delete', e.detail)
  },
  hide() {
    console.log('component hide')
    setTimeout(() => {
      console.log('component show')
      this.setData({
        show: true
      })
    }, 1000)
  }
})
