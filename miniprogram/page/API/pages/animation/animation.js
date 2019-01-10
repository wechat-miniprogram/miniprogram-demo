Page({
  onShareAppMessage() {
    return {
      title: '动画',
      path: 'page/API/pages/animation/animation'
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
  }
})
