import getBehavior from './behavior'
import yuvBehavior from './yuvBehavior'

const NEAR = 0.001
const FAR = 1000

Component({
  behaviors: [getBehavior(), yuvBehavior],
  markerIndex: 0,
  data: {
    theme: 'light',
    markerImgList: [],
    chooseImgList: [],
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
      this.markerIndex = 0;
      this.initGL()
    },

    chooseMedia() {
      wx.chooseMedia({
        count: 9,
        mediaType: ['image'],
        sizeType: ['original'],
        success: res => {
          console.log('chooseMedia res', res)

          const chooseImgListRes = [];
          for (let i = 0; i < res.tempFiles.length; i++) {
            const imgUrl = res.tempFiles[i].tempFilePath;
            chooseImgListRes.push(imgUrl);
          }

          console.log('set chooseImgList', chooseImgListRes)

          this.setData({
            chooseImgList: chooseImgListRes,
          })
        },
        fail: res => {
          console.error(res)
        }
      })
    },
    async addMarker() {
      console.log('addMarker')
      const fs = wx.getFileSystemManager()
      
      const markerImgListRes = this.data.markerImgList.concat([]);
      
      let handledCount = 0;
      const chooseImgCount = this.data.chooseImgList.length;
      const checkMarkerAdded = () => {
        if (handledCount === chooseImgCount) {
          console.log('markerImgList set', markerImgListRes);

          this.setData({
            chooseImgList: [],
            markerImgList: markerImgListRes
          });
        }

      }
      
      // 准备进行choose的图片保存到fs
      for (let i = 0; i < chooseImgCount; i++) {
        const chooseImgUrl = this.data.chooseImgList[i];
        const fileEnd = chooseImgUrl.split('.').slice(-1)[0];
        const fileIndex = this.markerIndex + i;
        // 算法侧目前只认 map png jpg jpeg 后缀文件
        const filePath = `${wx.env.USER_DATA_PATH}/marker-ar-${fileIndex}.${fileEnd}`;

        const saveAndAddMarker = () => {
          console.log('saveFileSync start', filePath, chooseImgUrl);
          // 存入文件系统，并添加到marker
          fs.saveFile({
            filePath,
            tempFilePath: chooseImgUrl,
            success: ()=> {
              console.log('[addMarker] --> ', filePath)
              const markerId = this.session.addMarker(filePath)
              markerImgListRes.push({
                markerId: markerId,
                filePath: filePath
              })
              handledCount++;
              checkMarkerAdded();
            },
            fail: res => {
              console.error(res)
              console.log('文件保存失败', filePath);
              handledCount++;
              checkMarkerAdded();
            }
          })
        }

        console.log('uploadFile Path', filePath);
        // 确定文件，存在即删除
        fs.stat({
          path: filePath,
          success: (res) => {
            if (res.stats.isFile()) {
              fs.unlinkSync(filePath);
              console.log('fs unlinkSync', filePath);
            }
            saveAndAddMarker();
          },
          fail: (res) => {
            console.error(res)
            console.log('fs中不存在，直接写入', filePath);

            saveAndAddMarker();
          }
        })


      }

    },
    removeMarker() {
      if (this.data.markerImgList) {
        for (let i = 0; i < this.data.markerImgList.length; i++) {
          const markerImg = this.data.markerImgList[i];
          this.session.removeMarker(markerImg.markerId);
        }
        this.markerIndex = 0;
        this.setData({
          markerImgList: [],
        })
      }
    },
    getAllMarker() {
      console.log(this.session.getAllMarker())
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
  },
})