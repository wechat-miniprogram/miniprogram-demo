import { YUVVertexShader } from './shaders/yuv_vertex.glsl'
import { YUVFragmentShader } from './shaders/yuv_fragment.glsl'

export class YUVRenderWebGL {
  constructor(gl) {
    // Create shader program
    const shaderProgram = createProgram(gl, YUVVertexShader, YUVFragmentShader)

    this.programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'a_pos'),
        vertexTexcoord: gl.getAttribLocation(shaderProgram, 'a_texCoord'),
      },
      uniformLocations: {
        displayTransform: gl.getUniformLocation(shaderProgram, 'u_displayTransform'),
        yTexture: gl.getUniformLocation(shaderProgram, 'u_y_texture'),
        uvTexture: gl.getUniformLocation(shaderProgram, 'u_uv_texture'),
      },
    }

    // init VAO
    this.initVAO(gl)
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

export default YUVRenderWebGL
