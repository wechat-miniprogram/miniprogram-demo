import getBehavior from './behavior'
import yuvBehavior from './yuvBehavior'
import depthBehavior from './depthBehavior'

const NEAR = 0.1
const FAR = 100
let cubeVao = null
const countNumber = 20
let count = 0
let time = 0

const CUBE_VSHADER_SOURCE =
  `
  #version 300 es 
  in vec3 aPosition; 
  uniform vec3 basePosition;
  uniform mat4 viewMatrix;
  uniform mat4 projMatrix;

  void main(void) {
    vec3 pos = vec3(aPosition.x * 0.05, aPosition.y * 0.05, aPosition.z * 0.05);
    gl_Position = projMatrix * viewMatrix * vec4(basePosition + pos, 1.0);
  }
`

const CUBE_FSHADER_SOURCE =
  `
  #version 300 es 
  precision highp float;
  out vec4 FragColor;

  void main() {
    FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`

function createCubeVAO(gl, program) {
  const ext = gl.getExtension('OES_vertex_array_object')
  const vao = ext.createVertexArrayOES()
  ext.bindVertexArrayOES(vao)

  const vertices = [
    -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0,
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0,
    1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, 1.0, -1.0,
    1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
    1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0,
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0,
    1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
    -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0
  ]
  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  const aPosition = gl.getAttribLocation(program, 'aPosition')
  gl.enableVertexAttribArray(aPosition)
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0)
  vao.posBuffer = vertexBuffer
  return vao
}

function onDrawCube(gl, program, hitPosition, vm, pm) {
  const ext = gl.getExtension('OES_vertex_array_object')
  const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM)
  const currentActiveTexture = gl.getParameter(gl.ACTIVE_TEXTURE)
  const currentVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING)
  const bindingTexture = gl.getParameter(gl.TEXTURE_BINDING_2D)

  if (!cubeVao) {
    cubeVao = createCubeVAO(gl, program)
  } else {
    ext.bindVertexArrayOES(cubeVao)
  }
  gl.useProgram(program)

  const basePos = gl.getUniformLocation(program, 'basePosition')
  gl.uniform3fv(basePos, [hitPosition.x, hitPosition.y, hitPosition.z])

  const viewLoc = gl.getUniformLocation(program, 'viewMatrix')
  gl.uniformMatrix4fv(viewLoc, false, vm)

  const projLoc = gl.getUniformLocation(program, 'projMatrix')
  gl.uniformMatrix4fv(projLoc, false, pm)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 36)

  gl.useProgram(currentProgram)
  ext.bindVertexArrayOES(currentVAO)
  gl.activeTexture(currentActiveTexture)
  gl.bindTexture(gl.TEXTURE_2D, bindingTexture)
}

Component({
  behaviors: [getBehavior(), yuvBehavior, depthBehavior],
  data: {
    theme: 'light',
  },
  lifetimes: {
    /**
     * 生命周期函数--监听页面加载
     */
    detached() {
      console.log('页面detached')
      if (wx.offThemeChange) {
        wx.offThemeChange()
      }
    },
    ready() {
      console.log('页面准备完全')
      this.setData({
        theme: getApp().globalData.theme || 'light'
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
      this.initDepthGL()
    },
    render(frame) {
      this.session.setDepthOccRange(NEAR, FAR)

      const start = Date.now()

      const gl = this.renderer.getContext()
      gl.clear()
      this.renderGL(frame)
      const camera = frame.camera
      // 修改光标位置
      const reticle = this.reticle
      if (reticle) {
        const hitTestRes = this.session.hitTest(0.5, 0.5)
        if (hitTestRes.length) {
          reticle.matrixAutoUpdate = false
          reticle.matrix.fromArray(hitTestRes[0].transform)
          reticle.matrix.decompose(reticle.position, reticle.quaternion, reticle.scale)
          reticle.visible = true
        } else {
          reticle.visible = false
        }
      }

      // 更新动画
      this.updateAnimation()

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
      this.renderer.autoClearDepth = false

      this.renderer.render(this.scene2, this.camera)
      this.renderDepthGL(frame)

      gl.depthFunc(gl.LESS)
      this.renderer.render(this.scene, this.camera)

      // if (!this.cubeProgram) {
      //   this.cubeProgram = this.compileShader(gl, CUBE_VSHADER_SOURCE, CUBE_FSHADER_SOURCE)
      // }

      // if (this.hitPosition) {
      //   onDrawCube(gl, this.cubeProgram, this.hitPosition, this.camera.matrixWorldInverse.elements, this.camera.projectionMatrix.elements)
      // }

      this.renderer.state.setCullFace(this.THREE.CullFaceNone)

      const end = Date.now()

      time += end - start
      count++
      if (count >= countNumber) {
        // console.log(`${count}次平均耗时统计为${time/count}ms`)
        count = 0
        time = 0
      }
    },
  },
})
