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
  doPopup(position) {
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
      customStyle,
      duration
    }, () => {
      this.setData({ show: true })
    })
  },
  popup(e) {
    const position = e.currentTarget.dataset.position
    this.doPopup(position)
  },
  changeRound() {
    this.setData({ round: !this.data.round })
    this.doPopup('bottom')
  },
  changeOverlay() {
    this.setData({ overlay: !this.data.overlay })
    this.doPopup('bottom')
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
    this.setData({ overlayStyle })
    this.doPopup('bottom')
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
