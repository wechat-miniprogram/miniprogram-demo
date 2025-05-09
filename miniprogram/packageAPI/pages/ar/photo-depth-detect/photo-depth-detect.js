import getBehavior from './behavior'
import yuvBehavior from './yuvBehavior'
import depthBehavior from './depthBehavior'

const NEAR = 0.001
const FAR = 1000

Component({
  behaviors: [getBehavior(), yuvBehavior, depthBehavior],
  data: {
    depthImgUrl: '',
    depthImgWidth: 0,
    depthImgHeight: 0,
    depthImgOriginWidth: 0,
    depthImgOriginHeight: 0,
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

              let depthImgWidth
              let depthImgHeight
              if (width > height) {
                depthImgWidth = fixWidth
                depthImgHeight = fixWidth * height / width
              } else {
                depthImgWidth = fixWidth * width / height
                depthImgHeight = fixWidth
              }
              this.setData({
                depthImgUrl: imgUrl,
                depthImgWidth,
                depthImgHeight,
                depthImgOriginWidth: width,
                depthImgOriginHeight: height
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
      this.initDepthGL()
      console.log('init finish')
    },
    async detectDepth() {
      if (this.data.depthImgUrl) {
        const canvas = wx.createOffscreenCanvas({
          type: '2d',
          width: this.data.depthImgOriginWidth,
          height: this.data.depthImgOriginHeight,
        })
        const context = canvas.getContext('2d')
        const img = canvas.createImage()
        await new Promise(resolve => {
          img.onload = resolve
          img.src = this.data.depthImgUrl
        })

        context.clearRect(0, 0, this.data.depthImgOriginWidth, this.data.depthImgOriginHeight)
        context.drawImage(img, 0, 0, this.data.depthImgOriginWidth, this.data.depthImgOriginHeight)

        this.imgData = context.getImageData(0, 0, this.data.depthImgOriginWidth, this.data.depthImgOriginHeight)

        console.log('[frameBuffer] --> ', this.imgData.data.buffer)
        console.log('this.session.detectDepth', this.session.detectDepth)
        console.log('width', this.data.depthImgOriginWidth)
        console.log('height', this.data.depthImgOriginHeight)
        wx.showLoading({ title: '深度图生成中...' })
        this.session.detectDepth({
          frameBuffer: this.imgData.data.buffer,
          width: this.data.depthImgOriginWidth,
          height: this.data.depthImgOriginHeight,
        })
      }
    },
  },
})
