Component({
  behaviors: [],
  data: {
    // 主题相关逻辑
    theme: 'light',
    // 上传识别相关逻辑
    imgUrl: '',
    imgWidth: 0,
    imgHeight: 0,
    imgOriginWidth: 0,
    imgOriginHeight: 0,
    // 显示身份证识别结果
    detected: false,
    detectSuccess: false,
    isComplete: false,
    label: '',
    orientation: 0,
    box: [],
    cropImg: null,
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
    onReady() {
      this.initVK()
    },
    // VK 初始化逻辑
    initVK() {
      // VKSession 配置
      const session = this.session = wx.createVKSession({
        track: {
          IDCard: {
            mode: 2 // 照片模式
          }
        },
        version: 'v1',
        gl: this.gl
      })

      // VKSession start
      session.start(err => {
        session.on('updateAnchors', anchors => {
          console.log('updateAnchors')

          // 处理返回的身份证信息
          if (anchors && anchors[0]) {
            // 存在数组，证明存在身份证信息
            const anchor = anchors[0]

            // console.log(anchor.isComplete, anchor.label, anchor.orientation, anchor.box);

            this.setData({
              detected: true,
              detectSuccess: true,
              isComplete: anchor.isComplete,
              label: anchor.label,
              orientation: anchor.orientation,
              box: anchor.box,
            })

            // 裁剪信息
            const affineImgWidth = anchor.affineImgWidth
            const affineImgHeight = anchor.affineImgHeight
            const affineMat = anchor.affineMat

            // 存在裁剪信息，进行身份证裁剪处理
            if (affineImgWidth && affineImgHeight && affineMat) {
              console.log(affineImgWidth, affineImgHeight, affineMat)

              const cropIDcardImg = this.getCropIDcard(affineImgWidth, affineImgHeight, affineMat)

              this.setData({
                cropImg: cropIDcardImg
              })
            }
          }
        })
        session.on('removeAnchors', anchors => {
          console.log('anchor remove')

          // 图片没有识别到身份证
          this.setData({
            detected: true,
            detectSuccess: false,
          })
        })
      })
    },
    // 裁剪身份证图片
    getCropIDcard(affineImgWidth, affineImgHeight, affineMat) {
      const canvas = wx.createOffscreenCanvas({
        type: '2d',
        width: affineImgWidth,
        height: affineImgHeight,
      })
      const context = canvas.getContext('2d')

      context.clearRect(0, 0, affineImgWidth, affineImgHeight)
      /*
            * affineMat 3x3仿射变换矩阵，行主序
            *  [0 1 2
            *   3 4 5
            *   6 7 8]
            */
      /*
            * canvas 2d setTransform
            * setTransform(a, b, c, d, e, f)
            *  [a c e
            *   b d f
            *   0 0 1]
            */
      context.setTransform(
        Number(affineMat[0]),
        Number(affineMat[3]),
        Number(affineMat[1]),
        Number(affineMat[4]),
        Number(affineMat[2]),
        Number(affineMat[5])
      )
      console.log(this.img, this.data.imgOriginWidth, this.data.imgOriginHeight)
      context.drawImage(this.img, 0, 0, this.data.imgOriginWidth, this.data.imgOriginHeight)
      const imgUrl = canvas.toDataURL()

      // console.log(imgUrl);

      return imgUrl
    },
    // 上传识别图片
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
                imgUrl,
                imgWidth: fixWidth,
                imgHeight: (fixWidth / width) * height,
                imgOriginWidth: width,
                imgOriginHeight: height
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
    // 识别身份证逻辑
    async detectIDCard() {
      console.log('detectIDCard')
      if (this.data.imgUrl) {
        const canvas = wx.createOffscreenCanvas({
          type: '2d',
          width: this.data.imgOriginWidth,
          height: this.data.imgOriginHeight,
        })
        const context = canvas.getContext('2d')
        const img = canvas.createImage()
        // 使用中的 图片对象
        this.img = img
        await new Promise(resolve => {
          img.onload = resolve
          img.src = this.data.imgUrl
        })

        context.clearRect(0, 0, this.data.imgOriginWidth, this.data.imgOriginHeight)
        context.drawImage(img, 0, 0, this.data.imgOriginWidth, this.data.imgOriginHeight)

        // 使用中的 image ArrayBuffer
        this.imgData = context.getImageData(0, 0, this.data.imgOriginWidth, this.data.imgOriginHeight)

        console.log('[frameBuffer] --> ', this.imgData.data.buffer)
        console.log('this.session.detectIDCard', this.session.detectIDCard)
        console.log('width', this.data.imgOriginWidth)
        console.log('height', this.data.imgOriginHeight)
        this.session.detectIDCard({
          // 识别身份证图片的信息
          frameBuffer: this.imgData.data.buffer,
          width: this.data.imgOriginWidth,
          height: this.data.imgOriginHeight,
          // 是否获取裁剪图片信息
          getAffineImg: true,
        })
      }
    },
  },
})
