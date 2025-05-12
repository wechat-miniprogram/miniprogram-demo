import { createScopedThreejs } from 'threejs-miniprogram'
import { registerGLTFLoader } from '../loaders/gltf-loader'

const threeBehavior = Behavior({
  methods: {
    // 针对 threejs 的初始化逻辑
    initTHREE() {
      const THREE = this.THREE = createScopedThreejs(this.canvas)
      registerGLTFLoader(THREE)

      // glTF loader
      this.loader = new this.THREE.GLTFLoader()

      // 相机
      this.camera = new THREE.PerspectiveCamera(50, 0.7, 0.1, 1000)

      // 场景
      const scene = this.scene = new THREE.Scene()
      const sceneCull = this.sceneCull = new THREE.Scene()

      // 光源
      const ambientLight = new THREE.AmbientLight(0x555555) // 氛围光
      scene.add(ambientLight)
      const dirLight = new THREE.DirectionalLight(0xffffff, 1) // 平行光
      dirLight.position.set(1, 1, 1)
      scene.add(dirLight)

      const ambientLightCull = new THREE.AmbientLight(0x555555) // 氛围光
      sceneCull.add(ambientLightCull)
      const dirLightCull = new THREE.DirectionalLight(0xffffff, 1) // 平行光
      dirLightCull.position.set(1, 1, 1)
      sceneCull.add(dirLightCull)

      // 渲染层
      const renderer = this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      })
      renderer.gammaOutput = true
      renderer.gammaFactor = 2.2
    },
    initYUVShader() {
      const gl = this.gl = this.renderer.getContext()
      const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM)
      const vs = `
                attribute vec2 a_position;
                attribute vec2 a_texCoord;
                uniform mat3 displayTransform;
                varying vec2 v_texCoord;
                void main() {
                vec3 p = displayTransform * vec3(a_position, 0);
                gl_Position = vec4(p, 1);
                v_texCoord = a_texCoord;
                }
            `
      const fs = `
                precision highp float;

                uniform sampler2D y_texture;
                uniform sampler2D uv_texture;
                varying vec2 v_texCoord;
                void main() {
                vec4 y_color = texture2D(y_texture, v_texCoord);
                vec4 uv_color = texture2D(uv_texture, v_texCoord);

                float Y, U, V;
                float R ,G, B;
                Y = y_color.r;
                U = uv_color.r - 0.5;
                V = uv_color.a - 0.5;
                
                R = Y + 1.402 * V;
                G = Y - 0.344 * U - 0.714 * V;
                B = Y + 1.772 * U;
                
                gl_FragColor = vec4(R, G, B, 1.0);
                }
            `
      const vertShader = gl.createShader(gl.VERTEX_SHADER)
      gl.shaderSource(vertShader, vs)
      gl.compileShader(vertShader)

      const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
      gl.shaderSource(fragShader, fs)
      gl.compileShader(fragShader)

      const program = this._program = gl.createProgram()
      this._program.gl = gl
      gl.attachShader(program, vertShader)
      gl.attachShader(program, fragShader)
      gl.deleteShader(vertShader)
      gl.deleteShader(fragShader)
      gl.linkProgram(program)
      gl.useProgram(program)

      const uniformYTexture = gl.getUniformLocation(program, 'y_texture')
      gl.uniform1i(uniformYTexture, 5)
      const uniformUVTexture = gl.getUniformLocation(program, 'uv_texture')
      gl.uniform1i(uniformUVTexture, 6)

      this._dt = gl.getUniformLocation(program, 'displayTransform')
      gl.useProgram(currentProgram)
    },
    initVAO(program) {
      const gl = this.renderer.getContext()
      const ext = gl.getExtension('OES_vertex_array_object')
      this.ext = ext

      const currentVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING)
      const vao = ext.createVertexArrayOES()

      ext.bindVertexArrayOES(vao)

      const posAttr = gl.getAttribLocation(program, 'a_position')
      const pos = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, pos)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), gl.STATIC_DRAW)
      gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(posAttr)
      vao.posBuffer = pos

      const texcoordAttr = gl.getAttribLocation(program, 'a_texCoord')
      const texcoord = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoord)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, 0, 1, 1, 0, 0, 0]), gl.STATIC_DRAW)
      gl.vertexAttribPointer(texcoordAttr, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(texcoordAttr)
      vao.texcoordBuffer = texcoord

      ext.bindVertexArrayOES(currentVAO)
      return vao
    },
    initYUV() {
      this.initYUVShader()
      this._vao = this.initVAO(this._program)
    },
    renderYUV(frame) {
      const gl = this.renderer.getContext()
      gl.disable(gl.DEPTH_TEST)
      const {
        yTexture,
        uvTexture
      } = frame.getCameraTexture(gl, 'yuv')
      const displayTransform = frame.getDisplayTransform()
      if (yTexture && uvTexture) {
        const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM)
        const currentActiveTexture = gl.getParameter(gl.ACTIVE_TEXTURE)
        const currentVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING)

        gl.useProgram(this._program)
        this.ext.bindVertexArrayOES(this._vao)

        gl.uniformMatrix3fv(this._dt, false, displayTransform)
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)

        gl.activeTexture(gl.TEXTURE0 + 5)
        const bindingTexture5 = gl.getParameter(gl.TEXTURE_BINDING_2D)
        gl.bindTexture(gl.TEXTURE_2D, yTexture)

        gl.activeTexture(gl.TEXTURE0 + 6)
        const bindingTexture6 = gl.getParameter(gl.TEXTURE_BINDING_2D)
        gl.bindTexture(gl.TEXTURE_2D, uvTexture)

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        gl.bindTexture(gl.TEXTURE_2D, bindingTexture6)
        gl.activeTexture(gl.TEXTURE0 + 5)
        gl.bindTexture(gl.TEXTURE_2D, bindingTexture5)

        gl.useProgram(currentProgram)
        gl.activeTexture(currentActiveTexture)
        this.ext.bindVertexArrayOES(currentVAO)
      }
    },
    initDepthShaderHint() {
      const gl = this.gl = this.renderer.getContext()
      const ext = gl.getExtension('OES_texture_float')
      if (!ext) console.warn('OES_texture_float not support')
      const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM)
      const vs = `
              precision highp float;
              attribute vec2 a_position;
              attribute vec2 a_texCoord;
              uniform mat3 displayTransform;
              varying vec2 v_texCoord;
              void main() {
                vec3 p = displayTransform * vec3(a_position, 0);
                gl_Position = vec4(p, 1);
                v_texCoord = a_texCoord;
              }
            `
      const fs = `
              precision highp float;
              uniform sampler2D depth_texture;
              varying vec2 v_texCoord;
              void main() {
                vec4 depth_color = texture2D(depth_texture, v_texCoord);
                gl_FragColor = vec4(depth_color.rgb, 1.0);
              }
            `

      const vertShader = gl.createShader(gl.VERTEX_SHADER)
      gl.shaderSource(vertShader, vs)
      gl.compileShader(vertShader)

      const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
      gl.shaderSource(fragShader, fs)
      gl.compileShader(fragShader)

      const program = this._depthProgram = gl.createProgram()
      this._depthProgram.gl = gl
      gl.attachShader(program, vertShader)
      gl.attachShader(program, fragShader)
      gl.deleteShader(vertShader)
      gl.deleteShader(fragShader)
      gl.linkProgram(program)
      gl.useProgram(program)

      const uniformTexture = gl.getUniformLocation(program, 'depth_texture')
      gl.uniform1i(uniformTexture, 5)

      this._depthDt = gl.getUniformLocation(program, 'displayTransform')
      gl.useProgram(currentProgram)
    },
    initDepthVAOHint() {
      const gl = this.renderer.getContext()
      const ext = gl.getExtension('OES_vertex_array_object')
      this.ext = ext

      const currentVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING)
      const vao = ext.createVertexArrayOES()

      ext.bindVertexArrayOES(vao)

      const posAttr = gl.getAttribLocation(this._depthProgram, 'a_position')
      const pos = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, pos)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.3, 0.3, 1, 0.3, 0.3, 1, 1, 1]), gl.STATIC_DRAW)
      gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(posAttr)
      vao.posBuffer = pos

      const texcoordAttr = gl.getAttribLocation(this._depthProgram, 'a_texCoord')
      const texcoord = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoord)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW)
      gl.vertexAttribPointer(texcoordAttr, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(texcoordAttr)
      vao.texcoordBuffer = texcoord

      ext.bindVertexArrayOES(currentVAO)
      this._depthVao = vao
    },
    initDepthShader() {
      const gl = this.gl = this.renderer.getContext()
      const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM)

      const dvs = `#version 300 es
                precision highp float;
                in vec2 a_position;
                in vec2 a_texCoord;
                uniform mat3 displayTransform;
                uniform sampler2D depth_texture;     
                out vec2 v_texCoord;
        
                void main() {
                vec3 p = displayTransform * vec3(a_position, 1);
                v_texCoord = a_texCoord;
                vec4 depth_color = texture(depth_texture, v_texCoord);
                gl_Position = vec4(p.x, p.y, p.z, 1);
                }
            `

      const dfs = `#version 300 es
                precision highp float;
                uniform sampler2D depth_texture;      
                out vec4 FragColor;
                in vec2 v_texCoord;
        
                void main() {
                vec4 depth_color = texture(depth_texture, v_texCoord);
                gl_FragDepth = depth_color.r;
            //   FragColor = vec4(depth_color.rgb, 1.0);
                }
            `
      const vertShader = gl.createShader(gl.VERTEX_SHADER)
      gl.shaderSource(vertShader, dvs)
      gl.compileShader(vertShader)

      const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
      gl.shaderSource(fragShader, dfs)
      gl.compileShader(fragShader)

      const program = this._depthOutputProgram = gl.createProgram()
      this._depthOutputProgram.gl = gl
      gl.attachShader(program, vertShader)
      gl.attachShader(program, fragShader)
      gl.deleteShader(vertShader)
      gl.deleteShader(fragShader)
      gl.linkProgram(program)
      gl.useProgram(program)

      const uniformDepthTexture = gl.getUniformLocation(this._depthOutputProgram, 'depth_texture')
      gl.uniform1i(uniformDepthTexture, 5)
      gl.getUniformLocation(this._depthOutputProgram, 'displayTransform')

      gl.useProgram(currentProgram)
    },
    initDepthGL() {
      // 初始化提示
      this.initDepthShaderHint()
      this.initDepthVAOHint()
      // 初始化深度纹理相关
      this.initDepthShader()
      this._vaoDepth = this.initVAO(this._depthOutputProgram)
    },
    renderDepthGLHint(frame) {
      const gl = this.renderer.getContext()
      const displayTransform = frame.getDisplayTransform()

      // DepthBuffer
      const depthBufferRes = frame.getDepthBuffer()
      const depthBuffer = new Float32Array(depthBufferRes.DepthAddress)

      // console.log('depthBuffer', depthBuffer[0], depthBuffer[16], depthBuffer[16 * 16], depthBuffer[56 * 56]);

      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

      const width = depthBufferRes.width
      const height = depthBufferRes.height

      // 先直接采用 uint8 写入深度纹理，使用浮点写入的方法会存在锯齿
      const data = new Uint8Array(width * height * 4)
      for (let i = 0; i < depthBuffer.length; i++) {
        const num = parseInt(depthBuffer[i] * 255)
        data[i] = num
      }
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data)

      const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM)
      const currentActiveTexture = gl.getParameter(gl.ACTIVE_TEXTURE)
      const currentVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING)

      gl.useProgram(this._depthProgram)
      this.ext.bindVertexArrayOES(this._depthVao)

      gl.uniformMatrix3fv(this._depthDt, false, displayTransform)

      gl.activeTexture(gl.TEXTURE0 + 5)
      const bindingTexture5 = gl.getParameter(gl.TEXTURE_BINDING_2D)
      gl.bindTexture(gl.TEXTURE_2D, texture)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      gl.activeTexture(gl.TEXTURE0 + 5)
      gl.bindTexture(gl.TEXTURE_2D, bindingTexture5)

      gl.useProgram(currentProgram)
      gl.activeTexture(currentActiveTexture)
      this.ext.bindVertexArrayOES(currentVAO)
    },
    renderDepthGL(frame) {
      const gl = this.renderer.getContext()
      const displayTransform = frame.getDisplayTransform()

      // DepthBuffer
      const depthBufferRes = frame.getDepthBuffer()
      const depthBuffer = new Float32Array(depthBufferRes.DepthAddress)

      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

      const width = depthBufferRes.width
      const height = depthBufferRes.height

      // 先直接采用 uint8 写入深度纹理，使用浮点写入的方法会存在锯齿
      const data = new Uint8Array(width * height * 4)
      for (let i = 0; i < depthBuffer.length; i++) {
        const num = parseInt(depthBuffer[i] * 255)
        data[i] = num
      }
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data)

      // console.log('gl depth texture end')

      // 绘制左下角提示
      const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM)
      const currentActiveTexture = gl.getParameter(gl.ACTIVE_TEXTURE)
      const currentVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING)
      const bindingTexture = gl.getParameter(gl.TEXTURE_BINDING_2D)

      gl.useProgram(this._depthProgram)
      this.ext.bindVertexArrayOES(this._depthVao)

      gl.uniformMatrix3fv(this._depthDt, false, displayTransform)

      gl.activeTexture(gl.TEXTURE0 + 5)
      const bindingTexture5 = gl.getParameter(gl.TEXTURE_BINDING_2D)
      gl.bindTexture(gl.TEXTURE_2D, texture)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      gl.activeTexture(gl.TEXTURE0 + 5)
      gl.bindTexture(gl.TEXTURE_2D, bindingTexture5)

      gl.useProgram(currentProgram)
      gl.activeTexture(currentActiveTexture)
      this.ext.bindVertexArrayOES(currentVAO)

      // console.log('gl hint end')

      // 写入深度遮挡纹理到深度值

      gl.enable(gl.DEPTH_TEST)
      gl.depthMask(true)
      gl.depthFunc(gl.ALWAYS)

      this.ext.bindVertexArrayOES(this._vaoDepth)
      gl.useProgram(this._depthOutputProgram)

      gl.uniformMatrix3fv(this._depthDt, false, displayTransform)

      gl.activeTexture(gl.TEXTURE0 + 5)
      const bindingTexture5Depth = gl.getParameter(gl.TEXTURE_BINDING_2D)

      gl.bindTexture(gl.TEXTURE_2D, texture)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      gl.activeTexture(gl.TEXTURE0 + 5)

      gl.bindTexture(gl.TEXTURE_2D, bindingTexture5Depth)

      gl.useProgram(currentProgram)
      gl.activeTexture(currentActiveTexture)
      gl.bindTexture(gl.TEXTURE_2D, bindingTexture)

      this.ext.bindVertexArrayOES(currentVAO)

      gl.depthMask(false)

      gl.depthFunc(gl.LESS)

      // console.log('gl depth draw end')
    },
  },
})

export default threeBehavior
