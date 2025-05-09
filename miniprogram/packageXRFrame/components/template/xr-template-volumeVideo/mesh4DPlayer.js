// 着色器
import videoVert from './shaders/videoVert'
import videoFrag from './shaders/videoFrag'
import shadowVert from './shaders/shadowVert'
import shadowFrag from './shaders/shadowFrag'

const xrFrameSystem = wx.getXrFrameSystem()
const maxVB = 800000
const maxIB = 800000
const max_bones = 60
// VertexBuffer IndexBuffer 不能动态更改长度，需要一开始设定较大的长度。
const vb0 = new Float32Array(new Array(maxVB)) // 人物 vertex 长度 77030
const ib0 = new Uint16Array(new Array(maxIB)) // 人物 index 88266 88266
const vb0Clear = new Float32Array(new Array(maxVB)) // 人物 vertex 长度 77030
const ib0Clear = new Uint16Array(new Array(maxIB)) // 人物 index 88266 88266

const getFrame_ = 5
const xrTimeOut_ = 5

// 文件管理器
let fs

class mesh4DPlayer {
  constructor(options) {
    this.name = options.name || 'demo'
    this.rootName = 'geometryRoot-' + options.name
    this.urlRoot = options.urlRoot
    // XRFrame的scene
    this.scene = options.scene
    this.startTime = options.startTime || 0
    this.startFrameIndex = this.startTime * 22
    this.index = options.index || 0
    this.nextRenderFrameCount = 20

    this.loop = options.loop
    this.autoPlay = options.autoPlay
    this.initComplete = options.initComplete
    this.mountedComplete = options.mountedComplete

    this.pendingBufferDownload = false
    this.nextBufferLoadIndex = 0
    this.playing = false
    this.arrayBuffers = []
    this.decoder = false
    this.decoderStart = false
    this.preStart = options.preStart
    if (options.urlRoot) {
      this.load(options.urlRoot)
    }
  }

  createVideoTexture(scene, data, width, height, pixelFormat) {
    return scene.createTexture({
      source: [data],
      pixelFormat,
      width,
      height,
      magFilter: xrFrameSystem.EFilterMode.NEAREST,
      minFilter: xrFrameSystem.EFilterMode.NEAREST,
      wrapU: xrFrameSystem.EWrapMode.CLAMP_TO_EDGE,
      wrapV: xrFrameSystem.EWrapMode.CLAMP_TO_EDGE,
      anisoLevel: 1
    })
  }

  createSimpleEffect() {
    const effect = this.scene.createEffect({
      name: 'frame-effect' + this.name,
      properties: [
        { key: 'u_baseColorFactor', type: xrFrameSystem.EUniformType.FLOAT4, default: [1, 1, 1, 1] },
        // { key: 'u_farthestDistance', type: xrFrameSystem.EUniformType.FLOAT, default: [100]},
        // { key: 'u_nearestDistance', type: xrFrameSystem.EUniformType.FLOAT, default: [0.5]},
        // { key: 'u_offsetZ', type: xrFrameSystem.EUniformType.FLOAT, default: [2.0]}
      ],
      images: [
        {
          key: 'u_baseColorMap',
          default: 'white',
          macro: 'WX_USE_BASECOLORMAP'
        },

        {
          key: 'texture2',
          default: 'white',
          macro: 'WX_USE_BASECOLORMAP'
        }
      ],
      defaultRenderQueue: 2000,
      passes: [
        {
          renderStates: {
            cullOn: true,
            blendOn: false,
            depthWrite: true,
            cullFace: xrFrameSystem.ECullMode.FRONT,
          },
          lightMode: 'ShadowCaster',
          useMaterialRenderStates: false,
          shaders: [2, 3],
        },
        {
          renderStates: {
            cullOn: false,
            blendOn: false,
            depthWrite: true,
            depthTestOn: true,
            cullFace: xrFrameSystem.ECullMode.BACK,
          },
          lightMode: 'ForwardBase',
          useMaterialRenderStates: false,
          shaders: [0, 1]
        }],
      shaders: [
        videoVert,
        videoFrag,
        shadowVert,
        shadowFrag,
      ],
    })
    this.scene.assets.addAsset('effect', 'frame-effect' + this.name, effect)
    return effect
  }

