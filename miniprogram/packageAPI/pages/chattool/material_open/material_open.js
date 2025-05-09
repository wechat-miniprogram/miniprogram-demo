import { getGroupEnterInfo } from '../util'

const config = require('../../../../config')

let needShowEntrance = true
const entrancePath = 'packageAPI/pages/chattool/material_open/material_open'
const templateId = '4A68CBB88A92B0A9311848DBA1E94A199B166463' // 完成
// let templateId = '2A84254B945674A2F88CE4970782C402795EB607' // 参与

const fileUrl = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
const videoUrl = 'https://res.wx.qq.com/op_res/o3RWIC_o--wNf_qA3B4ghHbL_qKRRwsUM39dGTzltCR2__61DnEANInj5AJJmVXsHvx9FyHlDftU3KhcGCukDA'

const { envVersion } = wx.getAccountInfoSync().miniProgram

const getVersionType = () => {
  if (envVersion === 'release') {
    return 0
  } else if (envVersion === 'develop') {
    return 1
  } else if (envVersion === 'trial') {
    return 2
  }

  return 0
}

Page({
  data: {
    members: [],
    needShowEntrance,
    entrancePath,
    shareText: `「团建目的地选择」统计结果：
    - 清远 5 票
    - 南沙 3 票
    - 惠州 2 票`,
    isTemplateComplete: true
  },

  onUnload() {
    if (wx.offThemeChange) {
      wx.offThemeChange()
    }
  },

  onLoad(options) {
    this._activityId = options.activityId

    wx.cloud.init({
      env: config.envId,
      traceUser: true,
    })

    this.setData({
      theme: getApp().globalData.theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        this.setData({ theme })
      })
    }
  },

  async signIn() {
    const activityId = this._activityId
    if (!activityId) {
      wx.showToast({
        title: '需从动态消息卡片',
        icon: 'none'
      })
      return
    }

    await getGroupEnterInfo()
      .then(groupInfo => {
        const { groupOpenID } = groupInfo
        this.updateChatToolMsg(activityId, {
          targetState: 1,
          parameterList: [{
            groupOpenID,
            state: 1,
          }]
        })
        wx.showToast({
          title: '签到成功',
          icon: 'none'
        })
      }).catch(err => {
        console.error('getGroupEnterInfo fail: ', err)
      })
  },

  remindExpiration() {
    const activityId = this._activityId
    if (!activityId) {
      wx.showToast({
        title: '需从动态消息卡片',
        icon: 'none'
      })
      return
    }
    this.updateChatToolMsg(activityId, {
      targetState: 2,
    })
    wx.showToast({
      title: '已触发',
      icon: 'none'
    })
  },

  earlyTerminate() {
    const activityId = this._activityId
    if (!activityId) {
      wx.showToast({
        title: '需从动态消息卡片',
        icon: 'none'
      })
      return
    }
    this.updateChatToolMsg(activityId, {
      targetState: 3,
    })
    wx.showToast({
      title: '已触发',
      icon: 'none'
    })
  },

  updateChatToolMsg(activityId, params = {}) {
    const { targetState, parameterList } = params
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'updateChatToolMsg',
        activityId,
        templateId,
        targetState: targetState || 1,
        parameterList: parameterList || [],
        versionType: getVersionType()
      }
    }).then(resp => {
      console.info('updateChatToolMsg: ', resp)
    }).catch(err => {
      console.info('updateChatToolMsg Fail: ', err)
    })
  },

  viewChatMaterials() {
    wx.navigateTo({
      url: '../material_view/material_view',
    })
  },

  changeNeedShowEntrance() {
    needShowEntrance = !needShowEntrance
    this.setData({
      needShowEntrance
    })
  },

  shareUpdatableMessage() {
    const that = this
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'createActivityId',
      }
    }).then(resp => {
      const activityId = resp.result.activityId
      wx.updateShareMenu({
        withShareTicket: true,
        isUpdatableMessage: true,
        useForChatTool: true,
        chooseType: 2,
        activityId,
        templateInfo: {
          templateId,
        },
        success(res) {
          wx.shareAppMessageToGroup({
            title: '动态消息卡片',
            path: `${entrancePath}?activityId=${activityId}`,
            complete(res) {
              that._activityId = activityId
              console.info('shareAppMessageToGroup: ', res)
            }
          })
        },
        complete(res) {
          console.info('updateShareMenu: ', res)
        }
      })
    })
  },

  shareImage() {
    wx.downloadFile({
      url: 'https://cdc-opendesign-1258344706.cos.ap-guangzhou.myqcloud.com/image/emywrxo77wrzaj3kn3exgk81c1e5x6767l/k689zkwkdmj9ngm/2024/11/06/vlnycdv60lakegvyup38kfh2wbhuzgha2ua6xfdfxxcdoaf6/xj812q7y2n3obyq/abe09549-8469-4e6d-a4f2-7c7e20cdad54.png?imageMogr2/thumbnail/600x340%3E',
      success: (res) => {
        wx.shareImageToGroup({
          imagePath: res.tempFilePath, // 本地路径或临时路径
          needShowEntrance,
          entrancePath,
          complete(res) {
            console.info('shareImageToGroup: ', res)
          }
        })
      }
    })
  },

  shareEmoji() {
    wx.downloadFile({
      url: 'https://mmbiz.qpic.cn/mmbiz_gif/EXAZAY4U1KCcdEB1gicNwIL4lUrpVQ5H5jOSfiaVHJ5n4EQyPrLqgRtbb6X1hRIiaZqMIibVME51FYRf7p2kC4OdLA/0/132',
      success: (res) => {
        wx.shareEmojiToGroup({
          imagePath: res.tempFilePath, // 本地路径或临时路径
          needShowEntrance,
          entrancePath,
          complete(res) {
            console.info('shareEmojiToGroup: ', res)
          }
        })
      }
    })
  },

  shareVideo() {
    wx.downloadFile({
      url: videoUrl,
      success(res) {
        wx.shareVideoToGroup({
          videoPath: res.tempFilePath,
          thumbPath: '',
          needShowEntrance,
          entrancePath,
          complete(res) {
            console.info('shareVideoToGroup: ', res)
          }
        })
      },
      fail: console.error,
    })
  },

  shareFile() {
    wx.downloadFile({
      url: fileUrl,
      success(res) {
        wx.shareFileToGroup({
          filePath: res.tempFilePath,
          fileName: '',
          needShowEntrance,
          entrancePath,
          complete(res) {
            console.info('shareFileToGroup: ', res)
          }
        })
      },
      fail: console.error,
    })
  },
})
