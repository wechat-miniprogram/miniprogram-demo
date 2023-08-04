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
    onPullDownRefresh() {
      wx.showNavigationBarLoading()
      wx.showLoading({
          title: "加载中"
      });
      const child = this.selectComponent('#arModelComponent')
      console.log("获取组件arModelComponent")
      console.log(child)
      child.getARModel()
    //  wx.hideLoading()
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh()
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
    myChooseMap(e){
      console.log("触发事件")
      console.log(e.detail)
      this.setData({
        imgUrl: e.detail.myChooseMapUrl,
        mapUrl: e.detail.myChooseMapUrl
      })
    },
    saveMap(){
        wx.openDocument({
          filePath: this.data.mapUrl,
          fileType: 'pdf',
          showMenu: true,
          success: function (res) {
            wx.showModal({
              content: '下载map至本地成功, 通过右上角点击转发获取pdf，更改后缀名为map即可获得',
              confirmText: '好的',
              cancelText: '我已知晓',
            })
            console.log('下载map至本地成功')
          }
        }) 
    },
    addMarker() {
      if (this.data.markerId) return
      const fs = wx.getFileSystemManager()
      // 此处如果为jpeg,则后缀名也需要改成对应后缀
      const filePath = `${wx.env.USER_DATA_PATH}/model.map`
      console.log("filePath is:", filePath)
      //const filePath = `${wx.env.USER_DATA_PATH}/marker-ar.jpeg`
      const download = callback => wx.downloadFile({
        // 此处设置为识别的3d对象的map地址
          // url: 'http://dldir1.qq.com/weixin/checkresupdate/coco_bad_autov2_41add464411f40279704b6cffe660a1c.map',
          url: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/output_bad.map',
          // url: 'http://dldir1.qq.com/weixin/checkresupdate/marker1_7d97094792854249a860640e985a743c.jpeg',
          success(res) {
            fs.saveFile({
              filePath,
              tempFilePath: res.tempFilePath,
              success: callback,
            })
          }
        })
      if(this.data.imgUrl == null){
        wx.showToast({
          title: "无任何已选模型， 默认将使用可乐",
          icon: 'none',
          duration: 2000
        })
        download()
      }


      const add = () => {
        console.log('[addMarker] --> ', filePath)
        var markerId = this.session.addMarker(filePath)
        this.setData({
          "filePathNow": filePath,
          "markerId": markerId
        })
        console.log("[markerId] -->", markerId)
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
          } 
          add()
        },
        fail: (res) => {
          console.error(res)
          download(add)
        }
      })
    },
    removeMarker() {
      this.session.removeMarker(this.data.markerId)
      this.setData({
        "markerId":null
      })
    },
    getAllMarker() {
      console.log(this.session.getAllMarker())
    },
  },
})