import getBehavior from './behavior'
import yuvBehavior from './yuvBehavior'

const NEAR = 0.001
const FAR = 1000

Component({
    behaviors: [getBehavior(), yuvBehavior],
    data: {
        bodyImgUrl: '',
        bodyImgWidth: 0,
        bodyImgHeight: 0,
        bodyImgOriginWidth: 0,
        bodyImgOriginHeight: 0,
        theme: 'light',
    },
    lifetimes: {
        /**
        * 生命周期函数--监听页面加载
        */
        detached() {
        console.log("页面detached")
        if (wx.offThemeChange) {
          wx.offThemeChange()
        }
        },
        ready() {
        console.log("页面准备完全")
          this.setData({
            theme: wx.getSystemInfoSync().theme || 'light'
          })
  
          if (wx.onThemeChange) {
            wx.onThemeChange(({theme}) => {
              this.setData({theme})
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
                                bodyImgUrl: imgUrl,
                                bodyImgWidth: fixWidth,
                                bodyImgHeight: (fixWidth / width) * height,
                                bodyImgOriginWidth: width,
                                bodyImgOriginHeight: height
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
            this.renderer.state.setCullbody(this.THREE.CullbodyNone)
        },
        async detectbody() {
            if (this.data.bodyImgUrl) {
                const canvas = wx.createOffscreenCanvas({
                    type: '2d',
                    width: this.data.bodyImgOriginWidth,
                    height: this.data.bodyImgOriginHeight,
                })
                const context = canvas.getContext('2d')
                const img = canvas.createImage()
                await new Promise(resolve => {
                    img.onload = resolve
                    img.src = this.data.bodyImgUrl
                })

                context.clearRect(0, 0, this.data.bodyImgOriginWidth, this.data.bodyImgOriginHeight)
                context.drawImage(img, 0, 0, this.data.bodyImgOriginWidth, this.data.bodyImgOriginHeight)

                this.imgData = context.getImageData(0, 0, this.data.bodyImgOriginWidth, this.data.bodyImgOriginHeight)

                console.log('[frameBuffer] --> ', this.imgData.data.buffer)
                console.log('this.session.detectbody', this.session.detectbody)
                console.log('width', this.data.bodyImgOriginWidth)
                console.log('height', this.data.bodyImgOriginHeight)
                this.session.detectBody({
                    frameBuffer: this.imgData.data.buffer,
                    width: this.data.bodyImgOriginWidth,
                    height: this.data.bodyImgOriginHeight,
                    scoreThreshold: 0.5 // 评分阈值
                })
            }
        },
    },
})