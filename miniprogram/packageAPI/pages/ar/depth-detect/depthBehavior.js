const depthBehavior = Behavior({
  methods: {
    initDepthShader() {
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
    initDepthVAO() {
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
    initDepthGL() {
      this.initDepthShader()
      this.initDepthVAO()
    },
    renderDepthGL(frame) {
      const gl = this.renderer.getContext()
      gl.disable(gl.DEPTH_TEST)
      // const depthTexture = frame.getDepthTexture(gl)
      const displayTransform = frame.getDisplayTransform()
      // if (depthTexture) {
      //     const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM)
      //     const currentActiveTexture = gl.getParameter(gl.ACTIVE_TEXTURE)
      //     const currentVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING)

      //     gl.useProgram(this._depthProgram)
      //     this.ext.bindVertexArrayOES(this._depthVao)

      //     gl.uniformMatrix3fv(this._dt, false, displayTransform)

      //     const ext = gl.getExtension("OES_texture_float");
      //     if (!ext) console.warn('OES_texture_float not support');

      //     gl.activeTexture(gl.TEXTURE0 + 5)
      //     const bindingTexture5 = gl.getParameter(gl.TEXTURE_BINDING_2D)
      //     gl.bindTexture(gl.TEXTURE_2D, depthTexture)

      //     gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      //     gl.activeTexture(gl.TEXTURE0 + 5)
      //     gl.bindTexture(gl.TEXTURE_2D, bindingTexture5)

      //     gl.useProgram(currentProgram)
      //     gl.activeTexture(currentActiveTexture)
      //     this.ext.bindVertexArrayOES(currentVAO)
      // }

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

      const ext = gl.getExtension('OES_texture_float')
      if (ext) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, depthBuffer)
      } else {
        const data = new Uint8Array(width * height * 4)
        for (let i = 0; i < depthBuffer.length; i++) {
          const num = parseInt(depthBuffer[i] * 255)
          data[i] = num
        }
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data)
      }

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
  },
})

export default depthBehavior
