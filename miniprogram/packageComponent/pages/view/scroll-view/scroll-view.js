const order = ['demo1', 'demo2', 'demo3']

Page({
  data: {
    theme: 'light'
  },
  onLoad() {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({theme}) => {
        this.setData({theme})
      })
    }
    this.animate('#scroll-sample-object1', [{
      borderRadius: '0',
      offset: 0,
    }, {
      borderRadius: '25%',
      offset: 0.5,
    }, {
      borderRadius: '50%',
      offset: 1
    }], 2000, {
      scrollSource: '#scroll-view_D',
      timeRange: 2000,
      startScrollOffset: 0,
      endScrollOffset: 150,
    })

    this.animate('#scroll-sample-object2', [{
      opacity: 1,
      offset: 0,
    }, {
      opacity: 0.5,
      offset: 0.5,
    }, {
      opacity: 0.3,
      offset: 1
    }], 2000, {
      scrollSource: '#scroll-view_D',
      timeRange: 2000,
      startScrollOffset: 150,
      endScrollOffset: 300,
    })

    this.animate('#scroll-sample-object3', [{
      background: 'white',
      offset: 0,
    }, {
      background: 'yellow',
      offset: 1
    }], 2000, {
      scrollSource: '#scroll-view_D',
      timeRange: 2000,
      startScrollOffset: 300,
      endScrollOffset: 400,
    })
  },
  onPulling(e) {
    console.log('onPulling:', e)
  },
  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
      })
      this._freshing = false
    }, 3000)
  },
  onRestore(e) {
    console.log('onRestore:', e)
  },
  onAbort(e) {
    console.log('onAbort', e)
  },
  onShareAppMessage() {
    return {
      title: 'scroll-view',
      path: 'packageComponent/pages/view/scroll-view/scroll-view'
    }
  },

  data: {
    theme: 'light',
    toView: 'green',
    triggered: false,
  },

  upper(e) {
    console.log(e)
  },

  lower(e) {
    console.log(e)
  },

  scroll(e) {
    console.log(e)
  },

  scrollToTop() {
    this.setAction({
      scrollTop: 0
    })
  },

  tap() {
    for (let i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1],
          scrollTop: (i + 1) * 200
        })
        break
      }
    }
  },

  tapMove() {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  }
})
