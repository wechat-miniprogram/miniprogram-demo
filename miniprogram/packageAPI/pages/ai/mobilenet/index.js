// pages/mobilenet/index.ts

import { Classifier } from './classify'

import { FpsHelper } from '../../../../util/fps_helper'

const { appWidth, appHeight, benchmarkLevel } = getApp().globalData

Page({
  classifier: null,
  ctx: null,
  fpsHelper: null,

  predicting: false,

  // For Speed Test
  constBuffer: null,

  /**
   * 页面的初始数据
   */
  data: {
    predClass: 'None',
    classifier: null,
    enableSpeedTest: false,
    avgTime: 110.0,
    minTime: 110.0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    if (this.data.enableSpeedTest) {
      this.constBuffer = new Float32Array(3 * 224 * 224)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.ctx = wx.createCanvasContext('ssd1')
    const context = wx.createCameraContext(this)
    this.initClassifier()
    this.fpsHelper = new FpsHelper()

    const listener = context.onCameraFrame(frame => {
      const fps = this.fpsHelper.getAverageFps()
      console.log(`fps=${fps}`)

      if (this.classifier && this.classifier.isReady() && !this.predicting) {
        this.executeClassify(frame)
      }
    })
    listener.start()
    this.fpsHelper.reset()
  },

  /**
   * 初始化 SSD models
   */
  initClassifier() {
    wx.showLoading({ title: '模型正在加载...' })
    this.classifier = new Classifier({ width: appWidth, height: appHeight })
    this.classifier.load().then(() => {
      wx.hideLoading()
    }).catch(err => {
      console.log('模型加载报错：', err)
    })
  },

  /**
   * 构建模型
   */
  async executeClassify(frame) {
    this.predicting = true

    if (this.classifier && this.classifier.isReady()) {
      this.fpsHelper.updateFPS()

      this.setData({
        predClass: this.classifier.predClass(),
        enableSpeedTest: this.data.enableSpeedTest
      })

      await this.classifier.detect(frame).then(() => {
        this.setData({
          predClass: this.classifier.predClass()
        })
      }).catch((err) => {
        console.log(err)
      })

      if (this.data.enableSpeedTest) {
        await this.inferSpeedTest()
      }
    }

    this.predicting = false
  },

  async inferSpeedTest() {
    console.log('runInferenceSession speed test start run===============================')

    const xinput = {
      shape: [1, 3, 224, 224],
      data: this.constBuffer.buffer,
      type: 'float32',
    }

    this.data.classifier = this.classifier

    // warm up
    for (let index = 0; index < 20; index++) {
      await this.inferOnce(xinput, this.data)
    }

    for (let l = 0; l < 5; ++l) {
      const beMs = new Date().getTime()

      for (let index = 0; index < 100; index++) {
        await this.inferOnce(xinput, this.data)
      }

      const afMs = new Date().getTime()

      const avgTime = (afMs - beMs) / 100.0

      let overall = 0.0
      let minTime = 1000000.0

      for (let index = 0; index < 100; index++) {
        const beMsTmp = new Date().getTime()
        await this.inferOnce(xinput, this.data)
        const afMsTmp = new Date().getTime()
        const tmpTime = (afMsTmp - beMsTmp)
        if (minTime > tmpTime) {
          minTime = tmpTime
        }
        overall += (afMsTmp - beMsTmp)
      }

      console.log('Inference min time: ', minTime)
      console.log('Inference avg time: ', avgTime)

      this.setData({
        predClass: this.classifier.predClass(),
        minTime,
        avgTime,
      })
    }
  },

  inferOnce(xinput, data) {
    return new Promise(function (resolve, reject) {
      data.classifier.session.run({
        input: xinput,
      }).then(async function (res) {
        resolve()
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    if (this.classifier && this.classifier.isReady()) {
      this.classifier.dispose()
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '微信小程序 × MobileNet',
      path: 'packageAPI/pages/ai/mobilenet/index',
    }
  }
})
