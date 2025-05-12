import { splatVertexShader } from './shaders/splat_vertex.glsl'
import { splatFragmentShader } from './shaders/splat_fragment.glsl'
import { splatRTVertexShader } from './shaders/splat_rt_vertex.glsl'
import { splatRTFragmentShader } from './shaders/splat_rt_fragment.glsl'

class SplatWebGL {
  constructor(gl) {
    // Create shader program
    const program = createProgram(gl, splatVertexShader, splatFragmentShader)

    this.vao = gl.createVertexArray()
    gl.bindVertexArray(this.vao)

    const setupAttributeBuffer = (name, components) => {
      const location = gl.getAttribLocation(program, name)
      const buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.enableVertexAttribArray(location)
      gl.vertexAttribPointer(location, components, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(location, 1)
      return buffer
    }

    // Create attribute buffers
    const buffers = {
      color: setupAttributeBuffer('a_col', 3),
      center: setupAttributeBuffer('a_center', 3),
      opacity: setupAttributeBuffer('a_opacity', 1),
      covA: setupAttributeBuffer('a_covA', 3),
      covB: setupAttributeBuffer('a_covB', 3),
    }

    this.program = program
    this.buffers = buffers
  }
}

export class SplatRenderTexture {
  constructor(gl) {
    // 准备 RenderTexutre
    this.initRenderTexture(gl)

    // Create shader program
    const shaderProgram = createProgram(gl, splatRTVertexShader, splatRTFragmentShader)

    this.programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'a_pos'),
        vertexTexcoord: gl.getAttribLocation(shaderProgram, 'a_texCoord'),
      },
      uniformLocations: {
        uSplat: gl.getAttribLocation(shaderProgram, 'u_splat'),
      },
    }

    // init VAO
    this.initVAO(gl)
  }

  initRenderTexture(gl) {
    const targetTextureWidth = gl.canvas.width
    const targetTextureHeight = gl.canvas.height
    const targetTexture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, targetTexture)

    this.renderTexture = targetTexture

    // 定义0级的大小和格式
    const level = 0
    const internalFormat = gl.RGBA
    const border = 0
    const format = gl.RGBA
    const type = gl.UNSIGNED_BYTE
    const data = null
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      targetTextureWidth,
      targetTextureHeight,
      border,
      format,
      type,
      data
    )

    // 设置过滤，这样我们就不需要 mips
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    // 创建并绑定帧缓冲区
    const fb = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb)

    // 将纹理附加为第一个颜色附件
    const attachmentPoint = gl.COLOR_ATTACHMENT0
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, level)

    this.frameBuffer = fb
    this.rt = targetTexture
  }

  initVAO(gl) {
    this.vao = gl.createVertexArray()
    gl.bindVertexArray(this.vao)

    // positionBuffer
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const positions = [
      -1.0, -1.0, 0.0,
      1.0, -1.0, 0.0,
      1.0, 1.0, 0.0,
      -1.0, 1.0, 0.0,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    // texCoordBuffer
    const texCoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
    // filpY
    const texCoord = [
      0, 0,
      1, 0,
      1, 1,
      0, 1
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoord), gl.STATIC_DRAW)

    // indexBuffer
    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    const indices = [
      0,
      1,
      2,
      0,
      2,
      3
    ]
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

    // Create attribute buffers
    const buffers = {
      position: positionBuffer,
      texCoord: texCoordBuffer,
      indices: indexBuffer
    }

    this.buffers = buffers
  }
}

// Create a program from a vertex and fragment shader
function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
  const program = gl.createProgram()

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) return program

  console.log(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

// Create and compile a shader from source
function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

  if (success) return shader

  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

export default SplatWebGL
