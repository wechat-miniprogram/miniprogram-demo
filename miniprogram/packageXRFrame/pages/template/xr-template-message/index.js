const sceneReadyBehavior = require('../../behavior-scene/scene-ready')

Page({
  behaviors: [sceneReadyBehavior],
  data: {
    messageData: {
      moveX: 0,
      moveZ: 0,
    },
    speedX: '0.00',
    speedZ: '0.00',
    posX: '0.00',
    posZ: '0.00',
    showXRFrame: true,
  },
  tapPlusX() {
    this.setData({
      messageData: {
        moveX: this.data.messageData.moveX + 1,
        moveZ: this.data.messageData.moveZ
      }
    })
  },
  tapSubX() {
    this.setData({
      messageData: {
        moveX: this.data.messageData.moveX - 1,
        moveZ: this.data.messageData.moveZ
      }
    })
  },
  tapPlusZ() {
    this.setData({
      messageData: {
        moveX: this.data.messageData.moveX,
        moveZ: this.data.messageData.moveZ + 1,
      }
    })
  },
  tapSubZ() {
    this.setData({
      messageData: {
        moveX: this.data.messageData.moveX,
        moveZ: this.data.messageData.moveZ - 1,
      }
    })
  },
  tapClose() {
    this.setData({
      showXRFrame: !this.data.showXRFrame
    })
  },
  handleInfoListener(cur) {
    const detail = cur.detail

    this.setData({
      speedX: detail.speedX,
      speedZ: detail.speedZ,
      posX: detail.posX,
      posZ: detail.posZ
    })
  }

})
