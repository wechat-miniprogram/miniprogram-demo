import getBehavior from './behavior'
import yuvBehavior from './yuvBehavior'

const NEAR = 0.001
const FAR = 1000

//初始化着色器函数
let initShadersDone = false

function initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE) {
  //创建顶点着色器对象
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, VSHADER_SOURCE)
  //创建片元着色器对象
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, FSHADER_SOURCE)

  if (!vertexShader || !fragmentShader) {
    return null
  }

  //创建程序对象program
  var program = gl.createProgram()
  if (!gl.createProgram()) {
    return null
  }
  //分配顶点着色器和片元着色器到program
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  //链接program
  gl.linkProgram(program)

  //检查程序对象是否连接成功
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!linked) {
    var error = gl.getProgramInfoLog(program)
    console.log('程序对象连接失败: ' + error)
    gl.deleteProgram(program)
    gl.deleteShader(fragmentShader)
    gl.deleteShader(vertexShader)
    return null
  }
  //返回程序program对象
  initShadersDone = true
  return program
}

function loadShader(gl, type, source) {
  // 创建顶点着色器对象
  var shader = gl.createShader(type)
  if (shader == null) {
    console.log('创建着色器失败')
    return null
  }

  // 引入着色器源代码
  gl.shaderSource(shader, source)

  // 编译着色器
  gl.compileShader(shader)

  // 检查顶是否编译成功
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader)
    console.log('编译着色器失败: ' + error)
    gl.deleteShader(shader)
    return null
  }

  return shader
}

var EDGE_VSHADER_SOURCE =
  `
  attribute vec4 aPosition; 
  void main(void) {
    gl_Position =  aPosition;
  }
`

var EDGE_FSHADER_SOURCE =
  `
  precision highp float;
  void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`

function initEdgeBuffer(gl, lt, lr, rb, lb) {
  let shaderProgram = gl.program;
  var vertices = [
    lt.x, lt.y, 0.0,
    lr.x, lr.y, 0.0,
    rb.x, rb.y, 0.0,
    lb.x, lb.y, 0.0,
  ];

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  var aPosition = gl.getAttribLocation(shaderProgram, 'aPosition');
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
  var length = vertices.length / 3;
  return length;
}

function onDrawEdge(gl, lt, lr, rb, lb) {
  var n = initEdgeBuffer(gl, lt, lr, rb, lb);
  gl.drawArrays(gl.LINE_LOOP, 0, n);
}

function convert(obj) {
  obj.x = obj.x * 2 - 1;
  obj.y = (1 - obj.y) * 2 - 1;
  return obj;
}

Component({
  behaviors: [getBehavior(), yuvBehavior],
  data: {
    theme: 'light',
  },
  lifetimes: {
    /**
     * 生命周期函数--监听页面加载
     */
    detached() {
      initShadersDone = false
      console.log("页面detached")
      if (wx.offThemeChange) {
        wx.offThemeChange()
      }
      this.setData({
        pause: true
      })
      console.log("页面渲染暂停")
    },
    attached: function () {
      this.setData({
        pause: false
      })
      console.log("页面渲染继续")
    },
    ready() {
      console.log("页面准备完全")
      this.setData({
        theme: wx.getSystemInfoSync().theme || 'light'
      })

      if (wx.onThemeChange) {
        wx.onThemeChange(({
          theme
        }) => {
          this.setData({
            theme
          })
        })
      }
    },
  },
  methods: {
    init() {
      this.initGL()

      // //逐帧渲染 debug
      // const onFrame1 = timestamp => {
      //     this.renderer.autoClearColor = false
      //     this.renderer.render(this.scene, this.camera)
      //     this.renderer.state.setCullFace(this.THREE.CullFaceNone)
      //   this.canvas.requestAnimationFrame(onFrame1)
      // }
      // this.canvas.requestAnimationFrame(onFrame1)

    },


    render(frame) {
      this.renderGL(frame)

      const camera = frame.camera

      // 相机
      if (camera) {
        this.camera.matrixAutoUpdate = false
        this.camera.matrixWorldInverse.fromArray(camera.viewMatrix)
        this.camera.matrixWorld.getInverse(this.camera.matrixWorldInverse)

        const projectionMatrix = camera.getProjectionMatrix(NEAR, FAR)
        this.camera.projectionMatrix.fromArray(projectionMatrix)
        this.camera.projectionMatrixInverse.getInverse(this.camera.projectionMatrix)
      }

      this.renderer.autoClearColor = false
      this.renderer.render(this.scene, this.camera)
      this.renderer.state.setCullFace(this.THREE.CullFaceNone)
    },

    renderText() {
      var gl = this.gl
      const textContentList = this.textContentList

      if (!textContentList || textContentList.length <= 0) {
        return
      } else {
        if (!initShadersDone) {
          this.edgeProgram = initShaders(gl, EDGE_VSHADER_SOURCE, EDGE_FSHADER_SOURCE)
          if (!this.edgeProgram) {
            console.log('初始化着色器失败')
            return
          }
          console.log('初始化着色器成功')
        }

        if (textContentList[0].box == undefined) {
          return;
        }

        gl.useProgram(this.edgeProgram)
        gl.program = this.edgeProgram

        var lt, lr, rb, lb;

        for (var i = 0; i < textContentList.length; i++) {
          lt = textContentList[i].box[0]
          lr = textContentList[i].box[1]
          rb = textContentList[i].box[2]
          lb = textContentList[i].box[3]
          let avgX = (lt.x + lr.x + rb.x + lb.x) / 4;
          let avgY = (lt.y + lr.y + rb.y + lb.y) / 4;
          textContentList[i].centerX = avgX * this.data.width;
          textContentList[i].centerY = avgY * this.data.height;

          lt = convert(lt)
          lr = convert(lr)
          rb = convert(rb)
          lb = convert(lb)

          onDrawEdge(gl, lt, lr, rb, lb);
        }

        this.setData({
          textContentList,
          wholeText: textContentList[0].text
        })
      }
    }

  },
})