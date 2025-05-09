Component({
  behaviors: ['wx://component-export'],
  export() {
    return { getARModelList: this.getARModelList.bind(this) }
  },
  data: {
    chooseMapFile: null,
    envId: 'test-f0b102',
    modelName: 'arDemo',
    // 模型数据
    // @ modelStatus 模型状态
    // @ cosid
    // @ uploadTime 上传时间
    // @ errMsg 错误信息
    models: [],
  },
  modelRespMap: {},
  lifetimes: {
    ready() {
      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      } else {
        wx.cloud.init({
          traceUser: true,
        })
        console.log('初始化云函数成功')
      }

      // 缓存resp map
      this.modelRespMap = {}

      const keyNumber = (new Date()).getTime() * 10 + Math.floor(Math.random() * 10)
      this.setData({
        modelName: 'arDemo' + keyNumber
      })

      console.log('当前上传模型名称为 ' + 'arDemo' + keyNumber)

      // 获取已有数据
      this.getARModelList()
    }
  },

  methods: {
    // 上传视频逻辑
    uploadARModel() {
      const callback = this.generateARModel.bind(this)
      const cloudUpload = this.cloudUploadARModel.bind(this)
      const timeNow = Date.now() / 1000 | 0
      const modelInfos = wx.getStorageSync('modelsInfo')
      console.log('modelInfos的值为：')
      console.log(modelInfos)
      if (modelInfos && modelInfos.length != 0) {
        if (timeNow - modelInfos[0].timeStamp < 100) {
          wx.showToast({
            title: '每15分钟允许上传一次视频',
            icon: 'none',
            duration: 2000
          })
          return
        }
      }
      // 上传视频
      wx.chooseMedia({
        count: 1,
        mediaType: ['video'],
        sourceType: ['camera', 'album'],
        sizeType: ['original'], // 关闭压缩
        maxDuration: 60,
        camera: 'back',
        success: (res) => {
          console.log('录制成功，结果为')
          console.log(res)
          const tempFileInfo = res.tempFiles[0]
          // 保证视频时长在 10-30秒 之间
          if (tempFileInfo.duration >= 10 && tempFileInfo.duration <= 30) {
            const rate = tempFileInfo.width / tempFileInfo.height

            let min = tempFileInfo.width
            let max = tempFileInfo.height
            if (rate > 1) {
              min = tempFileInfo.height
              max = tempFileInfo.width
            }
            // 保证长边在 720 以上
            if (max > 720) {
              // 不接受比例在 3:1 以上的视频
              if (rate < 1 / 3 || rate > 3) {
                wx.showModal({
                  content: '长宽比尽量为16:9或4:3，不接受比例大于3:1的视频',
                  confirmText: '继续上传',
                  cancelText: '取消上传',
                  success: (button) => {
                    if (button.confirm) {
                      cloudUpload(res, callback)
                    } else if (button.cancel) {
                    }
                  }
                })
              } else {
                cloudUpload(res, callback)
              }
            } else {
              wx.showModal({
                content: '建议长边在720以上',
                confirmText: '继续上传',
                cancelText: '取消上传',
                success: (button) => {
                  if (button.confirm) {
                    cloudUpload(res, callback)
                  } else if (button.cancel) {
                  }
                }
              })
            }
          } else {
            wx.showToast({
              title: '请录制10~30秒内的视频',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    },
    // 生成具体模型
    generateARModel(url) {
      console.log('当前地址为：', url)
      wx.showLoading({
        title: '生成模型中……',
      })

      const reqData = {
        type: 'GenerateARModel',
        name: this.data.modelName,
        url,
        algoType: 2,
        getMesh: true,
        getTexture: true
      }

      console.log('调用参数为:', reqData)

      wx.cloud.callFunction({
        name: 'ARDemo',
        config: {
          env: this.data.envId
        },
        data: reqData
      }).then((resp) => {
        console.log('生成模型成功')
        console.log(resp)
        wx.showToast({
          title: '生成模型成功',
          icon: 'none',
          duration: 2000
        })

        wx.hideLoading()

        let modelInfos = wx.getStorageSync('modelsInfo')
        if (modelInfos == undefined || modelInfos.length == 0) {
          modelInfos = []
        }
        console.log('原有的缓存列表', modelInfos)

        const returnCosid = resp.result.respBody.cosid

        // 5分钟内上传相同文件，会返回相同的cosid，需要过滤掉
        let matched = false
        for (let j = modelInfos.length - 1; j >= 0; j--) {
          if (modelInfos[j].cosid === returnCosid) {
            matched = true
            break
          }
        }
        if (!matched) {
          console.log('缓存对cosid进行push')
          console.log('当前生成模型的cosid为：', returnCosid)

          console.log()
          modelInfos.push({
            cosid: resp.result.respBody.cosid,
            uploadTime: this.convertToTime(Date.parse(new Date()) / 1000),
            timeStamp: Date.now() / 1000 | 0,
            modelStatus: 0,
            restTime: 0,
            statusMsg: '准备中'
          })
        }

        modelInfos.sort(function (a, b) {
          if (a.uploadTime > b.uploadTime) {
            return -1
          } else if (a.uploadTime < b.uploadTime) {
            return 1
          }
          return 0
        })

        wx.setStorage({
          key: 'modelsInfo',
          data: modelInfos,
          success() {
            console.log('存储cosID集合为:', modelInfos)
          }
        })

        this.setData({
          models: modelInfos
        })
      }).catch((e) => {
        console.log(e)
        wx.showToast({
          title: e.errMsg,
          icon: 'none',
          duration: 2000
        })
        this.setData({
          showUploadTip: true
        })
        wx.hideLoading()
      })
    },
    // 获取现有模型列表
    getARModelList() {
      // 获取本地缓存
      const modelInfos = wx.getStorageSync('modelsInfo')
      if (modelInfos == undefined || modelInfos.length == 0) {
        // 无缓存，跳过
        return
      }

      const countModelInfo = modelInfos.length
      let countLoaded = 0

      const modelInfosNew = []

      // 统一的获取处理回调
      const handleLoadModelInfo = () => {
        if (countLoaded === countModelInfo) {
          // 加载完毕
          console.log('基于本地缓存请求列表结束', modelInfosNew)

          // 新列表，基于创建时间排序
          modelInfosNew.sort(function (a, b) {
            if (a.uploadTime > b.uploadTime) {
              return -1
            } else if (a.uploadTime < b.uploadTime) {
              return 1
            }
            return 0
          })

          // 写入缓存
          wx.setStorage({
            key: 'modelsInfo',
            data: modelInfosNew,
            success() {
              console.log('存储cosID集合为:', modelInfosNew)
              wx.hideLoading()
            }
          })

          // 更新显示列表
          this.setData({
            models: modelInfosNew,
          })
        }
      }

      // 基于缓存列表请求
      for (let i = 0; i < countModelInfo; i++) {
        const modelInfo = modelInfos[i]
        const cosid = modelInfo.cosid
        wx.cloud.callFunction({
          name: 'ARDemo',
          config: {
            env: this.data.envId
          },
          data: {
            type: 'GetARModel',
            cosid,
            modelType: 3,
            needData: 0,
            useIntranet: 0,
            expireTime: 1200
          }
        }).then(resp => {
          countLoaded++

          const modelStatus = resp.result.respBody.status

          console.log('获取的模型的cosID为', cosid)
          console.log(resp)
          console.log('status', modelStatus)

          // 根据返回信息，更新模型信息
          const modelInfoNew = {
            cosid,
            uploadTime: modelInfo.uploadTime,
            timeStamp: modelInfo.timeStamp,
            modelStatus, // 0 生成中 1 生成成功 2 过期 3 生成失败
            restTime: 0,
            statusMsg: '准备中',
          }
          // 回调写入缓存map，方便读取
          this.modelRespMap[cosid] = resp

          // 根据状态设置描述
          if (modelStatus === 1) {
            // 生成成功
            modelInfoNew.statusMsg = '已完成'
            // 运算过期时间
            const expireTime = resp.result.respBody.expireTime
            const nowTime = Date.now() / 1000 | 0
            const restTime = Math.floor((expireTime - nowTime) / 60 / 60 / 24)
            modelInfoNew.restTime = restTime
          } else if (modelStatus === 2) {
            // 资源过期
            modelInfoNew.statusMsg = '资源过期'
          } else if (modelStatus === 3) {
            // 生成失败
            const errMsg = resp.result.respBody.errMsg
            console.log('errMsg', errMsg)

            modelInfoNew.statusMsg = '生成失败'
            if (errMsg) {
              modelInfoNew.errMsg = errMsg
            }
          }

          modelInfosNew.push(modelInfoNew)

          handleLoadModelInfo()
        }).catch((e) => {
          countLoaded++

          console.log(e)
        })
      }
    },
    cloudUploadARModel(res, callback) {
      wx.showLoading({
        title: '文件上传中……',
      })

      const second = (new Date()).getSeconds()

      // 组成规则 第一位随机数（1 / 2）第二位是秒的个位
      const id = Math.ceil(Math.random() * 2) * 10 + second % 10

      wx.cloud.uploadFile({
        cloudPath: `3dmarker/arVideo${id}.mp4`,
        filePath: res.tempFiles[0].tempFilePath, // 文件路径
        config: {
          env: this.data.envId
        },
        timeout: 60000,
        success(res) {
          wx.hideLoading()
          const data = res.data
          console.log('上传文件success:', res)
          wx.showToast({
            title: '上传文件成功',
            icon: 'none',
            duration: 2000
          })
          wx.cloud.getTempFileURL({
            fileList: [res.fileID],
            success: res => {
              callback(res.fileList[0].tempFileURL)
              console.log('生成模型中……')
            },
            fail: err => {
              console.log('发生错误：', err)
              wx.showToast({
                title: err.errMsg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        },
        fail: err => {
          wx.hideLoading()
          console.log('上传文件error:', err)
          wx.showToast({
            title: err.errMsg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    // 工具函数 转换时间戳
    convertToTime(timestamp) {
      const now = new Date(timestamp * 1000)
      const y = now.getFullYear()
      const m = now.getMonth() + 1
      const d = now.getDate()
      const x = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' \n' + now.toTimeString().substr(0, 8)
      return x
    },
    // 选择模型
    chooseARModel(event) {
      // 被选中cosid
      const selectCosid = event.currentTarget.dataset.cosid
      // 已选中cosid
      const targetCosId = this.data.targetCosId

      // 不同的情况下，更新选中目标
      if (selectCosid !== targetCosId) {
        const modelResp = this.modelRespMap[selectCosid]

        const modelStatus = modelResp.result.respBody.status
        // 成功才允许点击
        if (modelStatus === 1) {
          this.setData({
            targetCosId: selectCosid
          })

          // 选择的时候，通知上层
          this.triggerEvent('selectEvent', {
            cosid: selectCosid,
            modelResp,
          })
        }
      }
    },
    // 删除模型本地缓存
    deleteARModel(event) {
      // 被选中cosid
      const selectCosid = event.currentTarget.dataset.cosid

      wx.showModal({
        content: `是否删除当前缓存模型（删除后不可恢复），模型id ${selectCosid}`,
        confirmText: '确定删除',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            console.log('确定删除')
            // 获取本地缓存
            const modelInfos = wx.getStorageSync('modelsInfo')
            if (modelInfos == undefined || modelInfos.length == 0) {
              // 无缓存，跳过
              return
            }

            // 新列表，过滤掉删除的cosid
            const modelInfosNew = modelInfos.filter(
              (modelInfo) => modelInfo.cosid !== selectCosid
            )

            // 写入缓存
            wx.setStorage({
              key: 'modelsInfo',
              data: modelInfosNew,
              success() {
                console.log('存储cosID集合为:', modelInfosNew)
                wx.hideLoading()
              }
            })

            // 更新显示列表
            this.setData({
              models: modelInfosNew,
            })
          } else if (res.cancel) {
            console.log('取消')
          }
        }
      })
    },
  }
})
