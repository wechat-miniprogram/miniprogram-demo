const {fib} = require('../../../../util/util.js')

Page({
  onShareAppMessage() {
    return {
      title: '多线程Worker',
      path: 'packageAPI/pages/worker/worker/worker'
    }
  },

  data: {
    theme: 'light',
    res: '',
    input: 35,
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
    this._worker = wx.createWorker('workers/fib/index.js')
  },

  onUnload() {
    clearInterval(this.interval)
    if (this._worker) this._worker.terminate()
  },

  bindInput(e) {
    const val = Number(e.detail.value)
    if (val > 40) return {value: 40}
    if (Number.isNaN(val)) return {value: 33}
    this.setData({
      input: val
    })
    return undefined
  },

  reset() {
    this.setData({res: ''})
  },

  compute() {
    this.reset()
    wx.showLoading({
      title: '计算中...'
    })
    const t0 = +Date.now()
    const res = fib(this.data.input)
    const t1 = +Date.now()
    wx.hideLoading()
    this.setData({
      res,
      time: t1 - t0
    })
  },

  multiThreadCompute() {
    this.reset()
    wx.showLoading({
      title: '计算中...'
    })

    const t0 = +Date.now()
    this._worker.postMessage({
      type: 'execFunc_fib',
      params: [this.data.input]
    })
    this._worker.onMessage((res) => {
      if (res.type === 'execFunc_fib') {
        wx.hideLoading()
        const t1 = +Date.now()
        this.setData({
          res: res.result,
          time: t1 - t0
        })
      }
    })
  },

  onReady() {
    this.position = {
      x: 150,
      y: 150,
      vx: 2,
      vy: 2
    }

    this.drawBall()
    this.interval = setInterval(this.drawBall, 17)
  },

  drawBall() {
    const p = this.position
    p.x += p.vx
    p.y += p.vy
    if (p.x >= 300) {
      p.vx = -2
    }
    if (p.x <= 7) {
      p.vx = 2
    }
    if (p.y >= 300) {
      p.vy = -2
    }
    if (p.y <= 7) {
      p.vy = 2
    }

    const context = wx.createContext()

    function ball(x, y) {
      context.beginPath(0)
      context.arc(x, y, 5, 0, Math.PI * 2)
      context.setFillStyle('#1aad19')
      context.setStrokeStyle('rgba(1,1,1,0)')
      context.fill()
      context.stroke()
    }

    ball(p.x, 150)
    ball(150, p.y)
    ball(300 - p.x, 150)
    ball(150, 300 - p.y)
    ball(p.x, p.y)
    ball(300 - p.x, 300 - p.y)
    ball(p.x, 300 - p.y)
    ball(300 - p.x, p.y)

    wx.drawCanvas({
      canvasId: 'canvas',
      actions: context.getActions()
    })
  },

})
