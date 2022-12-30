import getBehavior from './behavior'
import yuvBehavior from './yuvBehavior'

const NEAR = 0.001
const FAR = 1000

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
        console.log("页面detached")
        if (wx.offThemeChange) {
          wx.offThemeChange()
        }
        },
        ready() {
        console.log("页面准备完全")
          this.setData({
            theme: wx.getSystemInfoSync().theme || 'light'
          })
  
          if (wx.onThemeChange) {
            wx.onThemeChange(({theme}) => {
              this.setData({theme})
            })
          }
        },
    },
    methods: {
        init() {
            this.initGL()
        },
        render(frame) {
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
            this.renderer.render(this.scene, this.camera)
            this.renderer.state.setCullFace(this.THREE.CullFaceNone)
        },
    },
})