  calcFrameIndex(data) {
    this.pixelBuffer = new Uint8Array(data)
    this.frameIndex = 0 // 帧索引初始化为 0
    for (let a = 0; a < 16; ++a) {
      // 遍历 16 个像素
      if (this.pixelBuffer[4 * a] > 128 || this.pixelBuffer[4 * a + 1] > 128) {
        // 如果像素值大于 128
        this.frameIndex += 1 << a // 更新帧索引
      }
    }
  }

  updateRender(data) {
    this.calcFrameIndex(data)
    let current_frame = this.frames[this.frameIndex]
    if (!current_frame) return
    const {
      isFirstFrame,
      deformation,
      f,
      vbo,
      pos,
      tc,
      weights,
      indices
    } = current_frame
    const arrayBufferIndex = this.buffers[this.frames[this.frameIndex].binFileIdx].arrayBufferIndex
    let mesh_buffers = this.arrayBuffers[arrayBufferIndex]
    if (isFirstFrame != 'true') {
      const idx = this.seekNearestFirstFrame(this.frameIndex, this.firstFrames)
      if (idx != this.lastFirstFrameIdx) {
        this.reloadFirstFrame = true
        this.lastFirstFrameIdx = idx
      } else {
        this.reloadFirstFrame = false
      }
    } else {
      this.lastFirstFrameIdx = this.frameIndex
    }
    // 清理内存
    current_frame = false
    // 获取当前基础数据
    if (isFirstFrame == 'true' || this.reloadFirstFrame) {
      this.index = new Uint16Array(mesh_buffers, this.boxs[f].start_byte, this.boxs[f].count * 3)
      if (vbo) {
        this.vbo = new Float32Array(mesh_buffers, this.boxs[vbo].start_byte, this.boxs[vbo].count * 13)
      } else {
        this.pos = new Float32Array(mesh_buffers, this.boxs[pos].start_byte, this.boxs[pos].count * 3)
        this.uv = new Float32Array(mesh_buffers, this.boxs[tc].start_byte, this.boxs[tc].count * 2)
        this.weights = new Float32Array(mesh_buffers, this.boxs[weights].start_byte, this.boxs[weights].count * 4)
        this.indices = new Float32Array(mesh_buffers, this.boxs[indices].start_byte, this.boxs[indices].count * 4)
      }
    }
    const {
      count,
      start_byte
    } = this.boxs[deformation]
    let deform = new Float32Array(mesh_buffers, start_byte, count * 12)
    // 清理内存
    mesh_buffers = false
    if (!this.pixelData) {
      this.pixelData = new Float32Array(max_bones * 16)
      this.pixelDataClear = new Float32Array(max_bones * 16)
    }
    this.pixelData.set(this.pixelDataClear)

    for (let i = 0; i < count; i++) {
      const start_idx = i * 16
      this.pixelData[start_idx + 0] = deform[12 * i + 0]
      this.pixelData[start_idx + 1] = deform[12 * i + 3]
      this.pixelData[start_idx + 2] = deform[12 * i + 6]
      this.pixelData[start_idx + 3] = 0
      this.pixelData[start_idx + 4] = deform[12 * i + 1]
      this.pixelData[start_idx + 5] = deform[12 * i + 4]
      this.pixelData[start_idx + 6] = deform[12 * i + 7]
      this.pixelData[start_idx + 7] = 0
      this.pixelData[start_idx + 8] = deform[12 * i + 2]
      this.pixelData[start_idx + 9] = deform[12 * i + 5]
      this.pixelData[start_idx + 10] = deform[12 * i + 8]
      this.pixelData[start_idx + 11] = 0
      this.pixelData[start_idx + 12] = deform[12 * i + 9]
      this.pixelData[start_idx + 13] = deform[12 * i + 10]
      this.pixelData[start_idx + 14] = deform[12 * i + 11]
      this.pixelData[start_idx + 15] = 1
    }
    // 清理内存
    deform = false
    if (this.geometryMan) {
      this.updateData(isFirstFrame, 'updateRender(data)')
      if (!this.decoderStart) {
        this.ended_ = false
        this.decoderStart = true
      }
    } else {
      // 挂载dom
      this.initXRMesh(isFirstFrame)
    }
  }

