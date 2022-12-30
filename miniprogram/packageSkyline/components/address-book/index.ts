const throttle = function throttle(func, wait, options) {
  let context
  let args
  let result = void 0
  let timeout
  let previous = 0
  if (!options) options = {}
  const later = function later() {
    previous = options.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }
  return function () {
    const now = Date.now()
    if (!previous && options.leading === false) previous = now
    const remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      clearTimeout(timeout)
      timeout = null
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}

Component({
  behaviors: [],
  options: {
    addGlobalClass: false,
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  properties: {
    list: {
      type: Array,
      value: [],
      observer(newVal) {
        if (newVal.length === 0) return
        const alphabet = this.data.list.map((item, index) => {
          this.data._tops[index] = 2e10
          return item.alpha
        })
        this._sharedTops.value = this.data._tops
        this.setData({
          alphabet,
          current: alphabet[0]
        }, () => {
          this.computedSize()
        })
      },
    },
  },

  data: {
    current: 'A',
    intoView: '',
    touching: false,
    alphabet: [],
    _vibrated: true,
    _tops: [],
    _anchorItemH: 0,
    _anchorItemW: 0,
    _anchorTop: 0,
  },

  observers: {
    'current': function (current) {
      this._sharedCurrentIdx.value = this.data.alphabet.indexOf(current)
    },
  },

  lifetimes: {
    created() {
      this._handlePan = throttle(this._handlePan, 100, {})
      this._sharedTops = wx.worklet.shared([])
      this._sharedScrollTop = wx.worklet.shared(0)
      this._sharedHeight = wx.worklet.shared(0)
      this._sharedCurrentIdx = wx.worklet.shared(0)
    },
    attached() {
      // scroll-view 高度
      this.createSelectorQuery().select('.scroll-view').boundingClientRect(res => {
        this._sharedHeight.value = res.height
      }).exec()

      // 右侧目录计算
      const query = this.createSelectorQuery()
      query.select('.anchor-list').boundingClientRect(rect => {
        this.data._anchorItemH = rect.height / this.data.alphabet.length
        this.data._anchorItemW = rect.width
        this.data._anchorTop = rect.top
      }).exec()
    },
  },
  methods: {
    handlePan(e) {
      this._handlePan(e)
    },
    _handlePan(e) {
      const data = this.data
      const clientY = e.changedTouches[0].clientY
      const index = Math.floor((clientY - data._anchorTop) / data._anchorItemH)
      const current = data.alphabet[index]
      if (current !== this.data.current) {
        wx.vibrateShort({
          type: 'light'
        })
      }
      this.setData({
        current,
        intoView: current,
        touching: true
      })
    },
    cancelPan() {
      setTimeout(() => {
        this.setData({ touching: false })
      }, 150)
    },
    computedSize() {
      this.data.alphabet.forEach((element, index) => {
        this.createIntersectionObserver().relativeToViewport().observe(`#${element}`, (res) => {
          const ratio = res.intersectionRatio
          const rect = res.intersectionRect
          if (ratio === 1 && rect.top === 0 && rect.bottom >= rect.height) {
            // 得出每个 header 距离 scroll-view 滚动顶部的 offsetTop
            this.data._tops[index] = res.boundingClientRect.top + this._sharedScrollTop.value
            this._sharedTops.value = this.data._tops
          }
        })
      })
    },
    handleScroll(e) {
      'worklet'
      const scrollTop = e.detail.scrollTop
      this._sharedScrollTop.value = scrollTop
      const tops = this._sharedTops.value
      for (let i = tops.length - 1; i >= 0; i--) {
        // header 超过屏幕一半就改为选中态
        if (scrollTop + this._sharedHeight.value / 2 > tops[i]) {
          if (i !== this._sharedCurrentIdx.value) {
            wx.worklet.runOnJS(this.updateCurrent.bind(this))(i)
          }
          break
        }
      }
    },
    updateCurrent(idx) {
      this.setData({ current: this.data.alphabet[idx] })
    },
  }
})
