// pages/stype-trans/index.js.ts
Page({
  session: null,

  canvasCtx: null, // on screen canvas
  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    imageWidth: 224,
    imageHeight: 224,
    imageChannel: 3,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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

  },

  takePhoto() {
    const camera = wx.createCameraContext()
    camera.takePhoto({
      quality: 'normal',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })

        const canvas = wx.createOffscreenCanvas({ type: '2d', width: this.data.imageWidth, height: this.data.imageHeight })

        const ctx = canvas.getContext('2d')

        const image = canvas.createImage()

        // wait for image upload
        new Promise(resolve => {
          image.onload = resolve
          image.src = this.data.src
        }).then(() => {
          // init the inferenceSession
          this.InitSession().then(() => {
            // create input
            ctx.clearRect(0, 0, this.data.imageWidth, this.data.imageHeight)
            ctx.drawImage(image, 0, 0, this.data.imageWidth, this.data.imageHeight)

            // get the imgdata
            const imgData = ctx.getImageData(0, 0, this.data.imageWidth, this.data.imageHeight)

            // use the image data
            this.detect(imgData)
          })
        })
      }
    })
  },

  InitSession() {
    return new Promise((resolve, reject) => {
      const modelPath = `${wx.env.USER_DATA_PATH}/mosaic-8.onnx`

      // 判断之前是否已经下载过onnx模型
      wx.getFileSystemManager().access({
        path: modelPath,
        success: (res) => {
          console.log('file already exist at: ' + modelPath)
          this.createInferenceSession(modelPath).then(() => {
            resolve()
          })
        },
        fail: (res) => {
          console.error(res)

          wx.cloud.init()
          console.log('begin download model')

          const cloudPath = 'cloud://containertest-0gmw3ulnd8d9bc7b.636f-containertest-0gmw3ulnd8d9bc7b-1258211818/mosaic-8.onnx'

          this.downloadFile(cloudPath, function (r) {
            console.log(`下载进度：${r.progress}%，已下载${r.totalBytesWritten}B，共${r.totalBytesExpectedToWrite}B`)
          }).then(result => {
            wx.getFileSystemManager().saveFile({
              tempFilePath: result.tempFilePath,
              filePath: modelPath,
              success: (res) => { // 注册回调函数
                console.log(res)

                const modelPath = res.savedFilePath
                console.log('save onnx model at path: ' + modelPath)

                this.createInferenceSession(modelPath).then(() => {
                  resolve()
                })
              },
              fail(res) {
                console.error(res)
              }
            })
          })
        }
      })
    })
  },

  createInferenceSession(modelPath) {
    return new Promise((resolve, reject) => {
      this.session = wx.createInferenceSession({
        model: modelPath,
        /* 0: Lowest  precision e.g., LS16 + A16 + Winograd A16 + approx. math
           1: Lower   precision e.g., LS16 + A16 + Winograd off + approx. math
           2: Modest  precision e.g., LS16 + A32 + Winograd A32 + approx. math
           3: Higher  precision e.g., LS32 + A32 + Winograd A32 + approx. math
           4: Highest precision e.g., LS32 + A32 + Winograd A32 + precise math

           Higher precision always require longer time to run session
        */
        precisionLevel: 4,
        allowNPU: false, // wheather use NPU for inference, only useful for IOS
        allowQuantize: false, // wheather generate quantize model
      })

      // 监听error事件
      this.session.onError((error) => {
        console.error(error)
        reject(error)
      })
      this.session.onLoad(() => {
        resolve()
      })
    })
  },

  downloadFile(fileID, onCall = () => {}) {
    return new Promise((resolve, reject) => {
      const task = wx.cloud.downloadFile({
        fileID,
        success: res => resolve(res),
        fail: e => {
          const info = e.toString()
          if (info.indexOf('abort') != -1) {
            reject(new Error('【文件下载失败】中断下载'))
          } else {
            reject(new Error('【文件下载失败】网络或其他错误'))
          }
        }
      })
      task.onProgressUpdate((res) => {
        if (onCall(res) == false) {
          task.abort()
        }
      })
    })
  },

  detect(imgData) {
    return new Promise((resolve, reject) => {
      const uint8Data = new Uint8Array(imgData.data)

      const floatData = new Float32Array(this.data.imageChannel * this.data.imageHeight * this.data.imageWidth)

      // nhwc uint8 data to nchw float32 data, and ignore the alpha channel
      const modelChannel = this.data.imageChannel

      const imageWH = this.data.imageHeight * this.data.imageWidth

      let idx = 0
      for (let c = 0; c < modelChannel; ++c) {
        for (let wh = 0; wh < imageWH; ++wh) {
          const inputIdx = wh * 4 + c
          floatData[idx] = uint8Data[inputIdx]
          idx++
        }
      }

      const xinput = {
        shape: [1, 3, 224, 224], // Input data shape in NCHW
        data: floatData.buffer,
        type: 'float32', // Input data type
      }

      this.session.run({
        // Here string "input1" Should be the same with the input name in onnx file
        input1: xinput,
      }).then((res) => {
        // Here use res.outputname.data, outputname
        // Should be the same with the output name in onnx file
        const output = new Float32Array(res.output1.data)

        const hwSize = imgData.height * imgData.width

        const finalout = new Uint8ClampedArray(4 * hwSize)

        // fill the alpha channel
        finalout.fill(255)

        // convert from nchw to nhwc
        idx = 0
        for (let c = 0; c < modelChannel; ++c) {
          for (let hw = 0; hw < hwSize; ++hw) {
            const dstIdx = hw * 4 + c
            finalout[dstIdx] = Math.max(0, Math.min(Math.round(output[idx]), 255))
            idx++
          }
        }

        this.canvasCtx = wx.createCanvasContext('trans')

        wx.canvasPutImageData({
          canvasId: 'trans',
          data: finalout,
          height: 224,
          width: 224,
          x: 0,
          y: 0,
        }).then((res) => {
          console.log(res)
        })
      })

      resolve()
    })
  },

  error(e) {
    console.log(e.detail)
  }
})
