Page({
  data: {
    width: 300,
    height: 300,
    renderWidth: 300,
    renderHeight: 300,
    showDialog: false,
    name: '',
    text: '',
    bg: 'rgba(0, 0, 0, 0)',
    start: '',
    hint: '',
    end: '',
    showLightButton: false,
    lightButtonDisable: true,
    lightProgress: 1,
    nextAction: ''
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
  handleRequireLight({ detail }) {
    const { state, wait } = detail
    console.log('light', state, wait)
    if (state === 'hide') {
      this.setData({ showLightButton: false })
      return
    }

    this.setData({
      showLightButton: true,
      lightButtonDisable: state === 'cd',
      nextAction: '',
      lightProgress: state === 'cd' ? 1 - wait : 1
    })
  },
  handleRequireDialog({ detail }) {
    const { texts, name, from } = detail
    this.texts = texts
    this.textIndex = 0
    this.from = from
    this.setData({
      name: name || '',
      text: texts[0],
      showDialog: true,
      bg: from === 'step' ? '#000' : 'rgba(0, 0, 0, 0)'
    })
  },
  handleClickDialog() {
    this.textIndex += 1
    if (this.textIndex > this.texts.length) {
      return
    }

    if (this.textIndex === this.texts.length) {
      this.setData({ text: '', name: '', bg: '#000' })
      setTimeout(() => {
        this.textIndex = 0
        this.setData({ showDialog: false, nextAction: this.from })
      }, 1000)
      return
    }

    const text = this.texts[this.textIndex]
    const tmp = /[\s\S]+?\{\{([\s\S]+?)\}\}[\s\S]+?/.exec(text)
    if (tmp) {
      const hint = tmp[1]
      const [start, end] = text.split('{{' + hint + '}}')
      console.log({ start, hint, end })
      this.setData({ start, hint, end })
    } else {
      this.setData({ text: this.texts[this.textIndex], hint: '' })
    }
  },
  handleTriggerLight() {
    if (this.data.lightButtonDisable) {
      return
    }

    this.setData({ nextAction: 'light' })
  }
})
