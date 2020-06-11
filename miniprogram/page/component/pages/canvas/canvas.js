//WebGL
const vs = `
  precision mediump float;

  attribute vec2 vertPosition;
  attribute vec3 vertColor;
  varying vec3 fragColor;

  void main() {
    gl_Position = vec4(vertPosition, 0.0, 1.0);
    fragColor = vertColor;
  }
`

const fs = `
  precision mediump float;

  varying vec3 fragColor;
  void main() {
    gl_FragColor = vec4(fragColor, 1.0);
  }
`

const triangleVertices = [
  0.0, 0.5, 1.0, 1.0, 0.0,
  -0.5, -0.5, 0.7, 0.0, 1.0,
  0.5, -0.5, 0.1, 1.0, 0.6
];

Page({
  onShareAppMessage() {
    return {
      title: 'canvas',
      path: 'page/component/pages/canvas/canvas'
    }
  },

  onReady() {
    // canvas
    this.position = {
      x: 150,
      y: 150,
      vx: 2,
      vy: 2
    }

    this.drawBall()
    this.interval = setInterval(this.drawBall, 17)
    
    // canvas2D
    this.position2D = {
      x: 150,
      y: 150,
      vx: 2,
      vy: 2
    }
    this.x = -100;

    wx.createSelectorQuery()
      .select('#canvas2D')
      .fields({
        node: true,
        size: true,
      })
      .exec(this.init.bind(this))

    // WebGL
    wx.createSelectorQuery()
      .select('#canvasWebGL')
      .node()
      .exec((res) => {
        const canvas = res[0].node
        this.renderWebGL(canvas)
      })
  },

  init(res) {
    const width = res[0].width
    const height = res[0].height

    const canvas = res[0].node
    const ctx = canvas.getContext('2d')

    const dpr = wx.getSystemInfoSync().pixelRatio
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const renderLoop = () => {
      this.render(canvas, ctx)
      canvas.requestAnimationFrame(renderLoop)
    }
    canvas.requestAnimationFrame(renderLoop)

    const img = canvas.createImage()
    img.onload = () => {
      this._img = img
    }
    img.src = './car.png'
  },

  render(canvas, ctx) {
    ctx.clearRect(0, 0, 305, 305)
    this.drawBall2D(ctx)
    this.drawCar(ctx)
  },

  drawBall() {
    const p = this.position
    p.x += p.vx
    p.y += p.vy
    if (p.x >= 300) {
      p.vx = -2
    }
    if (p.x <= 7) {
      p.vx = 2
    }
    if (p.y >= 300) {
      p.vy = -2
    }
    if (p.y <= 7) {
      p.vy = 2
    }

    const context = wx.createCanvasContext('canvas')

    function ball(x, y) {
      context.beginPath(0)
      context.arc(x, y, 5, 0, Math.PI * 2)
      context.setFillStyle('#1aad19')
      context.setStrokeStyle('rgba(1,1,1,0)')
      context.fill()
      context.stroke()
    }

    ball(p.x, 150)
    ball(150, p.y)
    ball(300 - p.x, 150)
    ball(150, 300 - p.y)
    ball(p.x, p.y)
    ball(300 - p.x, 300 - p.y)
    ball(p.x, 300 - p.y)
    ball(300 - p.x, p.y)
    context.draw()
  },

  drawBall2D(ctx) {
    const p = this.position2D
    p.x += p.vx
    p.y += p.vy
    if (p.x >= 300) {
      p.vx = -2
    }
    if (p.x <= 7) {
      p.vx = 2
    }
    if (p.y >= 300) {
      p.vy = -2
    }
    if (p.y <= 7) {
      p.vy = 2
    }

    function ball(x, y) {
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#1aad19'
      ctx.strokeStyle = 'rgba(1,1,1,0)'
      ctx.fill()
      ctx.stroke()
    }

    ball(p.x, 150)
    ball(150, p.y)
    ball(300 - p.x, 150)
    ball(150, 300 - p.y)
    ball(p.x, p.y)
    ball(300 - p.x, 300 - p.y)
    ball(p.x, 300 - p.y)
    ball(300 - p.x, p.y)
  },

  drawCar(ctx) {
    if (!this._img) return
    if (this.x > 350) {
      this.x = -100
    }
    ctx.drawImage(this._img, this.x++, 150 - 25, 100, 50)
    ctx.restore()
  },

  renderWebGL(canvas) {
  
    const gl = canvas.getContext('webgl')
    if (!gl) {
      console.error('gl init failed', gl)
      return
    }
    gl.viewport(0, 0, 305, 305)
    const vertShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertShader, vs)
    gl.compileShader(vertShader)

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragShader, fs)
    gl.compileShader(fragShader)

    const prog = gl.createProgram()
    gl.attachShader(prog, vertShader)
    gl.attachShader(prog, fragShader)
    gl.deleteShader(vertShader)
    gl.deleteShader(fragShader)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const draw = () => {
      const triangleVertexBufferObject = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW)

      const positionAttribLocation = gl.getAttribLocation(prog, 'vertPosition')
      const colorAttribLocation = gl.getAttribLocation(prog, 'vertColor')
      gl.vertexAttribPointer(
        positionAttribLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
      )
      gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
      )

      gl.enableVertexAttribArray(positionAttribLocation)
      gl.enableVertexAttribArray(colorAttribLocation)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      canvas.requestAnimationFrame(draw)
    }

    canvas.requestAnimationFrame(draw)
  },

  onUnload() {
    clearInterval(this.interval)
  }
})
