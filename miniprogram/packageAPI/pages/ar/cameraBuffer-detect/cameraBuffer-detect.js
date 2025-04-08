import getBehavior from './behavior'
import yuvBehavior from './yuvBehavior'
import cameraBufferBehavior from './cameraBufferBehavior'

const NEAR = 0.001
const FAR = 1000

// 初始化着色器函数
let initShadersDone = false

Component({
  behaviors: [getBehavior(), yuvBehavior, cameraBufferBehavior],
  data: {
    theme: 'light',
    cameraPosition: 0,
    buttonDisable: true,
  },
  lifetimes: {
    /**
     * 生命周期函数--监听页面加载
     */
    detached() {
      initShadersDone = false
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
      this.initCameraBufferGL()

      initShadersDone = true
    },
    render(frame) {
      if (!initShadersDone) return
      const gl = this.gl

      this.renderGL(frame)
      this.renderCameraBufferGL(frame)

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
  },
})
