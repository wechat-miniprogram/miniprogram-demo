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

          let preAnchorNumber = 0
          // VKSession EVENT updateAnchors
          session.on('updateAnchors', anchors => {
            // console.log("updateAnchors", anchors);

            // 遍历不同的识别目标
            for (let i = 0; i < anchors.length; i++) {
              const anchor = anchors[i]

              let faceWrap = this.faceWrapMap[i]
              if (!faceWrap) {
                this.initBindingNode(i)

                faceWrap = this.faceWrapMap[i]
              }

              const xrFrameSystem = wx.getXrFrameSystem()

              // 更新显示状态
              this.updateHintBoxVisble(faceWrap.hintBoxList, true)
              if (faceWrap.faceGLTFTrs.visible !== true) {
                faceWrap.faceGLTFTrs.visible = true
              }

              // 执行信息同步逻辑

              if (!this.DT) { this.DT = new xrFrameSystem.Matrix4() }
              if (!this.DT2) { this.DT2 = new xrFrameSystem.Matrix4() }

              // 目前VK返回的是行主序矩阵
              // xrframe 矩阵存储为列主序
              this.DT.setArray(anchor.transform)
              this.DT.transpose(this.DT2)
              faceWrap.wrapTrs.setLocalMatrix(this.DT2)

              // 更新提示点位置
              this.updateHintBoxPosition(faceWrap.hintBoxList, anchor.points3d)
            }

            // 由于目前，减少识别目标不会触发remove事件，所以先通过数量判断处理隐藏
            if (preAnchorNumber > anchors.length) {
              // 遍历被隐藏的目标
              for (let i = preAnchorNumber - 1; i >= anchors.length; i--) {
                const faceWrap = this.faceWrapMap[i]
                if (faceWrap) {
                  this.updateHintBoxVisble(faceWrap.hintBoxList, false)
                  if (faceWrap.faceGLTFTrs.visible !== false) {
                    faceWrap.faceGLTFTrs.visible = false
                  }
                }
              }
            }

            preAnchorNumber = anchors.length
          })

          // VKSession removeAnchors
          // 识别目标丢失时不断触发
          session.on('removeAnchors', anchors => {
            // console.log("removeAnchors");

            if (preAnchorNumber !== 0) {
              for (let i = 0; i < preAnchorNumber; i++) {
                const faceWrap = this.faceWrapMap[i]
                if (faceWrap) {
                  this.updateHintBoxVisble(faceWrap.hintBoxList, false)
                  if (faceWrap.faceGLTFTrs.visible !== false) {
                    faceWrap.faceGLTFTrs.visible = false
                  }
                }
              }
            }
            preAnchorNumber = 0
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
      const scene = this.xrScene

      // 缓存主相机
      this.xrCameraMain = this.xrCamera
      this.xrCameraMainTrs = this.xrCameraTrs

      // 初始化YUV相机配置
      this.initXRYUVCamera()

      // 加载脸模
      this.faceGLTF = await scene.assets.loadAsset({
        type: 'gltf',
        assetId: 'gltf-face',
        src: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/face.glb',
      })

      // 初始化识别挂载点容器
      this.faceWrapMap = {}
    },
    initBindingNode(index) {
      const xrFrameSystem = wx.getXrFrameSystem()
      const scene = this.xrScene
      const { rootShadow } = scene

      // 用于管理每一个挂载元素
      const wrapInfo = {}

      // === 初始挂载点 ===
      const faceWrap = scene.createElement(xrFrameSystem.XRNode)
      const faceWrapTrs = faceWrap.getComponent(xrFrameSystem.Transform)
      rootShadow.addChild(faceWrap)

      wrapInfo.wrapElem = faceWrap
      wrapInfo.wrapTrs = faceWrapTrs

      const faceElem = scene.createElement(xrFrameSystem.XRGLTF, {
        model: 'gltf-face',
        position: '0 0 0',
        scale: '1 1 1',
      })
      const faceGLTF = faceElem.getComponent(xrFrameSystem.GLTF)
      const faceGLTFTrs = faceElem.getComponent(xrFrameSystem.Transform)
      faceWrap.addChild(faceElem)

      wrapInfo.faceGLTFTrs = faceGLTFTrs

      for (const mesh of faceGLTF.meshes) {
        // 通过alphaMode 的 Setter 设置，或者写入renderState，但需要手动控制宏
        mesh.material.alphaMode = 'BLEND'
        mesh.material.setVector('u_baseColorFactor', xrFrameSystem.Vector4.createFromNumber(1, 1, 1, 0.4))
      }

      // 加载提示点
      wrapInfo.hintBoxList = this.getHintBox(xrFrameSystem, scene, faceWrap)

      this.faceWrapMap[index] = wrapInfo
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
    },
    getHintBox(xrFrameSystem, scene, wrap) {
      // 初始化提示点
      const geometryHint = scene.assets.getAsset('geometry', 'sphere')
      const effectCube = scene.assets.getAsset('effect', 'standard')
      const boxScale = 0.03
      const hintBoxList = []
      for (let i = 0; i < 106; i++) {
        const colorFloat = i / 106
        const el = scene.createElement(xrFrameSystem.XRNode, {
          position: '0 0 0',
          scale: `${boxScale} ${boxScale} ${boxScale}`,
        })
        const elTrs = el.getComponent(xrFrameSystem.Transform)
        const mat = scene.createMaterial(effectCube)

        const colorR = 1.0 - colorFloat
        mat.setVector('u_baseColorFactor', xrFrameSystem.Vector4.createFromNumber(1.0, colorR, colorR, 1.0))

        const mesh = el.addComponent(xrFrameSystem.Mesh, {
          geometry: geometryHint,
          material: mat,
        })

        wrap.addChild(el)
        // elTrs.visible = false;

        hintBoxList.push(elTrs)
      }

      return hintBoxList
    },
    updateHintBoxPosition(hintBoxList, points3d) {
      if (hintBoxList && hintBoxList.length > 0) {
        // console.log('ready to set', hintBoxList);
        // 存在提示列表，则更新点信息
        for (let i = 0; i < hintBoxList.length; i++) {
          const hintBox = hintBoxList[i]
          hintBox.position.x = points3d[i].x
          hintBox.position.y = points3d[i].y
          hintBox.position.z = points3d[i].z
        }
      }
    },
    updateHintBoxVisble(hintBoxList, visible) {
      if (hintBoxList && hintBoxList.length > 0) {
        // console.log('ready to set', hintBoxList);
        // 存在提示列表，则更新点信息
        for (let i = 0; i < hintBoxList.length; i++) {
          const hintBox = hintBoxList[i]
          if (hintBox.visible !== visible) {
            hintBox.visible = visible
          }
        }
      }
    }
  },
})
