import getBehavior from './behavior'
import yuvBehavior from './yuvBehavior'

const NEAR = 0.001
const FAR = 1000

Component({
  behaviors: [getBehavior(), yuvBehavior],
  data: {
    handImgUrl: '',
    handImgWidth: 0,
    handImgHeight: 0,
    handImgOriginWidth: 0,
    handImgOriginHeight: 0,
    theme: 'light',
  },
  lifetimes: {
    /**
        * 生命周期函数--监听页面加载
        */
    detached() {
      console.log('页面detached')
      if (wx.offThemeChange) {
        wx.offThemeChange()
      }
    },
    ready() {
      console.log('页面准备完全')
      this.setData({
        theme: getApp().globalData.theme || 'light'
      })

      if (wx.onThemeChange) {
        wx.onThemeChange(({ theme }) => {
          this.setData({ theme })
        })
      }
    },
  },
  methods: {
    chooseMedia() {
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        success: res => {
          console.log('chooseMedia res', res)
          const imgUrl = res.tempFiles[0].tempFilePath
          wx.getImageInfo({
            src: imgUrl,
            success: res => {
              const fixWidth = 300
              const {
                width,
                height
              } = res
              console.log('getImageInfo res', res)
              this.setData({
                handImgUrl: imgUrl,
                handImgWidth: fixWidth,
                handImgHeight: (fixWidth / width) * height,
                handImgOriginWidth: width,
                handImgOriginHeight: height
              })
            },
            fail: res => {
              console.error(res)
            }
          })
        },
        fail: res => {
          console.error(res)
        }
      })
    },
    init() {
      this.initGL()
    },
    render(frame) {
      return
      this.renderGL(frame)

      const camera = frame.camera

      // 相机
      if (camera) {
        this.camera.matrixAutoUpdate = false
        this.camera.matrixWorldInverse.fromArray(camera.viewMatrix)
        this.camera.matrixWorld.getInverse(this.camera.matrixWorldInverse)

        const projectionMatrix = camera.getProjectionMatrix(NEAR, FAR)
        this.camera.projectionMatrix.fromArray(projectionMatrix)
        this.camera.projectionMatrixInverse.getInverse(this.camera.projectionMatrix)
      }

      this.renderer.autoClearColor = false
      this.renderer.render(this.scene, this.camera)
      this.renderer.state.setCullhand(this.THREE.CullhandNone)
    },
    async detectHand() {
      if (this.data.handImgUrl) {
        const canvas = wx.createOffscreenCanvas({
          type: '2d',
          width: this.data.handImgOriginWidth,
          height: this.data.handImgOriginHeight,
        })
        const context = canvas.getContext('2d')
        const img = canvas.createImage()
        await new Promise(resolve => {
          img.onload = resolve
          img.src = this.data.handImgUrl
        })

        context.clearRect(0, 0, this.data.handImgOriginWidth, this.data.handImgOriginHeight)
        context.drawImage(img, 0, 0, this.data.handImgOriginWidth, this.data.handImgOriginHeight)

        this.imgData = context.getImageData(0, 0, this.data.handImgOriginWidth, this.data.handImgOriginHeight)

        console.log('[frameBuffer] --> ', this.imgData.data.buffer)
        console.log('this.session.detectHand', this.session.detectHand)
        console.log('width', this.data.handImgOriginWidth)
        console.log('height', this.data.handImgOriginHeight)
        this.session.detectHand({
          frameBuffer: this.imgData.data.buffer,
          width: this.data.handImgOriginWidth,
          height: this.data.handImgOriginHeight,
          scoreThreshold: 0.5, // 评分阈值
          algoMode: 2
        })
      }
    },
  },
})