  initXRMesh(isFirstFrame) {
    this.decoderStart_ = -1
    this.geometryRoot = this.scene.getElementById(this.rootName)
    const vl = this.scene.createVertexLayout({
      attributes: [{
        name: 'a_position',
        format: xrFrameSystem.EVertexFormat.FLOAT3,
        offset: 0,
        usage: xrFrameSystem.EVertexLayoutUsage.POSITION
      },
      {
        name: 'a_texCoord',
        format: xrFrameSystem.EVertexFormat.FLOAT2,
        offset: 12,
        usage: xrFrameSystem.EVertexLayoutUsage.UV0
      },
      {
        name: 'a_boneIndices',
        format: xrFrameSystem.EVertexFormat.FLOAT4,
        offset: 20,
      },
      {
        name: 'a_weights',
        format: xrFrameSystem.EVertexFormat.FLOAT4,
        offset: 36,
      },
      ],
    })
    const geometry = this.scene.createGeometry(vl, vb0, ib0)
    geometry.setBoundBall(new xrFrameSystem.Vector3(), 1)
    geometry.addSubMesh(ib0.length, 0, 0)
    this.scene.assets.addAsset('geometry', 'geometry-' + this.name, geometry)
    const Format1 = xrFrameSystem.ETextureFormat.RGBA8
    const Format2 = xrFrameSystem.ETextureFormat.RGBA32F
    // Uint8Array
    this.texture_ = this.createVideoTexture(this.scene, this.pixelBuffer, 1024, 1024, Format1)
    this.scene.assets.addAsset('texture', 'texture1-' + this.name, this.texture_)
    // Float32Array
    this.texture_2 = this.createVideoTexture(this.scene, this.pixelData, 4, 60, Format2)
    this.scene.assets.addAsset('texture', 'texture2-' + this.name, this.texture_2)
    this.simple2 = this.createSimpleEffect()

    const toonMaterial = this.scene.createMaterial(this.simple2, {
      texture2: this.texture_2,
      u_baseColorMap: this.texture_
    })
    this.scene.assets.addAsset('material', 'material-' + this.name, toonMaterial)
    this.manElem = this.scene.createElement(xrFrameSystem.XRMesh, {
      geometry: 'geometry-' + this.name,
      material: 'material-' + this.name,
      position: '0 0 0',
      name: this.name,
      'cast-shadow': true,
    })
    console.log(this.manElem, 'manele---------')
    this.geometryRoot.addChild(this.manElem)
    // 延时保证挂载与初始化完毕
    this.xrTimeOut = setTimeout(() => {
      vb0.set(vb0Clear)
      ib0.set(ib0Clear)
      this.manTRS = this.manElem.getComponent(xrFrameSystem.Transform)
      this.meshMan = this.manElem.getComponent(xrFrameSystem.Mesh)
      this.geometryMan = this.meshMan.geometry
      this.matGeo = this.meshMan.material
      this.matGeo.setRenderState('cullOn', false)
      this.updateData(isFirstFrame, 'initXRMesh')
      this.decoderStart = true
      // x轴左移
      this.manTRS.position.setValue(0, 0, 0)
      this.manTRS.scale.setValue(2, 2, 2)
      this.manTRS.rotation.setValue(0, (45 * Math.PI / 180), 0)
      if (this.playStartEvent) this.playStartEvent()
      this.decoderStart_ = 1

      this.mountedComplete && this.mountedComplete()
    }, xrTimeOut_)
  }

  updateData(isFirstFrame, type) {
    this.showHidden(true, 'updateData', type)
    if (isFirstFrame == 'true' || this.reloadFirstFrame) {
      vb0.set(vb0Clear)
      if (this.vbo) {
        vb0.set(this.vbo)
      } else {
        this.updateVertexBuffer(this.pos, this.uv, this.indices, this.weights)
      }
      ib0.set(ib0Clear)
      ib0.set(this.index)
      this.geometryMan.uploadVertexBuffer(0, vb0)
      this.geometryMan.uploadIndexBuffer(0, ib0)
    }
    this.texture_2.update(this.pixelData, 0, 0, 4, 60)
    this.texture_.update(this.pixelBuffer, 0, 0, 1024, 1024)
  }

  load() {
    const info_fn = this.urlRoot + '/mesh.json'
    console.log(info_fn)
    this.requestTask0 = wx.request({
      url: info_fn,
      method: 'GET',
      success: (res) => {
        this.loadData(res.data)
      }
    })
  }

