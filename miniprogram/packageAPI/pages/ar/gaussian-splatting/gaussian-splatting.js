import { loadPly } from './loaders/ply/ply-loader'
import { loadSplat } from './loaders/splat/splat-loader'
import CameraWebGL from './webgl2/camera-webGL'
import CubeInstanceWebGL from './webgl2/cubeInstance-webGL'
import SplatWebGL, { SplatRenderTexture } from './webgl2/splat-webGL'

import * as glMatrix from './util/gl-matrix-min'

const { mat4 } = glMatrix

const renderScale = 1

const baseMatrix = mat4.create()

Component({
  behaviors: [],
  data: {
    theme: 'light',
    widthScale: 1, // canvas宽度缩放值
    heightScale: 1, // canvas高度缩放值
    renderByXRFrame: false, // 是否使用 xr-frame渲染
    renderByWebGL2: true, // 是否使用WebGL2渲染
    workerOn: true,
    maxGaussians: 50000,
  },
  lifetimes: {
    /**
    * 生命周期函数--监听页面加载
    */
    attached() {
      console.log('页面attached')

      console.log('[worker] 排序 worker 的创建')
      this.worker = wx.createWorker('workers/gaussianSplatting/index.js')
      console.log('[worker] 具体 worker', this.worker)
    },
    detached() {
      console.log('页面detached')

      if (this.worker) this.worker.terminate()
    },
    ready() {
      console.log('页面准备完全')
    },
  },
  methods: {
    onReady() {
      // 获取canvas
      wx.createSelectorQuery()
        .select('#canvas')
        .node()
        .exec(res => {
          this.canvas = res[0].node

          const info = wx.getSystemInfoSync()
          const pixelRatio = info.pixelRatio
          const width = info.windowWidth * this.data.widthScale * pixelRatio * renderScale
          const height = info.windowHeight * this.data.heightScale * pixelRatio * renderScale
          // 存在 webgl Canvas的情况下，写入大小
          if (this.canvas) {
            this.canvas.width = width
            this.canvas.height = height
          }
          console.log(`canvas size: width = ${width} , height = ${height}`)
          console.log(`window size: width = ${info.windowWidth} , height = ${info.windowHeight}`)

          this.setData({
            width,
            height,
          })

          // 页面自定义初始化
          if (this.init) this.init()
        })
    },
    // 对应案例的初始化逻辑，由统一的 arBehavior 触发
    init() {
      console.log('== Page Init start ==')

      // 注册 各类渲染器
      if (this.data.renderByWebGL2) {
        this.initWebGL2()
      } else if (this.data.renderByXRFrame) {
        this.initXRFrame()
      }
    },
    initPLY(id) {
      console.log('== PLY Init start ==')

      const host = 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo'
      // const host = 'http://127.0.0.1:8030'
      // const host = 'http://10.9.169.149:8030'

      let type

      // 加载 ply
      // type = 'ply';
      // const pcSrc = `${host}/ply/oneflower.cleaned.ply`;
      // const pcSrc = `${host}/ply/point_cloud.ply`;
      // const pcSrc = `${host}/ply/room.ply`;
      // const pcSrc = `${host}/ply/gs_USJ_Mario_enter.cleaned.ply`;
      // const pcSrc = `${host}/ply/oneflower.ply`;
      // const pcSrc = `${host}/ply/sakura.ply`;
      // const pcSrc = `${host}/ply/sakura.cleaned.ply`;
      // const pcSrc = `${host}/ply/sakura.compressed.ply`;

      // 加载 splat
      type = 'splat'
      const pcSrc = `${host}/splat/${id}.splat`

      const splatModelMatrix = mat4.create()
      const modelMatrixLocal = mat4.create()
      const modelMatrixT = mat4.create()
      const modelMatrixR = mat4.create()
      const modelMatrixS = mat4.create()
      let splatScale = 1
      let splatRotationAngle = 0
      let splatRotationFlag = [0, 1, 0]
      let splatTranslate = [0, 0, 0]

      // 针对不同场景设置不同的 本地矩阵
      // Setup Camera
      switch (id) {
        case 'room':
          splatScale = 0.6
          splatTranslate = [0, -3, 0]
          splatRotationAngle = -Math.PI / 180 * 26
          splatRotationFlag = [1, 0, 0]
          this.camera.updateCameraInfo(
            // target
            [0, 0, 0],
            // theta
            -Math.PI / 2,
            // phi
            Math.PI / 2,
            // raidus
            1
          )
          break
        case 'garden':
          splatScale = 0.6
          splatTranslate = [0, -2, 0]
          splatRotationAngle = -Math.PI / 180 * 20
          splatRotationFlag = [1, 0, 0]
          this.camera.updateCameraInfo(
            // target
            [0, 0, 0],
            // theta
            -Math.PI / 2,
            // phi
            Math.PI / 2,
            // raidus
            2
          )
          break
        case 'stump':
          splatScale = 0.5
          splatTranslate = [0, 0, 0]
          this.camera.updateCameraInfo(
            // target
            [0, 0, 0],
            // theta
            -Math.PI * 2 / 3,
            // phi
            Math.PI / 4,
            // raidus
            2
          )
          break
        case 'oneflower':
          splatScale = 0.1
          splatTranslate = [-0.5, -2, -4]
          splatRotationAngle = -Math.PI / 180 * 40
          splatRotationFlag = [1, 0, 0]
          this.camera.updateCameraInfo(
            // target
            [0, 0, 0],
            // theta
            0,
            // phi
            Math.PI / 2,
            // raidus
            1
          )
          break
        case 'usj':
          splatTranslate = [0, 1, 0]
          this.camera.updateCameraInfo(
            // target
            [0, 0, 0],
            // theta
            -Math.PI * 7 / 6,
            // phi
            Math.PI / 2,
            // raidus
            1
          )
          break
        case 'sakura':
          splatTranslate = [-1.6, 0, -1]
          this.camera.updateCameraInfo(
            // target
            [0, 0, 0],
            // theta
            Math.PI * 3 / 11,
            // phi
            Math.PI * 3 / 5,
            // raidus
            1
          )
          break
        case '0517cruch':
          splatTranslate = [0, 0, 0]
          this.camera.updateCameraInfo(
            // target
            [0, 0, 0],
            // theta
            -Math.PI / 2,
            // phi
            Math.PI / 2,
            // raidus
            1
          )
          break
      }

      mat4.scale(modelMatrixS, mat4.create(), [splatScale, splatScale, splatScale])
      mat4.rotate(modelMatrixR, modelMatrixS, splatRotationAngle, splatRotationFlag)
      mat4.translate(modelMatrixT, modelMatrixR, splatTranslate)
      mat4.copy(modelMatrixLocal, modelMatrixT)

      // Y轴反转矩阵
      const fixMatrix = mat4.create()
      mat4.rotate(fixMatrix, mat4.create(), Math.PI, [0, 0, 1])

      // 本地矩阵
      const modelMatrixLocalFix = mat4.create()
      mat4.multiply(modelMatrixLocalFix, fixMatrix, modelMatrixLocal)

      // 世界矩阵
      const modelWorld = mat4.create()
      // mat4.translate(modelWorld, mat4.create(), [0, 1, 0])
      mat4.multiply(splatModelMatrix, modelWorld, modelMatrixLocalFix)
      this.camera.modelMatrix = splatModelMatrix

      console.log('splat src', pcSrc)

      wx.downloadFile({
        url: pcSrc,
        timeout: 200000,
        success: (res) => {
          console.log('downloadFile 下载回调', res)

          const filePath = res.tempFilePath

          const fs = wx.getFileSystemManager()

          /**
           * 因为微信读文件，最大只能读100MB的，所以需要分块读取。
           */
          const fd = fs.openSync({ filePath })
          const stats = fs.fstatSync({ fd })
          console.log('fd stats', stats)
          let size = stats.size
          if (size > 0) {
            const buffer = new ArrayBuffer(size)
            const viewU8 = new Uint8Array(buffer)
            let offset = 0
            let uindex = 0
            while (size > 0) {
              const chunkSize = Math.min(size, 100 * 1024 * 1024 /* 100MB */)

              const res = fs.readFileSync(
                filePath,
                undefined,
                offset,
                chunkSize,
              )
              const resU8 = new Uint8Array(res)
              viewU8.set(new Uint8Array(res), uindex)
              uindex += resU8.length

              // console.log('res', res)
              // console.log('uindex', uindex);
              // console.log('offset', offset);
              // console.log('chunkSize', chunkSize)

              offset += chunkSize
              size -= chunkSize
            }
            fs.close({ fd })

            // console.log('buffer', buffer)

            let info

            const maxGaussians = this.data.maxGaussians

            switch (type) {
              case 'ply':
                info = loadPly(buffer, maxGaussians)
                console.log('plyLoader return', info)
                break
              case 'splat':
                info = loadSplat(buffer, maxGaussians)
                console.log('splatLoader return', info)
                break
            }

            // 提供渲染的高斯球数
            const renderCount = this.renderCount = info.count

            // 全部用 f32 存储
            // this.sabPositions = wx.createSharedArrayBuffer(renderCount * 4 * 3)
            // this.sabOpacities= wx.createSharedArrayBuffer(renderCount * 4)
            // this.sabCov3Da = wx.createSharedArrayBuffer(renderCount * 4 * 3)
            // this.sabCov3Db = wx.createSharedArrayBuffer(renderCount * 4 * 3)
            // this.sabcolors = wx.createSharedArrayBuffer(renderCount * 4 * 3)

            // console.log('创建 worker 共享内存', this.sabPositions, this.sabOpacities, this.sabCov3Da, this.sabCov3Db, this.sabcolors)

            // 初始化 worker 相关
            this.initWorker(info, {
              // sabPositions: this.sabPositions,
              // sabOpacities: this.sabOpacities,
              // sabCov3Da: this.sabCov3Da,
              // sabCov3Db: this.sabCov3Db,
              // sabcolors: this.sabcolors,
            })
          } else {
            wx.hideLoading()
            wx.showToast({
              title: res.errMsg,
              icon: 'none',
              duration: 2000
            })
            console.error('file size is 0')
          }
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

    initWorker(plyInfo, config) {
      console.log('== Worker Init start ==')

      // 监听worker回调
      this.worker.onMessage((res) => {
        if (res.type === 'execFunc_init') {
          // worker 初始化 回调
          console.log('[Worker callback] gaussianSplatting init callBack', res)

          this.camera.isWorkerInit = true
          this.camera.update()
        } else if (res.type === 'execFunc_sort') {
          // worker 排序 回调
          // console.log(res)

          this.camera.isWorkerSorting = false

          const data = res.result.data

          const start = new Date().getTime()

          const gl = this.gl

          const updateBuffer = (buffer, data) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
          }

          const positions = new Float32Array(data.positions)
          const opacities = new Float32Array(data.opacities)
          const cov3Da = new Float32Array(data.cov3Da)
          const cov3Db = new Float32Array(data.cov3Db)
          const colors = new Float32Array(data.colors)

          // const positions = new Float32Array(this.sabPositions.buffer);
          // const opacities = new Float32Array(this.sabOpacities.buffer);
          // const cov3Da = new Float32Array(this.sabCov3Da.buffer);
          // const cov3Db = new Float32Array(this.sabCov3Db.buffer);
          // const colors = new Float32Array(this.sabcolors.buffer);

          updateBuffer(this.splat.buffers.center, positions)
          updateBuffer(this.splat.buffers.opacity, opacities)
          updateBuffer(this.splat.buffers.covA, cov3Da)
          updateBuffer(this.splat.buffers.covB, cov3Db)
          updateBuffer(this.splat.buffers.color, colors)

          // 设定绘制的高斯球数量
          this.gaussiansCount = data.gaussiansCount

          const end = new Date().getTime()
          // const sortTime = `${((end - start)/1000).toFixed(3)}s`
          // console.log(`updateBuffer ${sortTime}`)

          this.canvas.requestAnimationFrame(this.requestRender.bind(this))

          // console.log('execFunc_sort end')
        }
      })

      // 提交初始数据到 worker 侧
      this.worker.postMessage({
        type: 'execFunc_init',
        params: [plyInfo, config]
      })
    },
    // 后续为 webGL2 相关，为了方便开发，先放在一起
    initWebGL2() {
      console.log('== InitWebGL2 start ==')
      const gl = this.gl = this.canvas.getContext('webgl2')
      console.log('webgl2 context', gl)

      // Setup Camera
      const cameraParameters = {
        up: [0, 1.0, 0.0],
        target: [0, 0, 0],
        camera: [Math.PI / 2, Math.PI / 2, 1], // theta phi radius
      }
      this.camera = new CameraWebGL(gl, this.worker, cameraParameters)

      // Setup Instance Mesh
      this.cubeInstance = new CubeInstanceWebGL(gl)

      // Setup Splat
      this.initSplat(gl)
    },
    initSplat(gl) {
      // 初始化 splat 绘制到的 renderTexture
      this.splatRT = new SplatRenderTexture(gl)

      // 初始化 splat 渲染器
      this.splat = new SplatWebGL(gl)
    },
    requestRender() {
      // console.log('requestRender')

      // 限帧
      const now = Date.now()
      const last = this.lastRenderTime || 0
      const mill = now - last
      if (mill < 30) {
        return
      }
      this.lastRenderTime = now

      const gl = this.gl

      // Clear State
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.clearColor(0.8, 0.8, 0.8, 1.0)

      // clear
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      // 先关掉深度测试
      gl.disable(gl.DEPTH_TEST)

      this.drawSplat(gl)

      // resetState
      gl.disable(gl.CULL_FACE)
      // 深度测试
      gl.enable(gl.DEPTH_TEST)

      // drawCubeMesh
      const projMatrix = this.camera.projMatrix
      const viewMatrix = this.camera.viewMatrix
      const modelMatrix = mat4.create()
      const cubeScale = 0.02
      mat4.scale(modelMatrix, mat4.create(), [cubeScale, cubeScale, cubeScale])
      this.drawCubeMesh(gl, projMatrix, viewMatrix, modelMatrix)
    },
    drawCubeMesh(gl, projMatrix, viewMatrix, modelMatrix) {
      // mesh
      const meshCube = this.cubeInstance
      // Tell WebGL to use our program when drawing
      gl.useProgram(meshCube.programInfo.program)
      // VAO
      gl.bindVertexArray(meshCube.vao)
      // mesh position
      gl.bindBuffer(gl.ARRAY_BUFFER, meshCube.positionBuffer)
      gl.vertexAttribPointer(meshCube.programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(meshCube.programInfo.attribLocations.vertexPosition)
      // mesh color
      gl.bindBuffer(gl.ARRAY_BUFFER, meshCube.colorBuffer)
      gl.vertexAttribPointer(meshCube.programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(meshCube.programInfo.attribLocations.vertexColor)

      // Tell WebGL which indices to use to index the vertices
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshCube.indices)

      // Set the shader uniforms
      gl.uniformMatrix4fv(
        meshCube.programInfo.uniformLocations.projectionMatrix,
        false,
        projMatrix
      )
      gl.uniformMatrix4fv(
        meshCube.programInfo.uniformLocations.viewMatrix,
        false,
        viewMatrix
      )
      gl.uniformMatrix4fv(
        meshCube.programInfo.uniformLocations.modelMatrix,
        false,
        modelMatrix
      )

      // draw
      const vertexCount = 36
      const type = gl.UNSIGNED_SHORT
      const offset = 0
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
    },
    drawSplat(gl) {
      // 通用准备
      const cam = this.camera

      // 进行 Splat renderTexture 准备
      const splatRT = this.splatRT

      const splatRTFrameBuffer = this.splatRT.frameBuffer

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      gl.bindFramebuffer(gl.FRAMEBUFFER, splatRTFrameBuffer)

      gl.clearColor(0, 0, 0, 0.0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      // Set Splat state
      gl.disable(gl.DEPTH_TEST)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.ONE)
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

      // console.log('drawSplat')

      // 开启 Splat 绘制流程
      const splat = this.splat
      const program = splat.program
      // Use Program
      gl.useProgram(program)
      // VAO
      gl.bindVertexArray(splat.vao)

      // Original implementation parameters
      const canvasWidth = gl.canvas.width
      const canvasHeight = gl.canvas.height
      const tan_fovy = Math.tan(cam.fov_y * 0.5)
      const tan_fovx = tan_fovy * canvasWidth / canvasHeight
      const focal_y = canvasHeight / (2 * tan_fovy)
      const focal_x = canvasWidth / (2 * tan_fovx)

      gl.uniform1f(gl.getUniformLocation(program, 'canvas_width'), canvasWidth)
      gl.uniform1f(gl.getUniformLocation(program, 'canvas_height'), canvasHeight)
      gl.uniform1f(gl.getUniformLocation(program, 'focal_x'), focal_x)
      gl.uniform1f(gl.getUniformLocation(program, 'focal_y'), focal_y)
      gl.uniform1f(gl.getUniformLocation(program, 'tan_fovx'), tan_fovx)
      gl.uniform1f(gl.getUniformLocation(program, 'tan_fovy'), tan_fovy)
      gl.uniform1f(gl.getUniformLocation(program, 'scale_modifier'), 1.0)
      gl.uniformMatrix4fv(gl.getUniformLocation(program, 'modelViewMatrix'), false, cam.mvm)
      gl.uniformMatrix4fv(gl.getUniformLocation(program, 'modelViewProjectMatrix'), false, cam.mvpm)
      // gl.uniformMatrix4fv(gl.getUniformLocation(program, 'modelmatrix'), false, baseMatrix)
      // gl.uniformMatrix4fv(gl.getUniformLocation(program, 'viewmatrix'), false, cam.vm)

      // Draw Splat
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.gaussiansCount)

      // resetState
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

      // 最后将RT绘制 到 主屏
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

      gl.useProgram(splatRT.programInfo.program)
      // VAO
      gl.bindVertexArray(splatRT.vao)
      // position
      gl.bindBuffer(gl.ARRAY_BUFFER, splatRT.buffers.position)
      gl.vertexAttribPointer(splatRT.programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(splatRT.programInfo.attribLocations.vertexPosition)
      // texCoord
      gl.bindBuffer(gl.ARRAY_BUFFER, splatRT.buffers.texCoord)
      gl.vertexAttribPointer(splatRT.programInfo.attribLocations.vertexTexcoord, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(splatRT.programInfo.attribLocations.vertexTexcoord)
      // indices
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, splatRT.buffers.indices)

      // draw RenderTexture
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
    },
    // webGL触摸相关逻辑
    onTouchStartWebGL(e) {
      // console.log(e);

      if (e.touches.length === 1) {
        this.camera.lastTouch.x1 = e.touches[0].clientX
        this.camera.lastTouch.y1 = e.touches[0].clientY
        this.camera.lastTouch.x2 = null
        this.camera.lastTouch.y2 = null
        this.camera.lastTouch.distance = 0
      } else if (e.touches.length === 2) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]

        this.camera.lastTouch.x1 = touch1.clientX
        this.camera.lastTouch.y1 = touch1.clientY
        this.camera.lastTouch.x2 = touch2.clientX
        this.camera.lastTouch.y2 = touch2.clientY

        const distanceX = touch1.clientX - touch2.clientX
        const distanceY = touch1.clientY - touch2.clientY
        this.camera.lastTouch.distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
      }
    },
    onTouchMoveWebGL(e) {
      // console.log(e);

      const moveScale = 1

      if (e.touches.length === 1) {
        const touch = e.touches[0]
        // 单指移动镜头
        const movementX = touch.clientX - this.camera.lastTouch.x1
        const movementY = touch.clientY - this.camera.lastTouch.y1
        this.camera.lastTouch.x1 = touch.clientX
        this.camera.lastTouch.y1 = touch.clientY

        if (Math.abs(movementX) < 50 && Math.abs(movementY) < 50) {
          // 只处理小移动
          this.camera.theta += movementX * 0.01 * 0.3 * moveScale
          this.camera.phi = Math.max(1e-6, Math.min(Math.PI - 1e-6, this.camera.phi - movementY * 0.01 * moveScale))
        }
      } else if (e.touches.length === 2) {
        // 支持单指变双指，兼容双指操作但是两根手指触屏时间不一致的情况
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]

        const distanceX = touch1.clientX - touch2.clientX
        const distanceY = touch1.clientY - touch2.clientY
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

        if (this.camera.lastTouch.x2 === null && this.camera.lastTouch.y2 === null) {
          this.camera.lastTouch.x1 = touch1.clientX
          this.camera.lastTouch.y1 = touch1.clientY
          this.camera.lastTouch.x2 = touch2.clientX
          this.camera.lastTouch.y2 = touch2.clientY

          this.camera.lastTouch.distance = distance
        } else {
          // 双指开始滑动
          let deltaScale = distance - this.camera.lastTouch.distance
          this.camera.lastTouch.distance = distance

          if (deltaScale < -2) {
            deltaScale = -2
          } else if (deltaScale > 2) {
            deltaScale = 2
          }

          const newRaidus = this.camera.radius - deltaScale * 0.2
          this.camera.radius = newRaidus > 0 ? newRaidus : this.camera.radius
        }
      }

      this.camera.update()

      this.canvas.requestAnimationFrame(this.requestRender.bind(this))
    },
    onTapControl(e) {
      const dataSet = e.target.dataset

      const id = dataSet.id

      // 开始处理 ply 资源
      this.initPLY(id)
    },
    changeMaxGaussianCount(e) {
      this.setData({
        maxGaussians: e.detail.value
      })

      console.log('slider maxGaussians:', this.data.maxGaussians)
    },
    switchWorker(e) {
      this.setData({
        workerOn: e.detail.value
      })

      this.camera.setWorkerOn(this.data.workerOn)

      console.log('switch WorkerOn:', this.data.workerOn)
    }
  },
})
