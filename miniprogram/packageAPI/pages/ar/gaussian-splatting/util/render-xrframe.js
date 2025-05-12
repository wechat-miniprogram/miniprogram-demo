import splat_vs from './shader/splat_xrframe_vs.glsl'
import splat_fs from './shader/splat_xrframe_fs.glsl'

const xrFrameRender = {
  // 对应案例的初始化逻辑，由统一的 behavior 触发
  init() {
    console.log('start init ply')

    const plySrc = 'http://10.9.233.66:8000/ply/point_cloud.ply'

    const filePath = wx.env.USER_DATA_PATH + '/point.ply'
    wx.downloadFile({
      filePath,
      url: plySrc,
      success: (res) => {
        console.log('下载回调', res)
        const fs = wx.getFileSystemManager()
        fs.readFile({
          filePath: res.filePath,
          position: 0,
          success: async (res) => {
            console.log('读文件回调，结果返回为', res)

            // const plyInfo = plyLoader.parsePLYBuffer(res.data);

            const plyInfo = loadPly(res.data)

            console.log('plyLoader return', plyInfo)

            // 初始化 worker 相关
            this._worker.postMessage({
              type: 'execFunc_init',
              params: [plyInfo]
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
      }
    })

    // 监听worker回调
    this._worker.onMessage((res) => {
      if (res.type === 'execFunc_init') {
        // 初始化 worker 回调
        console.log('gaussianSplatting init callBack')
        console.log('res', res)

        this.initGSGeometry(res.result.count, res.result.vertexSize)
      } else if (res.type === 'execFunc_sort') {
        // worker 排序 回调
        // console.log('gaussianSplatting sort callBack', res.result)

        // const vb = getVertexBuffer(this.vertexData);

        this.geometryGeo.uploadVertexBuffer(0, res.result.vertexBuffer)

        // console.log('sort callback', this.geometryGeo, res.result.vertexBuffer)
      }
    })
  },
  initGSGeometry(gaussianCount, vertexSize) {
    console.log('initGSGeometry start')

    const xrFrameSystem = wx.getXrFrameSystem()
    const createGSEffect = (scene) => scene.createEffect({
      name: 'gaussianSplatting',
      defaultRenderQueue: 3000,
      properties: [
        {
          key: 'screen_width',
          type: xrFrameSystem.EUniformType.FLOAT,
          default: 0
        },
        {
          key: 'screen_height',
          type: xrFrameSystem.EUniformType.FLOAT,
          default: 0
        },
        {
          key: 'focal_x',
          type: xrFrameSystem.EUniformType.FLOAT,
          default: 0
        },
        {
          key: 'focal_y',
          type: xrFrameSystem.EUniformType.FLOAT,
          default: 0
        },
        {
          key: 'tan_fovx',
          type: xrFrameSystem.EUniformType.FLOAT,
          default: 0
        },
        {
          key: 'tan_fovy',
          type: xrFrameSystem.EUniformType.FLOAT,
          default: 0
        },
        {
          key: 'scale_modifier',
          type: xrFrameSystem.EUniformType.FLOAT,
          default: 1
        },
      ],
      images: [],
      passes: [
        {
          renderStates: {
            blendOn: true,
            depthWrite: false,
            cullOn: false,
          },
          lightMode: 'ForwardBase',
          useMaterialRenderStates: true,
          shaders: [0, 1]
        }
      ],
      shaders: [
        // Vertex Shader
        splat_vs,
        // Fragement Shader
        splat_fs
      ],
    })

    this.geometryRoot = this.xrScene.getElementById('geometryRoot')

    console.log('geometryRoot', this.geometryRoot)

    // 注册 Geometry 信息
    xrFrameSystem.registerGeometry('gaussian-splatting', scene => {
      console.log('registerGeometry')
      const vl = scene.createVertexLayout({
        attributes: [
          {
            name: 'a_center',
            format: xrFrameSystem.EVertexFormat.FLOAT3,
            offset: 0,
          },
          {
            name: 'a_opacity',
            format: xrFrameSystem.EVertexFormat.FLOAT,
            offset: 12,
          },
          {
            name: 'a_cov3Da',
            format: xrFrameSystem.EVertexFormat.FLOAT3,
            offset: 16,
          },
          {
            name: 'a_cov3Db',
            format: xrFrameSystem.EVertexFormat.FLOAT3,
            offset: 28,
          },
          {
            name: 'a_color',
            format: xrFrameSystem.EVertexFormat.FLOAT3,
            offset: 40,
          },
          {
            name: 'a_corner',
            format: xrFrameSystem.EVertexFormat.FLOAT2,
            offset: 52,
          },
        ],
        stride: 60
      })

      console.log('createVertexLayout')

      const indices = []
      const verticesPerInstance = 4
      const instanceCount = gaussianCount / verticesPerInstance
      for (let i = 0; i < instanceCount; i++) {
        // 对于每个实例，添加6个索引以形成2个三角形
        const base = i * 4 // 每个实例的基础顶点索引
        // 第一个三角形
        indices.push(base, base + 1, base + 2)
        // 第二个三角形
        indices.push(base + 2, base + 1, base + 3)
      }

      console.log('indices', indices)

      // VertexBuffer IndexBuffer 不能动态更改长度，需要一开始设定较大的长度。
      const vb = new Float32Array(gaussianCount * vertexSize)
      const ib = new Uint16Array(indices)

      console.log('vb', vb)
      console.log('ib', ib)

      const geo = scene.createGeometry(vl, vb, ib)

      geo.setBoundBall(new xrFrameSystem.Vector3(), 1)
      geo.addSubMesh(ib.length, 0, 0)

      return geo
    })

    console.log('gaussianSplatting geo')

    xrFrameSystem.registerEffect('gaussianSplatting', createGSEffect)

    console.log('gaussianSplatting effect')

    this.geoElem = this.xrScene.createElement(xrFrameSystem.XRMesh, {
      geometry: 'gaussian-splatting',
      position: '0 0 0',
      scale: '0.2 0.2 0.2'
    })
    this.geometryRoot.addChild(this.geoElem)

    console.log('init geo end')

    // 延时保证挂载与初始化完毕
    setTimeout(() => {
      this.meshGeo = this.geoElem.getComponent(xrFrameSystem.Mesh)
      this.geometryGeo = this.meshGeo.geometry

      this.matGeo = this.meshGeo.material

      const gsMaterial = this.xrScene.createMaterial(
        // 使用定制的效果
        this.xrScene.assets.getAsset('effect', 'gaussianSplatting')
      )
      console.log('gsMaterial', gsMaterial)

      // 设定 绘制双面
      // gsMaterial.setRenderState("cullOn", false);

      const frameWidth = this.xrScene.frameWidth
      const frameHeight = this.xrScene.frameHeight
      const tan_fovy = Math.tan(60 / 180 * Math.PI * 0.5)
      const tan_fovx = tan_fovy * frameWidth / frameHeight
      const focal_y = frameHeight / (2 * tan_fovy)
      const focal_x = frameWidth / (2 * tan_fovx)

      console.log('gsMaterial', gsMaterial)

      console.log('frameWidth', frameWidth)
      console.log('frameHeight', frameHeight)
      console.log('tan_fovy', tan_fovy)
      console.log('tan_fovx', tan_fovx)
      console.log('focal_y', focal_y)
      console.log('focal_x', focal_x)

      // 设定屏幕相关uniform
      gsMaterial.setFloat('screen_width', frameWidth)
      gsMaterial.setFloat('screen_height', frameHeight)
      gsMaterial.setFloat('tan_fovy', tan_fovy)
      gsMaterial.setFloat('tan_fovx', tan_fovx)
      gsMaterial.setFloat('focal_y', focal_y)
      gsMaterial.setFloat('focal_x', focal_x)

      this.meshGeo.material = gsMaterial

      console.log('meshGeo')

      // 初始化循环
      console.log('initRenderLoop')
      this.initRenderLoop()
    }, 200)
  },
  initRenderLoop() {
    // this.loopTimer = setInterval(this.loop.bind(this), 2000);
    this.loopTimer = setTimeout(this.loop.bind(this), 2000)
  },
  loop() {
    // console.log(this.xrCamera._viewMatrix)
    this._worker.postMessage({
      type: 'execFunc_sort',
      params: [
        {
          viewMatrix: this.xrCamera._viewMatrix
        }
      ]
    })
  }
}
