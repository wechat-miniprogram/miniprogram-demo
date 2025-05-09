const sceneReadyBehavior = require('../../behavior-scene/scene-ready')

// 当前触摸点位置
let currentTouchX = 0
let currentTouchY = 0

// 触摸点序号
let rotateIdx = -1
let moveIdx = -1

// 摇杆所处中心
const centerX = 50
const centerY = 50
// 摇杆宽高
const hWidth = 40
const hHeight = 40
// 摇杆盘半径
const radius = 50

Page({
  behaviors: [sceneReadyBehavior],
  data: {
    height: 600,
    heightScale: 0.8,
    // 重置初始位置的标记
    reset: 0,
    // 相对背景偏移，命名 h=handle 摇杆
    hTop: 30,
    hLeft: 30,
    transferData: {
      // 相对摇杆中心的偏移
      biasX: 0,
      biasY: 0,

      // 开始旋转时的基准点
      initRotX: 0,
      initRotY: 0,
      // 旋转时的触摸点位置
      biasRotX: 0,
      biasRotY: 0,
    }
  },
  reset() {
    this.setData({
      reset: this.data.reset + 1
    })
  },
  touchStart(e) {},
  touchMove(e) {
    // 无旋转触摸点触屏时，保证移动触摸点为第一触摸点
    if (rotateIdx == -1) {
      moveIdx = 0
    } else {
      // 当两点触屏时，保证移动触摸点与旋转触摸点对应的点序列互斥
      moveIdx = ~rotateIdx & 0x01
    }
    const touchX = e.touches[moveIdx].clientX - 30
    const touchY = e.touches[moveIdx].clientY - (this.data.height - 100)
    const posInfo = this.limitPosition(touchX, touchY)
    this.setData({
      hLeft: centerX - hWidth / 2 + posInfo.posX,
      hTop: centerY - hHeight / 2 + posInfo.posY,
      transferData: {
        biasX: posInfo.posX,
        biasY: posInfo.posY,
      }
    })
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

  touchRotateStart(e) {
    if (moveIdx == -1) {
      rotateIdx = 0
    } else {
      rotateIdx = ~moveIdx & 0x01
    }
    currentTouchX = e.touches[rotateIdx].clientX
    currentTouchY = e.touches[rotateIdx].clientY
    this.setData({
      transferData: {
        initRotX: currentTouchX,
        initRotY: currentTouchY,
      }
    })
  },

  touchRotateMove(e) {
    if (moveIdx == -1) {
      rotateIdx = 0
    } else {
      rotateIdx = ~moveIdx & 0x01
    }
    currentTouchX = e.touches[rotateIdx].clientX
    currentTouchY = e.touches[rotateIdx].clientY
    this.setData({
      transferData: {
        biasRotX: currentTouchX,
        biasRotY: currentTouchY,
      }
    })
  },

  touchRotateEnd(e) {
    rotateIdx = -1
    // 当旋转触摸点松开时，保证位移触摸点取的为第一接触点
    if (moveIdx == 1) moveIdx = 0
    this.setData({
      transferData: {
        biasRotX: 0,
        biasRotY: 0,
      }
    })
  },

  // 将位移强度限制在摇杆盘的范围中
  limitPosition(touchX, touchY) {
    let x = touchX - centerX
    let y = touchY - centerY
    const z = Math.sqrt(x * x + y * y)
    // 位移未超出摇杆盘范围时
    if (z <= radius) {
      x = Math.round(x)
      y = Math.round(y)
      return {
        posX: x,
        posY: y
      }
    } else {
      // 位移超出摇杆盘范围，需要对应限制位移强度
      const ratio = radius / z
      x *= ratio
      y *= ratio
      x = Math.round(x)
      y = Math.round(y)
      return {
        posX: x,
        posY: y
      }
    }
  }
})
