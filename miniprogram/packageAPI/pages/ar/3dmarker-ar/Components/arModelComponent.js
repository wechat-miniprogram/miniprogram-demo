let protobufjs = require("protobufjs");
let json = require("./proto/arModelProto.js")
let root = protobufjs.Root.fromJSON(json)
let message = root.lookupType("ARModelData");

Component({
  behaviors: ['wx://component-export'],
  export(){
    return {getARModel:this.getARModel.bind(this)}
  },
  data: {
    chooseMapFile: null,
    envId: 'test-f0b102',
    modelName: 'arDemo',
  },
  lifetimes: {
    ready: function () {
      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力');
      } else {
        wx.cloud.init({
          traceUser: true,
        });
        console.log("初始化云函数成功")
      }

      this.getARModel()
    }
  },

  methods: {
    uploadARModel() {
      var callback = this.generateARModel.bind(this)
      var cloudUpload = this.cloudUploadARModel.bind(this)
      var timeNow = Date.now() / 1000 | 0;
      var value = wx.getStorageSync('modelsInfo');
      console.log("value的值为：")
      console.log(value)
      if(value && value.length != 0){
        if(timeNow - value[0].timeStamp < 7200){
          wx.showToast({
            title: "仅两小时允许上传一次视频",
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }
      console.log(value);
      wx.chooseMedia({
        count: 9,
        mediaType: ['video'],
        sourceType: ['camera', 'album'],
        sizeType: ['original'], // 关闭压缩
        maxDuration: 60,
        camera: 'back',
        success: (res) => {
          console.log("录制成功，结果为")
          console.log(res)
          const tempFileInfo = res.tempFiles[0]
          // 保证视频时长在 10-30秒 之间
          if (tempFileInfo.duration >= 10 && tempFileInfo.duration <= 30) {
            const rate = tempFileInfo.width / tempFileInfo.height;

            let min = tempFileInfo.width;
            let max = tempFileInfo.height;
            if (rate > 1) {
              min = tempFileInfo.height;
              max = tempFileInfo.width;
            }

            // 保证长边在 720 以上
            if (max > 720) {
              // 不接受比例在 3:1 以上的视频
              if(rate < 1 / 3 || rate > 3){
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
              }
            }else{
              wx.showModal({
                content: '保证长边在720以上',
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
          }else{
            wx.showToast({
              title: '请录制10~30秒内的视频',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    },
    cloudUploadARModel(res, callback){
      wx.showLoading({
        title: '文件上传中……',
      });
      wx.cloud.uploadFile({
        cloudPath: 'arVideo.mp4',
        filePath: res.tempFiles[0].tempFilePath, // 文件路径
        config: {
          env: this.data.envId
        },
        timeout: 60000,
        success(res) {
          wx.hideLoading()
          const data = res.data
          console.log("上传文件success:", res)
          wx.showToast({
            title: "上传文件成功",
            icon: 'none',
            duration: 2000
          })
          wx.cloud.getTempFileURL({
            fileList: [res.fileID],
            success: res => {
              callback(res.fileList[0].tempFileURL)
              console.log("生成模型中……")
            },
            fail: err => {
              console.log("发生错误：", err)
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
          console.log("上传文件error:", err)
          wx.showToast({
            title: err.errMsg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    generateARModel(url) {
      console.log("当前地址为：", url)
      wx.showLoading({
        title: '生成模型中……',
      });

      if (typeof url != "string") {
        url = defaultURL
        console.log("使用默认地址")
      }

      const reqData =  {
        type: 'GenerateARModel',
        name: this.data.modelName,
        url: url,
        algoType: 2,
        getMesh: true,
        getTexture: true
      }

      console.log("调用参数为:",reqData)

      wx.cloud.callFunction({
        name: 'ARDemo',
        config: {
          env: this.data.envId
        },
        data: reqData
      }).then((resp) => {
        console.log("生成模型成功")
        console.log(resp)
        wx.showToast({
          title: "生成模型成功",
          icon: 'none',
          duration: 2000
        })

        wx.hideLoading();

        var value = wx.getStorageSync('modelsInfo')
        if (value == undefined || value.length == 0 ) {
          value = []
        }

        var j = 0;
        while (j < value.length) {
          if (resp.result.respBody.cosid == value[j].cosid) {
            break;
          }
          j++;
        }
        if (j == value.length) {
          console.log("value对cosid进行push")
          console.log("当前生成模型的cosid为：", resp.result.respBody.cosid)
          value.push({
            cosid: resp.result.respBody.cosid,
            uploadTime: this.convertToTime(Date.parse(new Date()) / 1000),
            timeStamp: Date.now() / 1000 | 0,
            modelStatus: 0,
            statusMsg: "准备中"
          })
        }

        value.sort(function (a, b) {
          if(a.uploadTime > b.uploadTime){
              return -1;
          }else  if(a.uploadTime < b.uploadTime){
              return 1;
          }
          return 0;
      })

        wx.setStorage({
          key: "modelsInfo",
          data: value,
          success() {
            console.log("存储cosID集合为:", value)
          }
        })

        this.setData({
          models: value
        });

      }).catch((e) => {
        console.log(e)
        wx.showToast({
          title: e.errMsg,
          icon: 'none',
          duration: 2000
      })
        this.setData({
          showUploadTip: true
        });
        wx.hideLoading();
      });
    },

    convertToTime(timestamp) {
      var now = new Date(timestamp * 1000)
      var y = now.getFullYear()
      var m = now.getMonth() + 1
      var d = now.getDate()
      var x = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " \n" + now.toTimeString().substr(0, 8);
      return x
    },
    getARModel() {
      wx.cloud.callFunction({
        name: 'ARDemo',
        config: {
          env: this.data.envId
        },
        data: {
          type: 'GetARModelList',
          modelStatus: 0,
          algoType: 2
        }
      }).then((resp) => {
        console.log("获取模型成功")
        console.log(resp)
        var value = wx.getStorageSync('modelsInfo')
        if (value == undefined || value.length == 0 ) {
          value = []
        }

        var modelList = resp.result.respBody.modelList
        if (!modelList) {
          console.log("当前无模型获得")
        }else{
          var j;
          var modelOKString = "ARModel_Status_Marker_Finished"
          var modelFailString = "ARModel_Status_Fail"
          var modelReadyString = "ARModel_Status_Init"
          for (var i = 0; i < modelList.length; i++) {
              j = 0;
              while (j < value.length) {
                  if (modelList[i].cosid == value[j].cosid){
                    switch(modelList[i].modelStatus){
                      case modelOKString:
                          value[j].modelStatus = 1
                          value[j].uploadTime = this.convertToTime(modelList[i].uploadTime)
                          value[j].timeStamp = modelList[i].uploadTime
                          value[j].statusMsg = "已完成"
                        break;
                      case modelFailString:
                          value[j].modelStatus = 0
                          value[j].uploadTime = this.convertToTime(modelList[i].uploadTime)
                          value[j].timeStamp = modelList[i].uploadTime
                          value[j].statusMsg = "构建失败"
                        break;
                      case modelReadyString:
                          value[j].modelStatus = 0
                          value[j].uploadTime = this.convertToTime(modelList[i].uploadTime)
                          value[j].timeStamp = modelList[i].uploadTime
                          value[j].statusMsg = "准备中"
                        break;
                    }
                    break;
                  }
                  j++;
              }
              // if (j == value.length) {
              //     console.log("value对cosid进行push")
              //     if(modelList[i].modelStatus == modelOKString){
              //         value.push({
              //           cosid: modelList[i].cosid,
              //           uploadTime: this.convertToTime(modelList[i].uploadTime),
              //           timeStamp: modelList[i].uploadTime,
              //           modelStatus: 1,
              //           statusMsg: "已完成"
              //       })
              //     }else if(modelList[i].modelStatus == modelFailString){
              //         value.push({
              //           cosid: modelList[i].cosid,
              //           uploadTime: this.convertToTime(modelList[i].uploadTime),
              //           timeStamp: modelList[i].uploadTime,
              //           modelStatus: 0,
              //           statusMsg: "构建失败",
              //           errMsg: modelList[i].modelCos.modelList[0].errmsg
              //         })
              //     }else if(modelList[i].modelStatus == modelReadyString){
              //         value.push({
              //             cosid: modelList[i].cosid,
              //             uploadTime: this.convertToTime(modelList[i].uploadTime),
              //             timeStamp: modelList[i].uploadTime,
              //             modelStatus: 0,
              //             statusMsg: "准备中"
              //           })
              //     }    
              // }
          }
        }

        value.sort(function (a, b) {
            if(a.uploadTime > b.uploadTime){
                return -1;
            }else  if(a.uploadTime < b.uploadTime){
                return 1;
            }
            return 0;
        })

        this.setData({
          models: value,
        });

        wx.setStorage({
          key: "modelsInfo",
          data: value,
          success() {
            console.log("存储cosID集合为:", value)
            wx.hideLoading()
          }
        })
      }).catch((e) => {
        console.log(e)
        this.setData({
          showUploadTip: true
        });
      });
    },

    saveLocalFile(bufferContent) {
      var url = `${wx.env.USER_DATA_PATH}/model.map`

      const fs = wx.getFileSystemManager()
      fs.writeFile({
        filePath: url,
        data: bufferContent,
        encoding: "binary",
        success(res) {
          console.log(res)
        },
        fail(res) {
          console.error(res)
        }
      })

      return url
    },

    showARModel(event) {
      const setData = this.setData.bind(this)
      const triggerEvent = this.triggerEvent.bind(this)
      const getData = () =>{
        return this.data;
      }

      if(this.data.targetCosId == event.currentTarget.dataset.cosid) {
        setData({
          targetCosId:null
        })
        wx.showToast({
          title: "取消当前已选",
          icon: 'none',
          duration: 2000
        })
        triggerEvent('chooseEvent', {"myChooseMapUrl": null}) 
        return;
      }

      setData({
        targetCosId:event.currentTarget.dataset.cosid
      })

      var saveLocalFile = this.saveLocalFile.bind(this)
      wx.showLoading({
        title: '加载中……',
      })
      wx.cloud.callFunction({
        name: 'ARDemo',
        config: {
          env: this.data.envId
        },
        data: {
          type: 'GetARModel',
          cosid: event.currentTarget.dataset.cosid,
          modelType: 3,
          needData: 0,
          useIntranet: 0,
          expireTime: 1200
        }
      }).then(resp => {
        console.log("获取的模型的cosID为", event.currentTarget.dataset.cosid)
        console.log(resp)
        var filePath = wx.env.USER_DATA_PATH + '/temp'
        wx.downloadFile({
          filePath: filePath,
          url: resp.result.respBody.url,
          success(res) {
            console.log(res)
            const fs = wx.getFileSystemManager()
            fs.readFile({
              filePath: res.filePath,
              position: 0,
              success(res) {
                console.log("结果返回为")
                console.log(res)
                try{
                  var data = message.decode(res.data);
                  console.log("反序列化 >>", data);
                } catch(e){
                    wx.hideLoading();
                    console.log("模型数据解析有误")
                    console.log(e)
                    return;
                }
                var byteOffset = data.meshModel.byteOffset
                var byteLength = data.meshModel.byteLength
                var bufferContent = data.meshModel.buffer.slice(byteOffset, byteOffset + byteLength)
                console.log("byteOffset:", byteOffset)
                console.log("byteLength:", byteLength)
                var resultUrl = saveLocalFile(bufferContent)
                console.log("map文件生成成功")
                console.log(resultUrl)
                setData({
                  chooseMapFile: resultUrl
                })
                triggerEvent('chooseEvent', {"myChooseMapUrl": getData().chooseMapFile}) 
                wx.hideLoading();
              },
              fail(res) {
                wx.hideLoading();
                wx.showToast({
                  title: res.errMsg,
                  icon: 'none',
                  duration: 2000
                })
                console.error(res)
              }
            })
          },
          fail(res) {
            wx.hideLoading();
            wx.showToast({
              title: res.errMsg,
              icon: 'none',
              duration: 2000
            })
            console.error(res)
          }
        })
      }).catch((e) => {
        wx.hideLoading();
        wx.showToast({
          title: e,
          icon: 'none',
          duration: 2000
        })
        console.err(e)
      })
    },
  }
})