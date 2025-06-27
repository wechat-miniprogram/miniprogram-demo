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
    heightScale: 0.6, // canvas高度缩放值
    markerImgList: [], // 使用的 marker 列表
    chooseImgList: [], // 使用的 图片 列表
    hintBoxList: [], // 显示提示盒子列表
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
      // 初始化 Three.js，用于模型相关的渲染
      this.initTHREE()

      // 初始化 GL，基于 Three.js 的 Context，用于相机YUV渲染
      this.initYUV()

      // 初始化VK
      // start完毕后，进行更新渲染循环
      this.initVK()

      this.markerIndex = 0

      // 添加 识别包围盒子
      this.add3DBox()
    },
    initVK() {
      // VKSession 配置
      const session = this.session = wx.createVKSession({
        track: {
          plane: {
            mode: 1
          },
          marker: true,
        },
        version: 'v1',
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
          console.log("addAnchor", anchors);

          this.left.visible = true
          this.right.visible = true
          this.top.visible = true
          this.bottom.visible = true
        })

        // VKSession EVENT updateAnchors
        session.on('updateAnchors', anchors => {
          // marker 模式下，目前仅有一个识别目标，可以直接取
          const anchor = anchors[0]
          const markerId = anchor.id
          const size = anchor.size
          this.hintInfo = {
            markerId,
            size
          }
        })

        // VKSession removeAnchors
        // 识别目标丢失时，会触发一次
        session.on('removeAnchors', anchors => {
          this.left.visible = false
          this.right.visible = false
          this.top.visible = false
          this.bottom.visible = false

          if (this.data.hintBoxList && this.data.hintBoxList.length > 0) {
            // 清理信息
            this.hintInfo = undefined
            // 存在列表的情况，去除remove
            this.setData({
              hintBoxList: []
            })
          }
        })

        console.log('ready to initloop')
        // start 初始化完毕后，进行更新渲染循环
        this.initLoop()
      })
    },
    loop() {
      // console.log('loop')

      // 获取 VKFrame
      const frame = this.session.getVKFrame(this.canvas.width, this.canvas.height)

      // 成功获取 VKFrame 才进行
      if (!frame) { return }

      // 更新相机 YUV 数据
      this.renderYUV(frame)

      // 获取 VKCamera
      const VKCamera = frame.camera

      // 相机
      if (VKCamera) {
        // 接管 ThreeJs 相机矩阵更新，Marker模式下，主要由视图和投影矩阵改变渲染效果
        this.camera.matrixAutoUpdate = false

        // 视图矩阵
        this.camera.matrixWorldInverse.fromArray(VKCamera.viewMatrix)
        this.camera.matrixWorld.getInverse(this.camera.matrixWorldInverse)

        // 投影矩阵
        const projectionMatrix = VKCamera.getProjectionMatrix(NEAR, FAR)
        this.camera.projectionMatrix.fromArray(projectionMatrix)
        this.camera.projectionMatrixInverse.getInverse(this.camera.projectionMatrix)
      }

      // 绘制而为提示框的逻辑
      if (this.hintInfo) {
        // 存在提示信息，则更新
        const THREE = this.THREE

        // 原点偏移矩阵，VK情况下，marker 点对应就是 0 0 0，世界矩阵可以认为是一个单位矩阵
        // marker 右侧点可以理解是 0.5 0 0
        const center = new THREE.Vector3()
        const right = new THREE.Vector3(0.5, 0, 0)

        // 获取设备空间坐标
        const devicePos = center.clone().project(this.camera)

        // 转换坐标系，从 (-1, 1) 转到 (0, 100)，同时移到左上角 0 0，右下角 1 1
        const screenPos = new THREE.Vector3(0, 0, 0)
        screenPos.x = devicePos.x * 50 + 50
        screenPos.y = 50 - devicePos.y * 50

        // 获取右侧点信息
        const deviceRightPos = right.clone().project(this.camera)
        const screenRightPos = new THREE.Vector3(0, 0, 0)
        screenRightPos.x = deviceRightPos.x * 50 + 50

        const markerHalfWidth = screenRightPos.x - screenPos.x

        this.setData({
          hintBoxList: [
            {
              markerId: this.hintInfo.markerId,
              left: screenPos.x - markerHalfWidth,
              top: screenPos.y - markerHalfWidth,
              width: markerHalfWidth * this.data.domWidth * 2 / 100,
              height: markerHalfWidth * this.data.domWidth * 2 / 100,
            }
          ]
        })
      }

      this.renderer.autoClearColor = false
      this.renderer.state.setCullFace(this.THREE.CullFaceBack)
      this.renderer.render(this.scene, this.camera)
      this.renderer.state.setCullFace(this.THREE.CullFaceNone)
    },
    add3DBox() {
      // 添加marker需要的 三维包围框

      const THREE = this.THREE
      const scene = this.scene

      const material = new THREE.MeshPhysicalMaterial({
        metalness: 0.0,
        roughness: 0.1,
        color: 0x64f573,
      })
      const geometry = new THREE.BoxGeometry(1, 1, 1)

      const borderSize = 0.1

      const left = new THREE.Mesh(geometry, material)
      left.position.set(-0.5, 0, 0)
      left.rotation.set(-Math.PI / 2, 0, 0)
      left.scale.set(borderSize, 1.1, borderSize)
      scene.add(left)
      left.visible = false
      this.left = left

      const right = new THREE.Mesh(geometry, material)
      right.position.set(0.5, 0, 0)
      right.rotation.set(-Math.PI / 2, 0, 0)
      right.scale.set(borderSize, 1.1, borderSize)
      scene.add(right)
      right.visible = false
      this.right = right

      const top = new THREE.Mesh(geometry, material)
      top.position.set(0, 0, 0.5)
      top.rotation.set(0, 0, 0)
      top.scale.set(1.1, borderSize, borderSize)
      scene.add(top)
      top.visible = false
      this.top = top

      const bottom = new THREE.Mesh(geometry, material)
      bottom.position.set(0, 0, -0.5)
      bottom.rotation.set(0, 0, 0)
      bottom.scale.set(1.1, borderSize, borderSize)
      scene.add(bottom)
      bottom.visible = false
      this.bottom = bottom

      console.log('add3DBox is finish')
    },
    chooseMedia() {
      // marker图片上传逻辑
      wx.chooseMedia({
        count: 9,
        mediaType: ['image'],
        sizeType: ['original'],
        success: res => {
          console.log('chooseMedia res', res)

          const chooseImgListRes = []
          for (let i = 0; i < res.tempFiles.length; i++) {
            const imgUrl = res.tempFiles[i].tempFilePath
            chooseImgListRes.push(imgUrl)
          }

          console.log('set chooseImgList', chooseImgListRes)
          this.setData({
            chooseImgList: chooseImgListRes,
          })
        },
        fail: res => {
          console.error(res)
        }
      })
    },
    async addMarker() {
      console.log('addMarker')
      const fs = wx.getFileSystemManager()

      const markerImgListRes = this.data.markerImgList.concat([])
      const preMarkerIndex = this.markerIndex

      console.log('pre markerImgList', preMarkerIndex, markerImgListRes)

      // 检查与添加 marker 函数
      const chooseImgCount = this.data.chooseImgList.length
      let handledCount = 0
      const checkMarkerAdded = () => {
        if (handledCount === chooseImgCount) {
          this.markerIndex = markerImgListRes.length

          console.log('markerImgList set', markerImgListRes, this.markerIndex)
          this.setData({
            chooseImgList: [],
            markerImgList: markerImgListRes
          })
        }
      }

      // 准备进行choose的图片保存到fs
      for (let i = 0; i < chooseImgCount; i++) {
        const chooseImgUrl = this.data.chooseImgList[i]
        const fileEnd = chooseImgUrl.split('.').slice(-1)[0]
        const fileIndex = preMarkerIndex + i
        // 算法侧目前只认 map png jpg jpeg 后缀文件
        const filePath = `${wx.env.USER_DATA_PATH}/marker-ar-${fileIndex}.${fileEnd}`

        const saveAndAddMarker = () => {
          console.log('saveFileSync start', filePath, chooseImgUrl)
          // 存入文件系统，并添加到marker
          fs.saveFile({
            filePath,
            tempFilePath: chooseImgUrl,
            success: () => {
              console.log('[addMarker] --> ', filePath)
              const markerId = this.session.addMarker(filePath)
              markerImgListRes.push({
                markerId,
                filePath
              })
              handledCount++
              checkMarkerAdded()
            },
            fail: res => {
              console.error(res)
              console.log('文件保存失败', filePath)
              handledCount++
              checkMarkerAdded()
            }
          })
        }

        console.log('uploadFile Path', filePath)
        // 确定文件，存在即删除
        fs.stat({
          path: filePath,
          success: (res) => {
            if (res.stats.isFile()) {
              fs.unlinkSync(filePath)
              console.log('fs unlinkSync', filePath)
            }
            saveAndAddMarker()
          },
          fail: (res) => {
            console.error(res)
            console.log('fs中不存在，直接写入', filePath)

            saveAndAddMarker()
          }
        })
      }
    },
    removeMarker() {
      if (this.data.markerImgList) {
        for (let i = 0; i < this.data.markerImgList.length; i++) {
          const markerImg = this.data.markerImgList[i]
          this.session.removeMarker(markerImg.markerId)
        }
        this.markerIndex = 0
        this.setData({
          markerImgList: [],
        })
      }
    },
    getAllMarker() {
      console.log(this.session.getAllMarker())
    },
  },
})