  async loadData(json) {
    this.boxs = json.boxs
    this.frames = json.frames
    this.firstFrames = json.firstFrames
    this.buffers = json.buffers
    this.bufferIndexMaxL = json.buffers.length
    this.framesLength = json.frames.length
    this.videoUrl = this.urlRoot + '/' + json.mp4Url

    this.cacheBuffers()

    if (this.preStart) {
      // 缓存视频，下一次解码时用本地路径的视频解码
      this.cacheVideo(this.videoUrl)
      await this.preStartDecoder()
    }
  }

  cacheVideo(url) {
    const storageKey = this.name + 'Video'
    const videoDownload = () => {
      wx.downloadFile({
        url,
        success: (res) => {
          if (res.statusCode === 200) {
            this.cacheVideoUrl = res.tempFilePath
            wx.setStorageSync(storageKey, res.tempFilePath)
          }
        }
      })
    }

    const localVideoPath = wx.getStorageSync(storageKey)
    if (localVideoPath) {
      try {
        this.getFS().accessSync(localVideoPath)
        this.cacheVideoUrl = localVideoPath
      } catch (e) {
        console.error(e)
        videoDownload()
      }
    } else {
      videoDownload()
    }
  }

  cacheBuffers() {
    const storageKey = this.name + 'Buffers'
    const localBuffersPathArr = wx.getStorageSync(storageKey)
    if (localBuffersPathArr) {
      try {
        this.buffers = localBuffersPathArr
        for (let i = 0; i < this.bufferIndexMaxL; i++) {
          const keybin = wx.getStorageSync(this.name + localBuffersPathArr[i].url)
          console.log(localBuffersPathArr[i], 'keybin')
          if (!keybin) {
            throw 'no data'
          }
          this.arrayBuffers[i] = this.getFS().readFileSync(keybin)
        }
        this.executePlay()
      } catch (e) {
        console.error(e)
        this.loadNextBuffer()
      }
    } else {
      this.loadNextBuffer()
    }
  }

  getFS() {
    if (!fs) {
      fs = wx.getFileSystemManager()
    }
    return fs
  }

  getUserDataFileList() {
    return this.getFS().statSync(`${wx.env.USER_DATA_PATH}`, true)
  }

  clearUserDataFileList(list) {
    for (let i = 0, len = list.length; i < len; i++) {
      const element = list[i]
      if (element.path.toLowerCase().indexOf('.bin') > -1 || element.path.toLowerCase().indexOf('.mp4') > -1) {
        this.getFS().unlinkSync(`${wx.env.USER_DATA_PATH}/${element.path}`)
      }
    }
  }

  checkBufferData() {
    const frameIndex = this.frameIndex + this.nextRenderFrameCount
    if (frameIndex >= this.framesLength) return true
    const binFileIdx = this.frames[frameIndex].binFileIdx
    const arrayBufferIndex = this.buffers[binFileIdx].arrayBufferIndex
    if (arrayBufferIndex == undefined) return false
    if (arrayBufferIndex < this.arrayBuffers.length) {
      return true
    }
    return false
  }

  loadNextBuffer() {
    if (this.pendingBufferDownload || this.nextBufferLoadIndex >= this.bufferIndexMaxL) {
      return
    }

    const cbFn = (res, urlkey) => {
      if (this.arrayBuffers == null) this.arrayBuffers = []
      if (res) {
        const arrayBuffer = res.data
        this.arrayBuffers[bufferIndex] = arrayBuffer
        try {
          const filePath = `${wx.env.USER_DATA_PATH}/${urlkey}`
          fs.writeFileSync(
            filePath,
            arrayBuffer,
          )
          console.log(filePath, 'filepth')
          wx.setStorageSync(urlkey, filePath)
        } catch (error) {
          // 当空间不足时，清空用户本地文件夹
          this.clearUserDataFileList(this.getUserDataFileList())
          console.log(error, 'error')
        }
      }
      this.nextBufferLoadIndex += 1
      this.pendingBufferDownload = false
      buffer.arrayBufferIndex = bufferIndex
      if (this.nextBufferLoadIndex < this.bufferIndexMaxL) {
        this.loadNextBuffer()
        // 判断的加载到一半数据时允许播放，如果想加载完成才播放写在else里面
        if (this.nextBufferLoadIndex == Math.max(Math.floor(this.bufferIndexMaxL / 2), 1)) {
          this.executePlay()
        }
      } else {
        // 加载完成就释放
        this.releaseNetwork()
        wx.setStorageSync(this.name + 'Buffers', this.buffers)
        console.log(this.buffers, 'this.buffers')
      }
    }
    const bufferIndex = this.nextBufferLoadIndex
    const buffer = this.buffers[bufferIndex]
    const bufferURL = this.urlRoot + '/' + buffer.url
    this.pendingBufferDownload = true
    this.requestTask1 = wx.request({
      url: bufferURL,
      method: 'GET',
      responseType: 'arraybuffer',
      success: (res) => {
        cbFn(res, this.name + buffer.url)
        // console.log('加载：', bufferURL)
      }
    })
  }

