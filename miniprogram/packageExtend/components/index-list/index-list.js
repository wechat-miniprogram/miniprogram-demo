const throttle = function throttle(func, wait, options) {
  let context = void 0
  let args = void 0
  let result = void 0
  let timeout = null
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
    addGlobalClass: true,
    pureDataPattern: /^_/
  },
  properties: {
    list: {
      type: Array,
      value: [],
      observer: function observer(newVal) {
        const _this = this

        if (newVal.length === 0) return
        const data = this.data
        const alphabet = data.list.map(function (item) {
          return item.alpha
        })
        this.setData({
          alphabet,
          current: alphabet[0]
        }, function () {
          _this.computedSize()
        })
      }
    },
    vibrated: {
      type: Boolean,
      value: true
    }
  },

  data: {
    windowHeight: 612,
    current: 'A',
    intoView: '',
    touching: false,
    alphabet: [],
    _tops: [],
    _anchorItemH: 0,
    _anchorItemW: 0,
    _anchorTop: 0,
    _listUpperBound: 0
  },

  lifetimes: {
    created() {

    },
    attached() {
      this.__scrollTo = throttle(this._scrollTo, 100, {})
      this.__onScroll = throttle(this._onScroll, 100, {})

      const _wx$getSystemInfoSync = wx.getSystemInfoSync(); const
        windowHeight = _wx$getSystemInfoSync.windowHeight

      this.setData({windowHeight})
    },
  },
  methods: {
    choose(e) {
      const item = e.target.dataset.item
      this.triggerEvent('choose', {item})
    },
    scrollTo(e) {
      this.__scrollTo(e)
    },
    _scrollTo(e) {
      const data = this.data
      const clientY = e.changedTouches[0].clientY
      const index = Math.floor((clientY - data._anchorTop) / data._anchorItemH)
      const current = data.alphabet[index]
      this.setData({current, intoView: current, touching: true})
      if (data.vibrated) wx.vibrateShort()
    },
    computedSize() {
      const data = this.data
      const query = this.createSelectorQuery()
      query.selectAll('.city_list_item').boundingClientRect(function (rects) {
        const result = rects
        data._tops = result.map(function (item) {
          return item.top
        })
      }).exec()
      query.select('.anchor-list').boundingClientRect(function (rect) {
        data._anchorItemH = rect.height / data.alphabet.length
        data._anchorItemW = rect.width
        data._anchorTop = rect.top
      }).exec()
      query.select('.page-select-city').boundingClientRect(function (rect) {
        data._listUpperBound = rect.top
      })
    },
    removeTouching: function removeTouching() {
      const _this2 = this

      setTimeout(function () {
        _this2.setData({touching: false})
      }, 150)
    },
    onScroll: function onScroll(e) {
      this.__onScroll(e)
    },
    _onScroll: function _onScroll(e) {
      const data = this.data
      const _tops = data._tops; const
        alphabet = data.alphabet

      const scrollTop = e.detail.scrollTop
      let current = ''
      if (scrollTop < _tops[0]) {
        current = alphabet[0]
      } else {
        for (let i = 0, len = _tops.length; i < len - 1; i++) {
          if (scrollTop >= _tops[i] && scrollTop < _tops[i + 1]) {
            current = alphabet[i]
          }
        }
      }
      if (!current) current = alphabet[alphabet.length - 1]
      this.setData({current})
    }
  }
})
