module.exports = Behavior({
  // 全局变量
  session: undefined, // 全局的VKsession对象
  canvas: undefined, // canvas
  // XRFrame相关变量
  xrScene: undefined, // xr-frame 的场景
  xrCamera: undefined, // xr-frame 的相机
  xrFrameReady: undefined, // xr-frame初始化完毕
  // WebGL相关
  camera: undefined, // 主要相机
  // ThreeJs 相关变量
  gl: undefined, // 全局gl对象
  THREE: undefined, // THREE 对象
  // 全局 data
  data: {
    domWidth: 0,
    domHeight: 0,
    width: 0, // canvas大小
    height: 0, // canvas大小
    widthScale: 1, // canvas宽度缩放值
    heightScale: 0.8, // canvas高度缩放值
    cameraPosition: 0, // 相机朝向，默认后置摄像头
  },
  methods: {
    onReady() {
      // 获取canvas
      wx.createSelectorQuery()
        .select('#canvas')
        .node()
        .exec(res => {
          this.canvas = res[0].node

          // 运算画布大小
          this.calcCanvasSize()

          // 页面自定义初始化
          if (this.init) this.init()
        })
    },
    calcCanvasSize() {
      const info = wx.getSystemInfoSync()
      const pixelRatio = info.pixelRatio
      const width = info.windowWidth * this.data.widthScale * pixelRatio
      const height = info.windowHeight * this.data.heightScale * pixelRatio
      // 存在 webgl Canvas的情况下，写入大小
      if (this.canvas) {
        this.canvas.width = width
        this.canvas.height = height
      }
      console.log(`canvas size: width = ${width} , height = ${height}`)
      this.setData({
        width,
        height,
        domWidth: info.windowWidth * this.data.widthScale,
        domHeight: info.windowHeight * this.data.heightScale,
      })
    },
    // 前后摄像头
    switchCamera() {
      if (this.session.config) {
        const config = this.session.config
        let cameraPosNext
        if (this.data.cameraPosition === 0) {
          cameraPosNext = 1
        } else {
          cameraPosNext = 0
        }
        config.cameraPosition = cameraPosNext
        this.session.config = config
        this.setData({
          cameraPosition: cameraPosNext
        })
      }
    },
    // 限帧逻辑
    initLoop() {
      // 限制调用帧率,暂时去掉
      const fps = 30
      const fpsInterval = 1000 / fps
      let last = Date.now()

      const session = this.session

      // 逐帧渲染
      const onFrame = timestamp => {
        try {
          const now = Date.now()
          const mill = now - last
          // 经过了足够的时间
          if (mill > fpsInterval) {
            last = now - (mill % fpsInterval) // 校正当前时间
            this.loop()
          }
        } catch (e) {
          console.error(e)
        }
        session.requestAnimationFrame(onFrame)
      }
      session.requestAnimationFrame(onFrame)
    },
  },
})
