import getBehavior from './behavior'
import yuvBehavior from './yuvBehavior'

const NEAR = 0.001
const FAR = 1000

Component({
    behaviors: [getBehavior(), yuvBehavior],
    data: {
        shoeImgUrl: '',
        shoeImgWidth: 0,
        shoeImgHeight: 0,
        shoeImgOriginWidth: 0,
        shoeImgOriginHeight: 0,
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
                                shoeImgUrl: imgUrl,
                                shoeImgWidth: fixWidth,
                                shoeImgHeight: (fixWidth / width) * height,
                                shoeImgOriginWidth: width,
                                shoeImgOriginHeight: height
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
        },
        async detectShoe() {
            if (this.data.shoeImgUrl) {
                const canvas = wx.createOffscreenCanvas({
                    type: '2d',
                    width: this.data.shoeImgOriginWidth,
                    height: this.data.shoeImgOriginHeight,
                })
                const context = canvas.getContext('2d')
                const img = canvas.createImage()
                await new Promise(resolve => {
                    img.onload = resolve
                    img.src = this.data.shoeImgUrl
                })

                context.clearRect(0, 0, this.data.shoeImgOriginWidth, this.data.shoeImgOriginHeight)
                context.drawImage(img, 0, 0, this.data.shoeImgOriginWidth, this.data.shoeImgOriginHeight)

                this.imgData = context.getImageData(0, 0, this.data.shoeImgOriginWidth, this.data.shoeImgOriginHeight)

                console.log('[frameBuffer] --> ', this.imgData.data.buffer)
                console.log('this.session.detectShoe', this.session.detectShoe)
                console.log('width', this.data.shoeImgOriginWidth)
                console.log('height', this.data.shoeImgOriginHeight)
                this.session.detectShoe({
                    frameBuffer: this.imgData.data.buffer,
                    width: this.data.shoeImgOriginWidth,
                    height: this.data.shoeImgOriginHeight,
                })
            }
        },
    },
})