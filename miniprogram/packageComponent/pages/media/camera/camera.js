const vs = `
  attribute vec3 aPos;
  attribute vec2 aVertexTextureCoord;
  varying highp vec2 vTextureCoord;

  void main(void){
    gl_Position = vec4(aPos, 1);
    vTextureCoord = aVertexTextureCoord;
  }
`

const fs = `
  varying highp vec2 vTextureCoord;
  uniform sampler2D uSampler;

  void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
  }
`

const vertex = [
  -1, -1, 0.0,
  1, -1, 0.0,
  1, 1, 0.0,
  -1, 1, 0.0
]

const vertexIndice = [
  0, 1, 2,
  0, 2, 3
]

const texCoords = [
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0
]
function createShader(gl, src, type) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(`Error compiling shader: ${gl.getShaderInfoLog(shader)}`)
  }
  return shader
}

const buffers = {}

function createRenderer(canvas, width, height) {
  const gl = canvas.getContext('webgl')
  if (!gl) {
    console.error('Unable to get webgl context.')
    return null
  }

  const info = wx.getSystemInfoSync()
  gl.canvas.width = info.pixelRatio * width
  gl.canvas.height = info.pixelRatio * height
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

  const vertexShader = createShader(gl, vs, gl.VERTEX_SHADER)
  const fragmentShader = createShader(gl, fs, gl.FRAGMENT_SHADER)

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Unable to initialize the shader program.')
    return null
  }

  gl.useProgram(program)

  const texture = gl.createTexture()
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.bindTexture(gl.TEXTURE_2D, null)

  buffers.vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW)

  buffers.vertexIndiceBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.vertexIndiceBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndice), gl.STATIC_DRAW)

  const aVertexPosition = gl.getAttribLocation(program, 'aPos')
  gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aVertexPosition)

  buffers.trianglesTexCoordBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.trianglesTexCoordBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW)

  const vertexTexCoordAttribute = gl.getAttribLocation(program, 'aVertexTextureCoord')
  gl.enableVertexAttribArray(vertexTexCoordAttribute)
  gl.vertexAttribPointer(vertexTexCoordAttribute, 2, gl.FLOAT, false, 0, 0)

  const samplerUniform = gl.getUniformLocation(program, 'uSampler')
  gl.uniform1i(samplerUniform, 0)

  return (arrayBuffer, width, height) => {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, arrayBuffer
    )
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
  }
}


Page({
  onShareAppMessage() {
    return {
      title: 'camera',
      path: 'packageComponent/pages/media/camera/camera'
    }
  },

  data: {
    theme: 'light',
    src: '',
    videoSrc: '',
    position: 'back',
    mode: 'scanCode',
    result: {},
    frameWidth: 0,
    frameHeight: 0,
    width: 288,
    height: 358,
    showCanvas: false,
  },

  onReady() {
    this.ctx = wx.createCameraContext()
    // const selector = wx.createSelectorQuery();
    // selector.select('#webgl')
    // .node(this.init)
    // .exec()
  },
  init(res) {
    if (this.listener) {
      this.listener.stop()
    }
    const canvas = res.node
    const render = createRenderer(canvas, this.data.width, this.data.height)

    // if (!render || typeof render !== 'function') return

    this.listener = this.ctx.onCameraFrame((frame) => {
      render(new Uint8Array(frame.data), frame.width, frame.height)

      const {
        frameWidth,
        frameHeight,
      } = this.data

      if (frameWidth === frame.width && frameHeight === frame.height) return
      this.setData({
        frameWidth: frame.width,
        frameHeight: frame.height,

      })
    })
    this.listener.start()
  },
  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },
  startRecord() {
    this.ctx.startRecord({
      success: () => {
        console.log('startRecord')
      }
    })
  },
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        this.setData({
          src: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
      }
    })
  },
  togglePosition() {
    this.setData({
      position: this.data.position === 'front'
        ? 'back' : 'front'
    })
  },
  error(e) {
    console.log(e.detail)
  },

  handleShowCanvas() {
    this.setData({
      showCanvas: !this.data.showCanvas
    }, () => {
      if (this.data.showCanvas) {
        const selector = wx.createSelectorQuery()
        selector.select('#webgl')
          .node(this.init)
          .exec()
      }
    })
  },
  onLoad() {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({theme}) => {
        this.setData({theme})
      })
    }
  }
})
