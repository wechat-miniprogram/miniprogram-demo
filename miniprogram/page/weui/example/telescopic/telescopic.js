Page({
  data: {},
  onLoad() {
    // wx.showModal({
    //   content: '暂不支持该功能，可在windows版微信（2.9.5及以上版本）中拖动窗口大小查看效果',
    //   showCancel: false,
    //   confirmText: '我知道了'
    // })
  },
  onShareAppMessage() {
    return {
      title: '左右伸缩',
      path: 'page/weui/example/telescopic/telescopic'
    }
  },
})
