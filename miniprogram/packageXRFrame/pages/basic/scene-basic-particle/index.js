const sceneReadyBehavior = require('../../behavior-scene/scene-ready')
const handleDecodedXML = require('../../behavior-scene/util').handleDecodedXML

const xmlCode = ';'

Page({
  behaviors: [sceneReadyBehavior],
  data: {
    xmlCode: '',
    capacity: 0,
    emitRate: 0,
    lifeTime: 0,
  },

  calc(variable, add = true, number = 1) {
    let temp = variable
    let result = temp
    let count = 1
    while (Math.floor(temp / 10)) {
      count++
      temp = Math.floor(temp / 10)
    }
    if (add) {
      result += number * 10 ** (count - 1)
    } else {
      if (result <= number * 10 ** (count - 1)) {
        count--
        if (count < 1) {
          count = 1
        }
      }
      result -= number * 10 ** (count - 1)
      if (result < 0) {
        result = 0
      }
    }
    return Number(result.toFixed(1))
  },
  handleAdd() {
    this.setData({ capacity: this.calc(this.data.capacity, true) })
  },
  handleSub() {
    this.setData({ capacity: this.calc(this.data.capacity, false) })
  },
  handleRateAdd() {
    this.setData({ emitRate: this.calc(this.data.emitRate, true) })
  },
  handleRateSub() {
    this.setData({ emitRate: this.calc(this.data.emitRate, false) })
  },
  handleTimeAdd() {
    this.setData({ lifeTime: this.calc(this.data.lifeTime, true, 0.1) })
  },
  handleTimeSub() {
    this.setData({ lifeTime: this.calc(this.data.lifeTime, false, 0.1) })
  }
})
