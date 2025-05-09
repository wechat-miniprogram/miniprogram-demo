const yuvBehavior = Behavior({
  methods: {
    compileShader(gl, vs, fs) {
      const vertShader = gl.createShader(gl.VERTEX_SHADER)
      gl.shaderSource(vertShader, vs)
      gl.compileShader(vertShader)

      const program = gl.createProgram()
      program.gl = gl
      gl.attachShader(program, vertShader)
      gl.deleteShader(vertShader)

      if (fs) {
        const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fragShader, fs)
        gl.compileShader(fragShader)
        gl.attachShader(program, fragShader)
        gl.deleteShader(fragShader)
      }

      gl.linkProgram(program)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program)
        console.log(info)
        throw new Error(`Could not compile WebGL program. \n\n${info}`)
      }

      gl.useProgram(program)

      return program
    },
    initShader() {
      const gl = this.gl = this.renderer.getContext()
      const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM)
      const vs = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        uniform mat3 displayTransform;
        varying vec2 v_texCoord;
        void main() {
          vec3 p = displayTransform * vec3(a_position, 0);
          v_texCoord = a_texCoord;
          gl_Position = vec4(p.x, p.y, p.z, 1);
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
      const program = this._program = this.compileShader(gl, vs, fs)

      const uniformYTexture = gl.getUniformLocation(program, 'y_texture')
      gl.uniform1i(uniformYTexture, 5)
      const uniformUVTexture = gl.getUniformLocation(program, 'uv_texture')
      gl.uniform1i(uniformUVTexture, 6)
      this._dt = gl.getUniformLocation(program, 'displayTransform')

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

      const depthOutputProgram = this._depthOutputProgram = this.compileShader(gl, dvs, dfs)
      const uniformDepthTexture = gl.getUniformLocation(depthOutputProgram, 'depth_texture')
      gl.uniform1i(uniformDepthTexture, 5)
      this._deptht = gl.getUniformLocation(depthOutputProgram, 'displayTransform')

      gl.useProgram(currentProgram)
    },
    buildPlane(
      vertices,
      indices,
      width,
      height,
      widthSegments,
      heightSegments
    ) {
      const width_half = width / 2
      const height_half = height / 2

      const gridX = Math.floor(widthSegments)
      const gridY = Math.floor(heightSegments)

      const gridX1 = gridX + 1
      const gridY1 = gridY + 1

      const segment_width = width / gridX
      const segment_height = height / gridY

      for (let iy = 0; iy < gridY1; iy++) {
        const y = iy * segment_height - height_half

        for (let ix = 0; ix < gridX1; ix++) {
          const x = ix * segment_width - width_half

          vertices.push(
            // a_position
            x,
            -y,
            0,
            // a_texCoord
            ix / gridX,
            1 - (iy / gridY)
          )
        }
      }
      for (let iy = 0; iy < gridY; iy++) {
        for (let ix = 0; ix < gridX; ix++) {
          const a = ix + gridX1 * iy
          const b = ix + gridX1 * (iy + 1)
          const c = (ix + 1) + gridX1 * (iy + 1)
          const d = (ix + 1) + gridX1 * iy
          indices.push(a, b, d)
          indices.push(b, c, d)
        }
      }
    },
    initVAO(program) {
      const gl = this.renderer.getContext()
      const ext = gl.getExtension('OES_vertex_array_object')
      if (!this.ext) this.ext = ext

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
    initDepthOutputVAO(program, width, height) {
      const gl = this.renderer.getContext()
      const ext = gl.getExtension('OES_vertex_array_object')

      if (!this.ext) {
        this.ext = ext
      }

      const currentVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING)
      const vao = ext.createVertexArrayOES()

      ext.bindVertexArrayOES(vao)

      const vertices = []
      const indices = []

      this.buildPlane(vertices, indices, 1, 1, width, height)

      const posAttr = gl.getAttribLocation(program, 'a_position')
      const pos = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, pos)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
      gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(posAttr)
      vao.posBuffer = pos

      const texcoordAttr = gl.getAttribLocation(program, 'a_texCoord')
      const texcoord = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoord)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices), gl.STATIC_DRAW)
      gl.vertexAttribPointer(texcoordAttr, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(texcoordAttr)
      vao.texcoordBuffer = texcoord

      ext.bindVertexArrayOES(currentVAO)
      return vao
    },
    initGL() {
      this.initShader()
      this._vao = this.initVAO(this._program)
    },
    drawDepth(frame) {
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

      // const ext = gl.getExtension("OES_texture_float");
      // if (ext) {
      //   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, depthBuffer);
      // } else {
      // }

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
      const bindingTexture = gl.getParameter(gl.TEXTURE_BINDING_2D)

      if (!this._vao2) {
        // this._vao2 = this.initDepthOutputVAO(this._depthOutputProgram, width, height)
        this._vao2 = this.initVAO(this._depthOutputProgram)
      }

      this.ext.bindVertexArrayOES(this._vao2)
      gl.useProgram(this._depthOutputProgram)

      gl.uniformMatrix3fv(this._depthDt, false, displayTransform)

      gl.activeTexture(gl.TEXTURE0 + 5)
      const bindingTexture5 = gl.getParameter(gl.TEXTURE_BINDING_2D)
      gl.bindTexture(gl.TEXTURE_2D, texture)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      gl.activeTexture(gl.TEXTURE0 + 5)
      gl.bindTexture(gl.TEXTURE_2D, bindingTexture5)

      gl.useProgram(currentProgram)
      gl.activeTexture(currentActiveTexture)
      gl.bindTexture(gl.TEXTURE_2D, bindingTexture)

      this.ext.bindVertexArrayOES(currentVAO)
    },
    renderGL(frame) {
      const gl = this.renderer.getContext()

      const {
        yTexture,
        uvTexture
      } = frame.getCameraTexture(gl, 'yuv')
      const displayTransform = frame.getDisplayTransform()
      if (yTexture && uvTexture) {
        const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM)
        const currentActiveTexture = gl.getParameter(gl.ACTIVE_TEXTURE)
        const currentVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING)
        const bindingTexture = gl.getParameter(gl.TEXTURE_BINDING_2D)

        gl.enable(gl.DEPTH_TEST)
        gl.depthMask(true)
        gl.depthFunc(gl.ALWAYS)

        this.drawDepth(frame)

        gl.depthMask(false)

        this.ext.bindVertexArrayOES(this._vao)
        gl.useProgram(this._program)
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
        gl.bindTexture(gl.TEXTURE_2D, bindingTexture)

        this.ext.bindVertexArrayOES(currentVAO)
      }
    },
  },
})

export default yuvBehavior
