Page({
  data: {
    width: 300,
    height: 300,
    renderWidth: 300,
    renderHeight: 300,
    texts: []
  },
  onShow() {
    wx.hideHomeButton()
  },
  onHide() {
    wx.showHomeButton()
  },
  onLoad() {
    const info = wx.getSystemInfoSync()
    const width = info.windowWidth
    const height = info.windowHeight
    const dpi = info.pixelRatio
    this.setData({
      width,
      height,
      renderWidth: width * dpi,
      renderHeight: height * dpi
    })
  },
  handleChangeTexts({ detail }) {
    this.setData({ texts: detail })
  },
  handleShowNote({ detail }) {
    wx.showModal({
      title: '最后的记录',
      content: detail,
      showCancel: false,
      confirmText: '放下记录'
    })
  }
})