  executePlay() {
    console.log('可播放')
    this.frameIndex = 0
    this.autoPlay && this.play()
    this.initComplete && this.initComplete()
  }

  seekNearestFirstFrame(idx, arrays) {
    const length = arrays.length
    for (let i = 0; i < length - 1; ++i) {
      if (arrays[i] <= idx && arrays[i + 1] > idx) {
        return arrays[i]
      }
    }
    if (idx >= arrays[length - 1]) {
      return arrays[length - 1]
    }
  }

  update() {
    if (this.decoderStart) {
      this.updateVideo()
    }
  }

  async updateVideo() {
    if (this.ended_) return
    if (!this.frames) return false
    if (!this.checkBufferData()) {
      if (!this.decoder) return
      if (!this.paused) {
        console.log('下一个 mesh 没有准备好')
        this.paused = true
        await this.decoder.wait(true) // 暂停视频播放
      }
    } else if (this.paused) {
      console.log('下一个 mesh 准备好了')
      await this.decoder.wait(false)
      this.paused = false
    }
    if (this.decoder) {
      let frameData_0 = this.decoder.getFrameData()
      if (frameData_0) {
        const {
          data
        } = frameData_0
        this.updateRender(data)
      }
      frameData_0 = null
    }
  }

  decoderEndEvent() {
    const bindEndFn = async () => {
      this.ended_ = true
      this.decoderStart = false
      this.playing = false

      if (this.decoder) {
        await this.decoder.stop()
        this.preStartDecoderEnd = true
      }

      console.log('进来再次播放')

      // 延迟20ms之后再开始预先解码
      setTimeout(async () => {
        console.log('再次播放')
        await this.preStartDecoder()
        this.loop && this.play()
      }, 20)
    }
    if (this.decoder) {
      console.log('执行注册')
      this.decoder.off('ended', bindEndFn)
      this.decoder.on('ended', bindEndFn)
    }
  }

  async preStartDecoder(pos = 0) {
    if (!this.decoder) {
      this.decoder = wx.createVideoDecoder({
        type: 'wemedia'
      })
      // 新建解码器的时候就注册ended事件
      this.decoderEndEvent()
    }

    const start_0 = Date.now()
    try {
      await this.decoder.start({
        mode: 0,
        source: this.cacheVideoUrl || this.videoUrl
      })
      console.log('this.cacheVideoUrl', this.cacheVideoUrl)
    } catch (error) {
      console.error('async preStartDecoder(pos = 0)我是解码器报错this.decoder.start,重新执行start', error)
      wx.showToast({
        title: '网络错误,视频加载失败',
      })
      return
    }

    const timeDiff_0 = Date.now() - start_0
    console.log('this.decoder.start的时长', timeDiff_0)
    await this.decoder.wait(false)
    this.decoder.seek(pos)
    await this.decoder.wait(true)
    this.preStartDecoderEnd = true
  }

  async play() {
    // 无缓存时播放
    let frameData_0; let
      data
    const start_1 = Date.now()
    console.log(this.decoder, 'this.decoder')
    console.log(this.preStartDecoderEnd, 'this.preStartDecoderEnd')
    if (this.preStartDecoderEnd) {
      await this.decoder.wait(false)
      console.log('wait over')
    }
    await new Promise(resolve => {
      this.frameDataflag = setInterval(() => {
        if (this.decoder) frameData_0 = this.decoder.getFrameData()
        if (frameData_0) {
          data = frameData_0.data
          clearInterval(this.frameDataflag)
          this.frameDataflag = null
          resolve()
        }
      }, getFrame_)
    })
    const timeDiff_1 = Date.now() - start_1
    console.log('setInterval解码后直到显示时的时长', timeDiff_1)
    this.playing = true
    this.startTime_ = Date.now()
    this.updateRender(data)
    frameData_0 = null
    data = null
  }

  async pause() {
    if (this.decoder) {
      this.pauseExecute = true
      this.playing = false
      this.decoderStart = false
      await this.decoder.wait(true)
    }
  }

