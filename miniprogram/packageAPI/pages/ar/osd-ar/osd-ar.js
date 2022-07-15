import getBehavior from './behavior'
import yuvBehavior from './yuvBehavior'

const NEAR = 0.001
const FAR = 1000

Component({
  behaviors: [getBehavior(), yuvBehavior],
  data: {
    theme: 'light',
    frameShow: false,
    frameX: 0,
    frameY: 0,
    frameWidth: 0,
    frameHeight: 0,
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
    afterVKSessionCreated() {
      this.session.on('addAnchors', anchors => {
        const anchor = anchors[0]
        const {
          width,
          height
        } = this.data
        if (anchor && this.markerId) {
          this.setData({
            frameShow: true,
            frameX: anchor.origin.x * width,
            frameY: anchor.origin.y * height,
            frameWidth: anchor.size.width * width,
            frameHeight: anchor.size.height * height,
          })
        }
      })
      this.session.on('updateAnchors', anchors => {
        const anchor = anchors[0]
        const {
          width,
          height
        } = this.data
        if (anchor) {
          this.setData({
            frameX: anchor.origin.x * width,
            frameY: anchor.origin.y * height,
            frameWidth: anchor.size.width * width,
            frameHeight: anchor.size.height * height,
          })
        }
      })
      this.session.on('removeAnchors', anchors => {
        this.setData({
          frameShow: false,
        })
      })
    },
    chooseMedia() {
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        success: res => {
          console.log('chooseMedia res', res)
          const imgUrl = res.tempFiles[0].tempFilePath
          wx.getImageInfo({
            src: imgUrl,
            success: res => {
              const {
                width,
                height
              } = res
              console.log('getImageInfo res', res)
              this.setData({
                imgUrl: imgUrl,
              })
            },
            fail: res => {
              console.error(res)
            }
          })

        },
        fail: res => {
          console.error(res)
        }
      })
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
    addOSDMarker() {
      if (this.markerId) return
      const fs = wx.getFileSystemManager()
      const filePath = `${wx.env.USER_DATA_PATH}/osd-ar.jpg`

      // const download = callback => wx.downloadFile({
      //     // 此处设置为osd识别对象的地址
      //     url: 'https://res.wx.qq.com/op_res/h7DtLCbw1wzG7mzwlyfmmTDYUjq6pwCAHN5Ep0xA9PDvSa_knfz1Vg5E6vSKxxWG2mnHVzl2qBC789tQwNl_pw',
      //     success(res) {
      //         fs.saveFile({
      //             filePath,
      //             tempFilePath: res.tempFilePath,
      //             success: callback,
      //         })
      //     }
      // })

      const download = callback => {
        fs.saveFile({
          filePath,
          tempFilePath: this.data.imgUrl,
          success: callback,
          fail: res => {
            console.error(res)
          }
        })
      }
      const add = () => {
        console.log('[addMarker] --> ', filePath)
        this.markerId = this.session.addOSDMarker(filePath)
        this.setData({
          "filePathNow": filePath
        })
      }

      const getFilePathNow = () => {
        return this.data.filePathNow;
      }
      fs.stat({
        path: filePath,
        success(res) {
          let path = getFilePathNow()
          if (path != filePath) {
            if (res.stats.isFile() && path) {
              fs.unlinkSync(path)
            }
            download(add)
          } else {
            add()
          }
        },
        fail: (res) => {
          console.error(res)
          download(add)
        }
      })
    },
    removeOSDMarker() {
      if (this.markerId) {
        this.session.removeOSDMarker(this.markerId)
        this.markerId = null
      }
    },
    getAllOSDMarker() {
      console.log(this.session.getAllOSDMarker())
    },
  },
})