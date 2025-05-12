import arBehavior from '../behavior/behavior-ar'
import xrFrameBehavior from '../behavior/behavior-xrframe'

// VK 投影矩阵参数定义
const NEAR = 0.01
const FAR = 1000

const loggerOnce = false

Component({
  behaviors: [arBehavior, xrFrameBehavior],
  data: {
    theme: 'light',
    widthScale: 1, // canvas宽度缩放值
    heightScale: 0.8, // canvas高度缩放值
    hintBoxList: [], // 显示提示盒子列表,
    cameraPosition: 1 // 默认前置
  },
  markerIndex: 0, // 使用的 marker 索引
  hintInfo: undefined, // 提示框信息
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
      // 初始化VK
      // start完毕后，进行更新渲染循环
      this.initVK()
    },
    initVK() {
      // VKSession 配置
      const session = this.session = wx.createVKSession({
        track: {
          face: {
            mode: 1
          }
        },
        cameraPosition: 1,
        version: 'v1',
        gl: this.gl
      })

      try {
        session.start(err => {
          if (err) return console.error('VK error: ', err)

          console.log('@@@@@@@@ VKSession.version', session.version)

          //  VKSession EVENT resize
          session.on('resize', () => {
            this.calcCanvasSize()
          })

          // 开启三维识别
          session.update3DMode({ open3d: true })

          // VKSession EVENT addAnchors
          session.on('addAnchors', anchors => {
            console.log('addAnchor', anchors)
          })

          // VKSession EVENT updateAnchors
          session.on('updateAnchors', anchors => {
            // console.log("updateAnchors", anchors);

            const anchor = anchors[0]
            // 目前只处理一个返回的结果
            if (anchor) {
              this.wrapTransform = anchor.transform
              this.position3D = anchor.points3d

              if (this.faceGLTFTrs && this.faceGLTFTrs.visible !== true) {
                this.faceGLTFTrs.visible = true
              }
              if (this.glassesGLTFTrs && this.glassesGLTFTrs.visible !== true) {
                this.glassesGLTFTrs.visible = true
              }
            }
          })

          // VKSession removeAnchors
          // 识别目标丢失时不断触发
          session.on('removeAnchors', anchors => {
            // console.log("removeAnchors");

            if (this.faceGLTFTrs && this.faceGLTFTrs.visible !== false) {
              this.faceGLTFTrs.visible = false
            }

            if (this.glassesGLTFTrs && this.glassesGLTFTrs.visible !== false) {
              this.glassesGLTFTrs.visible = false
            }
          })

          console.log('ready to initloop')
          // start 初始化完毕后，进行更新渲染循环
          this.initLoop()
        })
      } catch (e) {
        console.error(e)
      }
    },
    // 针对 xr-frame 的初始化逻辑
    async initXRFrame() {
      const xrFrameSystem = wx.getXrFrameSystem()
      const scene = this.xrScene
      const { rootShadow } = scene

      // 缓存主相机
      this.xrCameraMain = this.xrCamera
      this.xrCameraMainTrs = this.xrCameraTrs

      // 初始化YUV相机配置
      this.initXRYUVCamera()

      // === 初始挂载点 ===
      this.faceWrap = scene.createElement(xrFrameSystem.XRNode)
      this.faceWrapTrs = this.faceWrap.getComponent(xrFrameSystem.Transform)
      rootShadow.addChild(this.faceWrap)

      // 加载脸模
      const face = await scene.assets.loadAsset({
        type: 'gltf',
        assetId: 'gltf-face',
        src: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/face.glb',
      })
      const faceElem = scene.createElement(xrFrameSystem.XRGLTF, {
        model: 'gltf-face',
        position: '0 0 0',
        scale: '1 1 1',
      })
      const faceGLTF = faceElem.getComponent(xrFrameSystem.GLTF)
      this.faceElem = faceElem
      this.faceGLTFTrs = faceElem.getComponent(xrFrameSystem.Transform)
      this.faceWrap.addChild(faceElem)

      for (const mesh of faceGLTF.meshes) {
        // 通过alphaMode 的 Setter 设置，或者写入renderState，但需要手动控制宏
        mesh.material.alphaMode = 'BLEND'
        mesh.material.setVector('u_baseColorFactor', xrFrameSystem.Vector4.createFromNumber(1, 1, 1, 0.0))
      }

      // 加载眼镜
      const glasses = await scene.assets.loadAsset({
        type: 'gltf',
        assetId: 'gltf-glasses',
        src: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/glasses.glb',
      })
      const glassesElem = scene.createElement(xrFrameSystem.XRGLTF, {
        model: 'gltf-glasses',
        position: '0 0 0',
        scale: '1 1 1',
      })
      const glassesGLTF = glassesElem.getComponent(xrFrameSystem.GLTF)
      this.glassesElem = glassesElem
      this.glassesGLTFTrs = glassesElem.getComponent(xrFrameSystem.Transform)
      this.faceWrap.addChild(glassesElem)
    },
    loop() {
      // console.log('loop')

      // 获取 VKFrame
      const frame = this.session.getVKFrame(this.data.width, this.data.height)

      // 成功获取 VKFrame 才进行
      if (!frame) { return }

      // 更新相机 YUV 数据
      this.updataXRYUV(frame)

      // 获取 VKCamera
      const VKCamera = frame.camera

      // 更新 xrFrame 相机矩阵
      this.updataXRCameraMatrix(VKCamera, NEAR, FAR)

      // 存在faceWrap，执行信息同步逻辑
      if (this.faceWrap && this.wrapTransform) {
        const xrFrameSystem = wx.getXrFrameSystem()

        if (!this.DT) { this.DT = new xrFrameSystem.Matrix4() }
        if (!this.DT2) { this.DT2 = new xrFrameSystem.Matrix4() }

        // 目前VK返回的是行主序矩阵
        // xrframe 矩阵存储为列主序
        this.DT.setArray(this.wrapTransform)
        this.DT.transpose(this.DT2)
        this.faceWrapTrs.setLocalMatrix(this.DT2)
      }
    }
  },
})