  async resume(start = true) {
    if (this.decoder && this.pauseExecute) {
      this.playing = true
      this.pauseExecute = false
      // this.decoder.seek(0);
      await this.decoder.wait(false)
      if (start) {
        this.decoderStart = true
      }
    }
  }

  stop(type) {
    if (this.decoder) {
      this.decoder.stop()
    }
  }

  showHidden(visible, type, type2) {
    if (visible == this.visible) return
    if (this.manTRS) {
      if (this.manTRS.el) {
        this.visible = visible
        this.manTRS.setData({
          visible
        })
      } else {
        console.error('showHidden报错', type, type2, this.manTRS, visible, this.visible)
      }
    }
  }

  releaseAsset() {
    this.scene.assets.releaseAsset('geometry', 'geometry-' + this.name)
    this.scene.assets.releaseAsset('effect', 'frame-effect' + this.name)
    this.scene.assets.releaseAsset('texture', 'texture1-' + this.name)
    this.scene.assets.releaseAsset('texture', 'texture2-' + this.name)
    this.scene.assets.releaseAsset('material', 'material-' + this.name)
  }

  releaseDecoder() {
    if (this.decoder) {
      this.decoder.on('ended', () => {})
      this.decoder.stop()
      this.decoder.remove()
      this.decoder = null
    }
  }

  releaseNetwork() {
    if (this.requestTask1) this.requestTask1.abort()
    this.requestTask1 = null
  }

  releaseBuffer() {
    this.arrayBuffers = null
    this.buffers = null
    this.frames = null
    this.firstFrames = null
    this.boxs = null

    this.index = null
    this.pixelData = null
    this.pixelDataClear = null
  }

  releaseEvent() {
    if (this.frameDataflag) {
      clearInterval(this.frameDataflag)
      this.frameDataflag = null
    }
    if (this.xrTimeOut) {
      clearTimeout(this.xrTimeOut)
      this.xrTimeOut = null
    }
    this.playStartEvent = null
  }

  release(type = true) {
    this.releaseDecoder()
    this.releaseNetwork()
    if (type == 'all' || !type) {
      this.texture_ = null
      this.texture_2 = null
      this.matGeo = null
      this.geometryMan = null
      this.meshMan = null
      this.manTRS = null
      this.manElem = null
    }
    if (type) {
      this.showHidden(false, 'replease')
      this.nextBufferLoadIndex = 1
      if (this.arrayBuffers && this.arrayBuffers.length) this.arrayBuffers.length = type ? 1 : 0
      if (type == 'all') {
        this.releaseBuffer()
        if (this.manElem) this.geometryRoot.removeChild(this.manElem)
        this.geometryRoot = null
      }
    } else {
      this.releaseBuffer()
    }
    this.releaseEvent()
    this.startTime = null
    this.pendingBufferDownload = false
  }

  close() {
    if (this.decoder) {
      this.decoder.stop()
      this.decoder.remove()
    }
  }

  updateVertexBuffer(positionData, uvDataArray, indices, weights) {
    const vertexCount = positionData.length / 3
    let vbIndex = 0
    for (let i = 0; i < vertexCount; i++) {
      const vertexIndex = i * 3
      const uvIndex = i * 2
      const weightIndex = i * 4
      // 0 xyz
      vb0[vbIndex] = positionData[vertexIndex]
      vb0[vbIndex + 1] = positionData[vertexIndex + 1]
      vb0[vbIndex + 2] = positionData[vertexIndex + 2]
      // 2 uv
      vb0[vbIndex + 3] = uvDataArray[uvIndex]
      vb0[vbIndex + 4] = uvDataArray[uvIndex + 1]
      // 4 indices
      vb0[vbIndex + 5] = indices[weightIndex]
      vb0[vbIndex + 6] = indices[weightIndex + 1]
      vb0[vbIndex + 7] = indices[weightIndex + 2]
      vb0[vbIndex + 8] = indices[weightIndex + 3]
      // 8 weights
      vb0[vbIndex + 9] = weights[weightIndex]
      vb0[vbIndex + 10] = weights[weightIndex + 1]
      vb0[vbIndex + 11] = weights[weightIndex + 2]
      vb0[vbIndex + 12] = weights[weightIndex + 3]
      // total 13
      vbIndex += 13
    }

    return vb0
  }
}

export {
  mesh4DPlayer
}
