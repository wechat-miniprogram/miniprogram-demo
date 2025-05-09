Page({
  onShareAppMessage() {
    return {
      title: 'page-container',
      path: 'packageComponent/pages/view/page-container/page-container'
    }
  },
  data: {
    theme: 'light',
    show: false,
    duration: 300,
    position: 'right',
    round: false,
    overlay: true,
    customStyle: '',
    overlayStyle: ''
  },
  onUnload() {
    if (wx.offThemeChange) {
      wx.offThemeChange()
    }
  },
  onLoad() {
    this.setData({
      theme: getApp().globalData.theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        this.setData({ theme })
      })
    }
  },
  popup(e) {
    const position = e.currentTarget.dataset.position
    let customStyle = ''
    const duration = this.data.duration
    switch (position) {
      case 'top':
      case 'bottom':
        customStyle = 'height: 30%;'
        break
      case 'right':
        break
    }
    this.setData({
      position,
      show: true,
      customStyle,
      duration
    })
  },
  changeRound() {
    this.setData({ round: !this.data.round })
  },
  changeOverlay() {
    this.setData({ overlay: !this.data.overlay, show: true })
  },
  changeOverlayStyle(e) {
    let overlayStyle = ''
    const type = e.currentTarget.dataset.type
    switch (type) {
      case 'black':
        overlayStyle = 'background-color: rgba(0, 0, 0, 0.7)'
        break
      case 'white':
        overlayStyle = 'background-color: rgba(255, 255, 255, 0.7)'
        break
      case 'blur':
        overlayStyle = 'background-color: rgba(0, 0, 0, 0.7); filter: blur(4px);'
    }
    this.setData({ overlayStyle, show: true })
  },
  exit() {
    this.setData({ show: false })
  },
  onBeforeEnter(res) {
    console.log(res)
  },
  onEnter(res) {
    console.log(res)
  },
  onAfterEnter(res) {
    console.log(res)
  },
  onBeforeLeave(res) {
    console.log(res)
  },
  onLeave(res) {
    console.log(res)
  },
  onAfterLeave(res) {
    console.log(res)
  },
  onClickOverlay(res) {
    console.log(res)
  }
})
