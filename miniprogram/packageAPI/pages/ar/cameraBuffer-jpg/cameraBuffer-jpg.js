import arBehavior from '../behavior/behavior-ar'
import threeBehavior from '../behavior/behavior-three'

// VK 投影矩阵参数定义
const NEAR = 0.01
const FAR = 1000

Component({
  behaviors: [arBehavior, threeBehavior],
  data: {
    theme: 'light',
    widthScale: 1, // canvas宽度缩放值
    heightScale: 0.57, // canvas高度缩放值
    jpgUrl: '',
  },
  useLoopLog: false, // 是否开启循环log
  imgIndex: 0,
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
    // 对应案例的初始化逻辑，由统一的 behavior 触发
    init() {
      // 初始化 Three.js，用于模型相关的渲染
      this.initTHREE()

      // 初始化 GL，基于 Three.js 的 Context，用于相机YUV渲染
      this.initYUV()

      // 初始化VK
      // start完毕后，进行更新渲染循环
      this.initVK()

      this.useLoopLog = false
      this.imgIndex = 0
    },
    initVK() {
      // VKSession 配置
      const session = this.session = wx.createVKSession({
        track: {
          plane: {
            mode: 1
          },
        },
        version: 'v2',
        gl: this.gl
      })

      session.start(err => {
        if (err) return console.error('VK error: ', err)

        console.log('@@@@@@@@ VKSession.version', session.version)

        //  VKSession EVENT resize
        session.on('resize', () => {
          this.calcCanvasSize()
        })

        // VKSession EVENT addAnchors
        session.on('addAnchors', anchors => {
        })

        // VKSession EVENT updateAnchors
        session.on('updateAnchors', anchors => {

        })

        // VKSession removeAnchors
        // 识别目标丢失时，会触发一次
        session.on('removeAnchors', anchors => {
          // console.log('removeAnchors', anchors)
        })

        console.log('ready to initloop')
        // start 初始化完毕后，进行更新渲染循环
        this.initLoop()

        // 绘制双面，以及去掉清屏，用于显示yuv
        this.renderer.state.setCullFace(this.THREE.CullFaceNone)
      })
    },
    loop() {
      // 获取 VKFrame
      const frame = this.session.getVKFrame(this.canvas.width, this.canvas.height)

      // 成功获取 VKFrame 才进行
      if (!frame) { return }

      // 更新相机 YUV 数据
      this.renderYUV(frame)

      // 获取 VKCamera
      const VKCamera = frame.camera

      if (this.useLoopLog) {
        // let transformStr = '';
        // for (let i = 0; i < 16; i++)
        // transformStr += VKCamera.transform[i] + ' ';
        // console.log('VKCamera.transform', transformStr);

        console.log('timeStamp', frame.timestamp)

        let viewMatrixStr = ''
        for (let i = 0; i < 16; i++) viewMatrixStr += VKCamera.viewMatrix[i] + ' '
        // console.log('VKCamera.viewMatrix', viewMatrixStr);
        if (this.preTimestamp && this.preTimestamp === frame.timestamp) {
          if (this.preViewMatrixStr && this.preViewMatrixStr !== viewMatrixStr) {
            console.log('preViewMatrixStr', this.preViewMatrixStr)
            console.log('viewMatrixStr', viewMatrixStr)
            console.log('Timestamp is same. But viewMatrix is not same')
          }
        }
        this.preTimestamp = frame.timestamp
        this.preViewMatrixStr = viewMatrixStr
      }
    },
    getJpgImg() {
      console.log('Function getJpgImg')

      // 按需写入获取 jpg 的 大小 和质量
      const width = 640
      const height = 480
      const quality = 90

      // 获取 VKFrame
      const frame = this.session.getVKFrame(width, height)

      // 成功获取 VKFrame 才进行
      if (!frame) { return }

      console.log('getCameraJpgBuffer: ', width, height, quality)

      const t1 = new Date().getTime()
      const jpgBuffer = frame.getCameraJpgBuffer(width, height, quality)
      const t2 = new Date().getTime()

      console.log(`getCameraJpgBuffer cost ${t2 - t1}ms`)

      // console.log('jpgBuffer', jpgBuffer);

      const jpgUrl = this.saveLocalJPG(jpgBuffer, 'cameraJPG')

      console.log('jpgUrl', jpgUrl)

      this.setData({
        jpgUrl
      })
    },
    saveLocalJPG(bufferContent, name) {
      const url = `${wx.env.USER_DATA_PATH}/${name + this.imgIndex + '.jpg'}`

      const fs = wx.getFileSystemManager()
      try {
        // 存在即删除
        const unlinkRes = fs.unlinkSync(url)
        // console.log('unlinkSync', unlinkRes)

        this.imgIndex++
        const newUrl = `${wx.env.USER_DATA_PATH}/${name + this.imgIndex + '.jpg'}`

        // console.log('write newUrl', newUrl)
        // 写入，新图片
        const writeRes = fs.writeFileSync(
          newUrl,
          bufferContent,
          'utf8'
        )

        return newUrl
      } catch (e) {
        // 利用catch实现，此时，为新写入
        try {
          // console.log('write url', url)

          // 写入
          const writeRes = fs.writeFileSync(
            url,
            bufferContent,
            'utf8'
          )
        } catch (e) {
          console.error(e)
        }
      }

      return url
    },
    getLog() {
      console.log('Function getLog')

      this.useLoopLog = !this.useLoopLog
    },

  },
})
