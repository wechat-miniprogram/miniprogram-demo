import arBehavior from '../behavior/behavior-ar'
import xrFrameBehavior from '../behavior/behavior-xrframe'

// protobuf 相关逻辑
const protobuf = require('./protobuf/protobuf.js')
const json = require('./proto/arModelProto.js')

const root = protobuf.Root.fromJSON(json)
const message = root.lookupType('ARModelData')

let gltfIndex = 0

// VK 投影矩阵参数定义
const NEAR = 0.01
const FAR = 1000

// 针对 vk 生成模型的矫正
const modelScale = 0.16

Component({
  behaviors: [arBehavior, xrFrameBehavior],
  data: {
    theme: 'light',
    widthScale: 1, // canvas宽度缩放值
    heightScale: 0.6, // canvas高度缩放值
    hintBoxList: [], // 显示提示盒子列表
    usingMarkerId: false, // 使用中的markerId
    haveMap: false, // 存在map
    haveGLTF: false, // 存在gltf
  },
  markerIndex: 0, // 使用的 marker 索引
  hintInfo: undefined, // 提示框信息
  selectCosid: 0, // 选中的cosid
  selectResp: undefined, // 选中的回调信息
  parsedMapUrl: undefined, // 使用中的mapUrl
  parsedGlbUrl: undefined, // 使用中的glbUrl
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
      this.markerIndex = 0

      // 初始化VK
      // start完毕后，进行更新渲染循环
      this.initVK()
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
          console.log('addAnchor', anchors)
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

          console.log('update a')
          if (!this.modelShow) {
            if (this.modelTrs) {
              this.modelTrs.scale.x = modelScale
              this.modelTrs.scale.y = modelScale
              this.modelTrs.scale.z = modelScale
            }

            this.xAxis.visible = true
            this.yAxis.visible = true
            this.zAxis.visible = true

            this.modelShow = true
          }
        })

        // VKSession removeAnchors
        // 识别目标丢失时，会触发一次
        session.on('removeAnchors', anchors => {
          console.log('remove a')

          if (this.modelShow) {
            if (this.modelTrs) {
              this.modelTrs.scale.x = 0
              this.modelTrs.scale.y = 0
              this.modelTrs.scale.z = 0
            }

            this.xAxis.visible = false
            this.yAxis.visible = false
            this.zAxis.visible = false

            this.modelShow = false
          }
        })

        console.log('ready to initloop')
        // start 初始化完毕后，进行更新渲染循环
        this.initLoop()
      })
    },
    // 针对 xr-frame 的初始化逻辑
    async initXRFrame() {
      const xrFrameSystem = wx.getXrFrameSystem()
      const scene = this.xrScene
      const { rootShadow } = scene

      // 初始化YUV相机配置
      this.initXRYUVCamera()

      // 添加marker 提示用的 三个轴
      const geometryCube = scene.assets.getAsset('geometry', 'cube')
      const effectCube = scene.assets.getAsset('effect', 'standard')
      const axisScale = 1.0
      const lineScale = 0.05

      const elX = scene.createElement(xrFrameSystem.XRNode, {
        position: `${axisScale / 2} 0 0`,
        scale: `${axisScale} ${lineScale} ${lineScale}`,
      })
      const elXTrs = elX.getComponent(xrFrameSystem.Transform)
      const matX = scene.createMaterial(effectCube)
      matX.setVector('u_baseColorFactor', xrFrameSystem.Vector4.createFromNumber(1, 0.2, 0.2, 1.0))
      const meshX = elX.addComponent(xrFrameSystem.Mesh, {
        geometry: geometryCube,
        material: matX,
      })
      this.xAxis = elXTrs
      rootShadow.addChild(elX)
      this.xAxis.visible = false

      const elY = scene.createElement(xrFrameSystem.XRNode, {
        position: `0 ${axisScale / 2} 0`,
        scale: `${lineScale} ${axisScale} ${lineScale}`,
      })
      const elYTrs = elY.getComponent(xrFrameSystem.Transform)
      const matY = scene.createMaterial(effectCube)
      matY.setVector('u_baseColorFactor', xrFrameSystem.Vector4.createFromNumber(0.2, 1, 0.2, 1.0))
      const meshY = elY.addComponent(xrFrameSystem.Mesh, {
        geometry: geometryCube,
        material: matY,
      })
      this.yAxis = elYTrs
      rootShadow.addChild(elY)
      this.yAxis.visible = false

      const elZ = scene.createElement(xrFrameSystem.XRNode, {
        position: `0 0 ${axisScale / 2}`,
        scale: `${lineScale} ${lineScale} ${axisScale}`,
      })
      const elZTrs = elZ.getComponent(xrFrameSystem.Transform)
      const matZ = scene.createMaterial(effectCube)
      matZ.setVector('u_baseColorFactor', xrFrameSystem.Vector4.createFromNumber(0.2, 0.2, 1, 1.0))
      const meshZ = elZ.addComponent(xrFrameSystem.Mesh, {
        geometry: geometryCube,
        material: matZ,
      })
      this.zAxis = elZTrs
      rootShadow.addChild(elZ)
      this.zAxis.visible = false
      console.log('add3DAxis is finish')
    },
    loop() {
      // 获取 VKFrame
      const frame = this.session.getVKFrame(this.data.domWidth, this.data.domHeight)

      // 成功获取 VKFrame 才进行
      if (!frame) { return }

      // 更新相机 YUV 数据
      this.updataXRYUV(frame)

      // 获取 VKCamera
      const VKCamera = frame.camera

      // 更新 xrFrame 相机矩阵
      this.updataXRCameraMatrix(VKCamera, NEAR, FAR)
    },
    async parseAddMarker() {
      // 目前未选中cosid 跳过
      if (!this.selectCosid) {
        console.log('目前未选中cosid，请选中后重试')
        return
      }
      // 存在marker的情况下，无法继续添加marker
      if (this.data.usingMarkerId) {
        console.log('已添加 marker，请删除后重试')
        return
      }
      if (this.parseAddMarkerLoading) {
        console.log('加载中，请稍后重试')
        return
      }

      const resp = this.selectResp
      console.log('开始添加 marker')
      console.log('获取的模型的cosID为', this.selectCosid)
      console.log(this.selectResp)
      const filePath = wx.env.USER_DATA_PATH + '/temp'
      console.log('请求地址')
      console.log(resp.result.respBody.url)

      // 简单的加载锁
      this.parseAddMarkerLoading = true
      // 开始下载文件
      wx.downloadFile({
        filePath,
        url: resp.result.respBody.url,
        success: (res) => {
          console.log('下载回调', res)
          const fs = wx.getFileSystemManager()
          fs.readFile({
            filePath: res.filePath,
            position: 0,
            success: async (res) => {
              console.log('读文件回调，结果返回为', res)
              wx.hideLoading()

              // 开始解析具体信息 protobuf
              try {
                console.log('开始解析回调')
                var data = message.decode(res.data)
                console.log('反序列化完成')
                console.log(data)
              } catch (e) {
                wx.hideLoading()
                console.log('模型数据解析有误')
                console.log(e)
                if (e instanceof protobuf.util.ProtocolError) {
                  // missing required field
                  console.log('missing required field')
                } else {
                  // wire format is invalid
                  console.log('wire format is invalid')
                }
                throw e
              }

              let mapSuccess = true
              let gltfSuccess = true

              // map文件
              if (data.meshModel && data.meshModel.byteLength !== 0) {
                // map文件成功
                this.setData({
                  haveMap: true,
                })

                // 解析完毕，进行 buffer 具体处理
                // map文件
                const byteOffset = data.meshModel.byteOffset
                const byteLength = data.meshModel.byteLength
                const mapContent = data.meshModel.buffer.slice(byteOffset, byteOffset + byteLength)
                console.log('byteOffset:', byteOffset)
                console.log('byteLength:', byteLength)

                // 写入文件后的地址
                const mapUrl = this.saveLocalFile(mapContent, 'model.map')
                console.log('map文件的本地路径', mapUrl)
                this.parsedMapUrl = mapUrl

                // 添加marker
                const markerId = this.session.addMarker(mapUrl)
                console.log('add Marker', markerId, mapUrl)
                this.setData({
                  usingMarkerId: markerId
                })
              } else {
                mapSuccess = false
              }

              // glb文件
              if (data.meshBlob && data.meshBlob.byteLength !== 0) {
                // 简单过滤下无模型情况
                const glbByteOffset = data.meshBlob.byteOffset
                const glbByteLength = data.meshBlob.byteLength
                const glbContent = data.meshBlob.buffer.slice(glbByteOffset, glbByteOffset + glbByteLength)
                console.log('glbContent', glbContent)
                const glbUrl = this.saveLocalFile(glbContent, 'result.glb')
                console.log('glb文件的本地路径', glbUrl)
                this.parsedGlbUrl = glbUrl

                // @optional
                // 后续为添加渲染产物模型的逻辑
                // xrFrame 加载模型相关

                // 加载生成模型
                const xrFrameSystem = wx.getXrFrameSystem()
                const scene = this.xrScene

                // gltf索引更新
                gltfIndex++

                const resultModel = await scene.assets.loadAsset({
                  type: 'gltf',
                  assetId: `gltf-result-${gltfIndex}`,
                  src: `${wx.env.USER_DATA_PATH}/result.glb`,
                })
                console.log('resultModel', resultModel.value)
                const el = scene.createElement(xrFrameSystem.XRGLTF, {
                  model: `gltf-result-${gltfIndex}`,
                  position: `0 -${modelScale} -${modelScale}`,
                  rotation: '90 0 0',
                  scale: '0 0 0', // 默认先不显示
                })
                this.model = el
                this.modelTrs = el.getComponent(xrFrameSystem.Transform)
                this.modelShow = false
                this.xrScene.rootShadow.addChild(el)

                // Three 场景相关
                // const THREE = this.THREE;
                // // 控制容器节点
                // this.modelWrap = new THREE.Object3D();
                // this.scene.add( this.modelWrap );

                // // 加载模模型
                // const loader = this.loader = new THREE.GLTFLoader()
                // loader.parse( glbContent, './', ( gltf ) =>{
                //   console.log('gltf loaded', gltf.scene);

                //   // 设置模型索引以及缩放比
                //   this.model = gltf.scene;
                //   this.model.position.set(0, 0, 0);
                //   // 默认缩放设置到0.1
                //   this.model.scale.set(0.1, 0.1, 0.1);
                //   this.model.visible = false;

                //   console.log('gltf set', this.model);

                //   // 模型加载到场上
                //   this.modelWrap.add(this.model);
                // });
              } else {
                gltfSuccess = false
              }

              // 更新产物状态
              this.setData({
                haveMap: mapSuccess,
                haveGLTF: gltfSuccess
              })

              if (!mapSuccess || !gltfSuccess) {
                // 文件生成失败提示
                const mapWord = !mapSuccess ? 'map文件' : ''
                const gltfWord = !gltfSuccess ? 'glTF文件' : ''

                wx.showToast({
                  title: `${mapWord} ${gltfWord} 生成失败`,
                  icon: 'none',
                  duration: 2000
                })
              }

              this.parseAddMarkerLoading = false
            },
            fail(res) {
              wx.hideLoading()
              wx.showToast({
                title: res.errMsg,
                icon: 'none',
                duration: 2000
              })

              this.parseAddMarkerLoading = false
            }
          })
        },
        fail(res) {
          wx.hideLoading()
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 2000
          })
          console.error(res)
          this.parseAddMarkerLoading = false
        }
      })
    },
    saveLocalFile(bufferContent, name) {
      const url = `${wx.env.USER_DATA_PATH}/${name}`

      const fs = wx.getFileSystemManager()
      try {
        const res = fs.writeFileSync(
          url,
          bufferContent,
          'utf8'
        )
        console.log(res)
      } catch (e) {
        console.error(e)
      }

      return url
    },
    removeMarker() {
      // 清理所有 marker
      this.session.removeMarker(this.data.usingMarkerId)
      this.setData({
        usingMarkerId: null
      })
      // 释放xrframe资源
      if (this.model) {
        const scene = this.xrScene
        scene.assets.releaseAsset('gltf', `gltf-result-${gltfIndex}`)
        scene.rootShadow.removeChild(this.model)
        this.model = undefined
      }
    },
    getAllMarker() {
      console.log(this.session.getAllMarker())
    },
    changeSelect(e) {
      console.log('触发选择更改')
      console.log(e.detail)

      this.selectCosid = e.detail.cosid
      this.selectResp = e.detail.modelResp
    },
    saveMap() {
      if (!this.parsedMapUrl) {
        console.log('不存在使用中的map地址')
        return
      }
      wx.shareFileMessage({
        filePath: this.parsedMapUrl,
      })
    },
    saveGlTF() {
      if (!this.parsedGlbUrl) {
        console.log('不存在使用中的glb地址')
        return
      }

      wx.shareFileMessage({
        filePath: this.parsedGlbUrl,
      })
    },
    useDefaultMarker() {
      // 简单的加载锁
      if (this.parseAddMarkerLoading) {
        console.log('加载中，请稍后重试')
        return
      }
      this.parseAddMarkerLoading = true

      // 开始下载文件
      const filePath = wx.env.USER_DATA_PATH + '/default.map'
      wx.downloadFile({
        filePath,
        url: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/default.map',
        success: (res) => {
          console.log('下载回调', res)
          // 添加marker
          const markerId = this.session.addMarker(res.filePath)
          console.log('add Default Marker', markerId)
          this.modelShow = false
          this.setData({
            usingMarkerId: markerId
          })

          this.parseAddMarkerLoading = false
        },
        fail(res) {
          wx.hideLoading()
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 2000
          })
          console.error(res)
          this.parseAddMarkerLoading = false
        }
      })
    }
  },
})
