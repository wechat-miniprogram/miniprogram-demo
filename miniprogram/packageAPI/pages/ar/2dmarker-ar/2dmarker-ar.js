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

      // 更新动画
      this.updateAnimation()

      this.renderer.autoClearColor = false
      this.renderer.render(this.scene, this.camera)
      this.renderer.state.setCullFace(this.THREE.CullFaceNone)
    },
    addMarker() {
      if (this.markerId) return
      const fs = wx.getFileSystemManager()
      // 此处如果为jpeg,则后缀名也需要改成对应后缀
      // const filePath = `${wx.env.USER_DATA_PATH}/marker-ar.map`
      const filePath = `${wx.env.USER_DATA_PATH}/marker-ar.jpeg`
      // const download = callback => wx.downloadFile({
      //     // 此处设置为识别的3d对象的map地址
      //     // url: 'http://dldir1.qq.com/weixin/checkresupdate/coco_bad_autov2_41add464411f40279704b6cffe660a1c.map',
      //     // url: 'http://dldir1.qq.com/weixin/checkresupdate/marker1_7d97094792854249a860640e985a743c.jpeg',
      //     url: this.data.imgUrl,
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
        this.markerId = this.session.addMarker(filePath)
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
    removeMarker() {
      if (this.markerId) {
        this.session.removeMarker(this.markerId)
        this.markerId = null
      }
    },
    getAllMarker() {
      console.log(this.session.getAllMarker())
    },
  },
})