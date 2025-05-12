// pages/activity_create/index.js
import { getChatToolInfo } from '../../util'

// const defaultShareImage = 'https://p9.itc.cn/q_70/images03/20211124/d7dce66b866c4ccd805190a4925ff707.png'

function checkTitle(str) {
  const regex = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
  let actualLength = 0
  for (let i = 0; i < str.length; i++) {
    actualLength += /[\u4e00-\u9fa5]/.test(str[i]) ? 2 : 1
  }
  if (actualLength === 0 || actualLength > 30) {
    return false
  }
  return regex.test(str)
}

Page({

  data: {
    title: '',
    shareImage: '',
    shareImageCloudFile: '',
    limitNumber: false,
    number: 0,
    dateTextStart: '2024-10-11',
    dateTextEnd: '2025-12-11',

    mode: '',
    dateVisible: false,
    date: new Date().getTime(), // 支持时间戳传入

    // 指定选择区间起始值
    start: '2024-01-01 00:00:00',
    end: '2030-09-09 12:12:12',

    dateOption: 'Start',
    participant: [],
    activityId: '',
    useAssigner: true,
  },

  onLoad(options) {
    this.createActivityID()

    getChatToolInfo()
      .then(resp => {
        console.info()
      })
  },

  createActivityID() {
    return wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'createActivityId',
      }
    }).then(resp => {
      if (resp.result) {
        this.data.activityId = resp.result.activityId
      }
    }).catch(err => {
      console.error('createActivityId fail : ', err)
    })
  },

  onTitleChange(e) {
    this.data.title = e.detail.value
  },

  showStartPicker(e) {
    this.data.dateOption = 'Start'
    this.showPicker(e)
  },

  showEndPicker(e) {
    this.data.dateOption = 'End'
    this.showPicker(e)
  },

  showPicker(e) {
    const { mode } = e.currentTarget.dataset
    this.setData({
      mode,
      [`${mode}Visible`]: true,
    })
  },
  hidePicker() {
    const { mode } = this.data
    this.setData({
      [`${mode}Visible`]: false,
    })
  },
  onConfirm(e) {
    const { value } = e.detail
    const { mode, dateOption } = this.data

    console.log('confirm', value)

    this.setData({
      [mode]: value,
      [`${mode}Text${dateOption}`]: value,
    })

    this.hidePicker()
  },

  onColumnChange(e) {
    console.log('pick', e.detail.value)
  },

  chooseShareImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success(res) {
        const shareImage = res.tempFilePaths[0]
        that.setData({
          shareImage,
        })

        wx.showLoading({
          title: '上传中...',
        })

        wx.cloud.uploadFile({
          cloudPath: `image-${Date.now()}.png`, // 上传至云端的路径
          filePath: shareImage,
          success: res => {
            // 返回文件 ID
            console.log('uploadFile: ', res.fileID)
            that.setData({
              shareImageCloudFile: res.fileID
            })
          },
          fail: console.error,
          complete(res) {
            wx.hideLoading()
          }
        })
      }
    })
  },

  changeLimitNumber() {
    this.setData({
      limitNumber: !this.data.limitNumber
    })
  },

  changeAssigner() {
    this.setData({
      useAssigner: !this.data.useAssigner
    })
    if (!this.data.useAssigner) {
      this.setData({
        participant: []
      })
    }
  },

  onNumberChange(e) {
    this.setData({
      number: e.detail.value
    })
  },

  chooseParticipant() {
    const that = this
    const { limitNumber, number } = this.data
    wx.selectGroupMembers({
      maxSelectCount: limitNumber ? number : -1,
      success(res) {
        that.setData({
          participant: res.members
        })
      },
      complete(res) {
        console.info('selectGroupMembers: ', res)
      }
    })
  },

  async publish() {
    const {
      title,
      shareImage,
      dateTextStart,
      dateTextEnd,
      participant,
      activityId,
      shareImageCloudFile,
      useAssigner,
    } = this.data

    if (!checkTitle(title)) {
      wx.showToast({
        title: '标题只能为中英文数字，长度小于30',
        icon: 'none'
      })
      return
    }

    if (!title || !dateTextStart || !dateTextEnd || !shareImage) {
      wx.showToast({
        icon: 'none',
        title: '表单未填写完',
      })
      return
    }

    if (useAssigner && !participant.length) {
      wx.showToast({
        icon: 'none',
        title: '参与者不能为空',
      })
      return
    }

    if (!activityId) {
      this.createActivityID(() => {
        this.publish()
      })
    }

    const that = this
    const coverImage = shareImageCloudFile

    wx.showLoading({})

    getChatToolInfo()
      .then(resp => {
        wx.cloud.callFunction({
          name: 'quickstartFunctions',
          data: {
            type: 'addRecord',
            activityId,
            roomid: resp.roomid,
            chatType: resp.chatType,
            title,
            coverImage,
            startTime: dateTextStart,
            endTime: dateTextEnd,
            participant,
            signIn: [],
          }
        }).then(resp => {
          const params = {
            withShareTicket: true,
            isUpdatableMessage: true,
            activityId,
            participant,
            useForChatTool: true,
            chooseType: useAssigner ? 1 : 2,
            templateInfo: {
              templateId: '4A68CBB88A92B0A9311848DBA1E94A199B166463'
            }
          }
          wx.updateShareMenu({
            ...params,
            success(res) {
              wx.shareAppMessageToGroup({
                title,
                path: `packageChatTool/pages/activity_detail/index?activityId=${activityId}`,
                imageUrl: shareImage,
                complete(res) {
                  console.info('shareAppMessageToGroup: ', res)
                }
              })
            },
            fail(res) {
              console.info('updateShareMenu fail: ', res)
              wx.showToast({
                title: '分享失败',
                icon: 'none'
              })
            },
            complete(res) {
              wx.hideLoading({})

              that.data.activityId = ''
              that.createActivityID()
              console.info('updateShareMenu complete: ', res)
            }
          })
        })
      }).catch((err) => {
        console.error('publish fail: ', err)
        wx.showToast({
          icon: 'none',
          title: '发布失败',
        })
      })
  },
})
