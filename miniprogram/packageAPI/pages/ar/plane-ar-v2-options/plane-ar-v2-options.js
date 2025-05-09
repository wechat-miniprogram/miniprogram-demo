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
  },
  markerIndex: 0, // 使用的 marker 索引
  showBoxList: [], // 提示盒子列表,
  hintCenter: null, // 红色提示点
  useDepthBuffer: false, // 开启深度buffer
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
      this.initDepthGL()

      this.loader.load('https://dldir1.qq.com/weixin/miniprogram/reticle_4b6cc19698ca4a08b31fd3c95ce412ec.glb', gltf => {
        const reticle = this.hintCenter = gltf.scene

        reticle.visible = false
        this.scene.add(reticle)
      })

      // 初始化 GL，基于 Three.js 的 Context，用于相机YUV渲染
      this.initYUV()

      // 初始化VK
      // start完毕后，进行更新渲染循环
      this.initVK()

      this.markerIndex = 0
      this.showBoxList = []
      this.useDepthBuffer = false
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
          // console.log("addAnchor", anchors);

          anchors.forEach(anchor => {
            const showBox = {
              id: anchor.id,
              size: anchor.size,
              transform: anchor.transform
            }

            switch (anchor.type) {
              case 0:
                // plane Anchor
                const boxPlane = this.createBox(0xffffff, anchor.type)
                boxPlane.box.scale.set(showBox.size.width, 0.02, showBox.height)
                console.log('boxPlane.size', showBox.size)

                showBox.type = 'Plane'
                showBox.wrap = boxPlane.wrap
                showBox.box = boxPlane.box
                break
              case 1:
                // marker Anchor
                const boxMarker = this.createBox(0x55cc55, anchor.type)
                boxMarker.box.scale.set(1, 0.1, 1)
                console.log('boxMarker.size', showBox.size)

                showBox.type = 'Marker'
                showBox.wrap = boxMarker.wrap
                showBox.box = boxMarker.box
                break
            }

            this.showBoxList.push(showBox)
          })

          console.log('this.showBoxList', this.showBoxList)
        })

        // VKSession EVENT updateAnchors
        session.on('updateAnchors', anchors => {
          // plane + marker 模式下，可以有多个识别目标
          // console.log('this.showBoxList', this.showBoxList)

          // 仅更新已经添加的Anchor
          this.showBoxList.forEach(showBox => {
            for (let i = 0; i < anchors.length; i++) {
              if (showBox.id === anchors[i].id) {
                // 匹配
                if (showBox.size !== anchors[i].size) {
                  switch (showBox.type) {
                    case 'Plane':
                      showBox.box.scale.set(anchors[i].size.width, 0.02, anchors[i].size.height)
                      break
                    case 'Marker':
                      break
                  }
                }
                showBox.size = anchors[i].size
                showBox.transform = anchors[i].transform
                break
              }
            }
          })
        })

        // VKSession removeAnchors
        // 识别目标丢失时，会触发一次
        session.on('removeAnchors', anchors => {
          // console.log('removeAnchors', anchors)

          // 存在要删除的 Anchor
          if (anchors.length > 0) {
            this.showBoxList = this.showBoxList.filter((showBox) => {
              let flag = true
              for (let i = 0; i < anchors.length; i++) {
                if (showBox.id === anchors[i].id) {
                  console.log('remove', showBox.id)
                  let scene = this.scene
                  if (showBox.type === 'Marker') {
                    scene = this.sceneCull
                  }
                  // 从three里面去掉
                  scene.remove(showBox.wrap)
                  // 标记删除
                  flag = false
                  break
                }
              }
              return flag
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

      // 更新提示盒子 位置
      if (this.showBoxList) {
        this.showBoxList.forEach(showBox => {
          showBox.wrap.matrix.fromArray(showBox.transform)
        })
      }

      const reticle = this.hintCenter
      if (reticle) {
        const hitTestRes = this.session.hitTest(0.5, 0.5)
        if (hitTestRes.length) {
          reticle.matrixAutoUpdate = false
          reticle.matrix.fromArray(hitTestRes[0].transform)
          reticle.matrix.decompose(reticle.position, reticle.quaternion, reticle.scale)
          reticle.visible = true
        } else {
          reticle.visible = false
        }
      }

      this.renderer.autoClearColor = false
      this.renderer.autoClearDepth = false

      // 绘制提示的物体
      this.renderer.state.setCullFace(this.THREE.CullFaceBack)
      this.renderer.render(this.scene, this.camera)
      this.renderer.state.setCullFace(this.THREE.CullFaceNone)

      if (this.useDepthBuffer) {
        // 1. 在左下角绘制深度提示
        // 2. 写入深度遮挡纹理到深度值
        this.renderDepthGL(frame)
      }
      // 绘制进行深度遮挡的物体
      this.renderer.render(this.sceneCull, this.camera)
      this.renderer.state.setCullFace(this.THREE.CullFaceNone)
    },
    createBox(color, type) {
      const THREE = this.THREE
      let scene = this.scene

      let material

      // 根据类型添加不一样的行为
      switch (type) {
        case 0:
          // plane Anchor
          material = new THREE.MeshBasicMaterial({
            metalness: 0.0,
            roughness: 0.1,
            color,
            transparent: true,
            opacity: 0.8
          })
          break
        case 1:
          // marker Anchor

          const uniforms = {
            time: { value: Math.random() * 100 }
          }

          material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: `
              varying vec2 vUv;
              void main()	{
                vUv = uv;
                vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );
                gl_Position = projectionMatrix * mvPosition;
              }
            `,
            fragmentShader: `varying vec2 vUv;
              uniform float time;
              void main()	{
                vec2 p = - 1.0 + 2.0 * vUv;
                float a = time * 40.0;
                float d, e, f, g = 1.0 / 40.0 ,h ,i ,r ,q;
        
                e = 400.0 * ( p.x * 0.5 + 0.5 );
                f = 400.0 * ( p.y * 0.5 + 0.5 );
                i = 200.0 + sin( e * g + a / 150.0 ) * 20.0;
                d = 200.0 + cos( f * g / 2.0 ) * 18.0 + cos( e * g ) * 7.0;
                r = sqrt( pow( abs( i - e ), 2.0 ) + pow( abs( d - f ), 2.0 ) );
                q = f / r;
                e = ( r * cos( q ) ) - a / 2.0;
                f = ( r * sin( q ) ) - a / 2.0;
                d = sin( e * g ) * 176.0 + sin( e * g ) * 164.0 + r;
                h = ( ( f + d ) + a / 2.0 ) * g;
                i = cos( h + r * p.x / 1.3 ) * ( e + e + a ) + cos( q * g * 6.0 ) * ( r + h / 3.0 );
                h = sin( f * g ) * 144.0 - sin( e * g ) * 212.0 * p.x;
                h = ( h + ( f - e ) * q + sin( r - ( a + h ) / 7.0 ) * 10.0 + i / 4.0 ) * g;
                i += cos( h * 2.3 * sin( a / 350.0 - q ) ) * 184.0 * sin( q - ( r * 4.3 + a / 12.0 ) * g ) + tan( r * g + h ) * 184.0 * cos( r * g + h );
                i = mod( i / 5.6, 256.0 ) / 64.0;
                if ( i < 0.0 ) i += 4.0;
                if ( i >= 2.0 ) i = 4.0 - i;
                d = r / 350.0;
                d += sin( d * d * 8.0 ) * 0.52;
                f = ( sin( a * g ) + 1.0 ) / 2.0;
                gl_FragColor = vec4( vec3( f * i / 1.6, i / 2.0 + d / 13.0, i ) * d * p.x + vec3( i / 1.3 + d / 8.0, i / 2.0 + d / 18.0, i ) * d * ( 1.0 - p.x ), 1.0 );
              }`,
          })

          scene = this.sceneCull

          break
      }

      const geometry = new THREE.BoxGeometry(1, 1, 1)

      const wrap = new THREE.Object3D()
      // 禁止矩阵自动更新，只能手动写入信息
      wrap.matrixAutoUpdate = false

      // 绘制区域的box
      const box = new THREE.Mesh(geometry, material)
      wrap.add(box)

      scene.add(wrap)

      box.visible = true

      return {
        wrap,
        box,
      }
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
    placeItem() {
      if (this.hintCenter && this.hintCenter.visible) {
        const THREE = this.THREE
        const scene = this.sceneCull

        // 加载模型
        this.loader.load('https://dldir1.qq.com/weixin/miniprogram/RobotExpressive_aa2603d917384b68bb4a086f32dabe83.glb', gltf => {
          const wrap = new THREE.Object3D()

          wrap.add(gltf.scene)

          scene.add(wrap)

          const position = new THREE.Vector3()
          const rotation = new THREE.Quaternion()
          const scale = new THREE.Vector3()
          this.hintCenter.matrix.decompose(position, rotation, scale)
          wrap.position.set(position.x, position.y, position.z)
          wrap.rotation.set(rotation.x, rotation.y, rotation.z, rotation.w)
          wrap.scale.set(0.1, 0.1, 0.1)

          console.log('model加载完成')

          console.log('position', position.x, position.y, position.z)
          // console.log('rotation', rotation.x, rotation.y, rotation.z, rotation.w);
          // boxPlace.box.matrix.FromMatrix4(this.hintCenter.matrix);
        })
      }
    },
    changeDepthFlag() {
      const depthNear = 0.1
      const depthFar = 20
      this.session.setDepthOccRange(depthNear, depthFar)

      this.useDepthBuffer = !this.useDepthBuffer
      this.session.setDepthSwitch(this.useDepthBuffer)
    },
  },
})
