Page({
  onShareAppMessage() {
    return {
      title: '动画',
      path: 'page/API/pages/animation/animation',
      containerStyle1: '',

    }
  },

  onReady() {
    this.animation = wx.createAnimation()
  },
  rotate() {
    this.animation.rotate(Math.random() * 720 - 360).step()
    this.setData({animation: this.animation.export()})
  },
  scale() {
    this.animation.scale(Math.random() * 2).step()
    this.setData({animation: this.animation.export()})
  },
  translate() {
    this.animation.translate(Math.random() * 100 - 50, Math.random() * 100 - 50).step()
    this.setData({animation: this.animation.export()})
  },
  skew() {
    this.animation.skew(Math.random() * 90, Math.random() * 90).step()
    this.setData({animation: this.animation.export()})
  },
  rotateAndScale() {
    this.animation.rotate(Math.random() * 720 - 360)
      .scale(Math.random() * 2)
      .step()
    this.setData({animation: this.animation.export()})
  },
  rotateThenScale() {
    this.animation.rotate(Math.random() * 720 - 360).step()
      .scale(Math.random() * 2).step()
    this.setData({animation: this.animation.export()})
  },
  all() {
    this.animation.rotate(Math.random() * 720 - 360)
      .scale(Math.random() * 2)
      .translate(Math.random() * 100 - 50, Math.random() * 100 - 50)
      .skew(Math.random() * 90, Math.random() * 90)
      .step()
    this.setData({animation: this.animation.export()})
  },
  allInQueue() {
    this.animation.rotate(Math.random() * 720 - 360).step()
      .scale(Math.random() * 2).step()
      .translate(Math.random() * 100 - 50, Math.random() * 100 - 50)
      .step()
      .skew(Math.random() * 90, Math.random() * 90)
      .step()
    this.setData({animation: this.animation.export()})
  },
  reset() {
    this.animation.rotate(0, 0)
      .scale(1)
      .translate(0, 0)
      .skew(0, 0)
      .step({duration: 0})
    this.setData({animation: this.animation.export()})
  },
  change: function () {
    this.animate('#container1', [
      { opacity: 1.0, rotate: 0, backgroundColor: '#FF0000' },
      { opacity: 0.5, rotate: 45, backgroundColor: '#00FF00', offset: 0.9},
      { opacity: 0.0, rotate: 90, backgroundColor: '#FF0000' },
      ], 5000, function () {
        this.clearAnimation('#container1', { opacity: true, rotate: true }, function () {
          console.log("清除了#container上的动画属性")
        })
    }.bind(this))
    this.animate('.block1', [
      { scale: [1, 1], rotate: 0, ease: 'ease-out'  },
      { scale: [1.5, 1.5], rotate: 45, ease: 'ease-in', offset: 0.9},
      { scale: [2, 2], rotate: 90},
    ], 5000, function () {
      this.clearAnimation('.block1', { scale: true, rotate: true}, function () {
        console.log("清除了.block1上的动画属性")
      })
    }.bind(this)
    )
  },
})
