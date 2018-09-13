Page({
  onShareAppMessage() {
    return {
      title: 'navigatePage',
      path: 'page/component/pages/navigator/navigate'
    }
  },

  onLoad(options) {
    console.log(options)
    this.setData({
      title: options.title
    })
  }
})
