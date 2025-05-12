const sceneReadyBehavior = require('../../behavior-scene/scene-ready')

Page({
  behaviors: [sceneReadyBehavior],
  data: {
    menu: [],
    radius: 80
  },
  touchEnd(e) {
    moveIdx = -1
    // 当位移触摸点松开时，保证旋转触摸点取的为第一接触点
    if (rotateIdx == 1) rotateIdx = 0
    this.setData({
      hLeft: centerX - hWidth / 2,
      hTop: centerY - hHeight / 2,
      transferData: {
        biasX: 0,
        biasY: 0,
      }
    })
  },
  animateChoose(e) {
    console.log('choose:', e.currentTarget.dataset.index)
    this.setData({
      itemIndex: e.currentTarget.dataset.index
    })
  },
  processMenu() {
    const positionX = (this.data.touchPos.x + 1) / 2 * this.data.width
    const positionY = (1 - (this.data.touchPos.y + 1) / 2) * this.data.height
    const radius = this.data.radius * this.data.len
    const item = []
    const animLength = this.data.clipName.length
    let offsetAngle
    if (animLength > 6) {
      offsetAngle = 2 * Math.PI / animLength
    } else {
      offsetAngle = Math.PI / animLength
    }

    const originAngle = -Math.PI / 2

    for (let i = 0; i < animLength; i++) {
      const x = radius * Math.cos(originAngle + i * offsetAngle)
      const y = radius * Math.sin(originAngle + i * offsetAngle)

      var text
      switch (i) {
        case 0:
          text = '暂停'
          break
        case 1:
          text = '继续'
          break
        default:
          text = this.data.clipName[i - 2]
          break
      }
      item.push({
        index: i, x: positionX, y: positionY, biasX: x, biasY: y, text
      })
    }
    this.setData({
      menu: item
    })
  },
  handleInfoListener(cur) {
    const detail = cur.detail
    //  console.log("receive:", detail)
    if (detail.clipName) {
      this.setData({
        clipName: detail.clipName
      })
    }

    if (detail.position) {
      this.setData({
        touchPos: detail.position,
        len: detail.len
      })
      this.processMenu()
    }
  }
})
