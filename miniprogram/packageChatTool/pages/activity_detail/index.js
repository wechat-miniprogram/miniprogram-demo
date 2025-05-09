// pages/activity_create/index.js
import { getChatToolInfo } from '../../util'

const roleType = ['unkown', 'owner', 'participant', 'nonParticipant']

const activityStatus = ['未开始', '进行中', '已结束']

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
    isOwner: false,
    members: [],
    role: roleType[0],
    activityId: '',
    activityInfo: {},
    signIn: [],
    notSignIn: [],
    participant: [],

    signInStatus: false,
    activityStatusStar: '',

    showProgress: false,
    percent: '0',

    groupInfo: null,
    progressImage: '',
    showBackBtn: false,
    triggered: false,
  },

  onLoad(options) {
    this.data.activityId = options.activityId
    this.fetchActivity()

    const pages = getCurrentPages()
    this.setData({
      showBackBtn: pages.length > 1
    })
  },

  onBack() {
    wx.navigateBack({ delta: 1 })
  },

  onRefresh() {
    if (this._freshing) return
    this._freshing = true

    this.fetchActivity().then(() => {
      this.setData({
        triggered: false,
      })
      this._freshing = false
    })
  },

  onRestore(e) {
    console.log('onRestore:', e)
  },

  onAbort(e) {
    console.log('onAbort', e)
  },

  onGoHome() {
    wx.reLaunch({
      url: '/packageAPI/pages/chattool/activity_assist/activity_assist',
      complete(res) {
        console.info('relaunch', res)
      }
    })
  },

  refreshData(activityInfo, groupInfo, useFake = true) {
    const {
      participant,
      signIn,
      creator,
    } = activityInfo

    const notSignIn = participant.filter(i => !signIn.includes(i))

    const { groupOpenID, roomid, openid } = groupInfo

    const percent = participant.length ? Math.ceil(signIn.length / participant.length * 100) : 0
    const isOwner = creator === openid

    let role
    if (roomid !== activityInfo.roomid) {
      role = roleType[3]
    } else {
      role = participant.includes(groupOpenID)
        ? roleType[2]
        : (isOwner ? roleType[1] : roleType[3])
    }

    if (participant.length === 0) {
      role = roleType[2]
    }

    this.setData({
      role,
      isOwner,
      signInStatus: signIn.includes(groupOpenID),
      activityInfo,
      members: signIn,
      signIn,
      notSignIn,
      participant,
      percent
    })

    this.updateProgressImage()
  },

  async fetchActivity() {
    const that = this

    await getChatToolInfo().then(groupInfo => {
      that.data.groupInfo = groupInfo

      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'selectRecord',
          activityId: this.data.activityId,
        }
      }).then(resp => {
        if (resp.result.success) {
          const activityInfo = resp.result.activityInfo
          that.refreshData(activityInfo, groupInfo)
        } else {
          wx.showToast({
            title: '活动未找到',
            icon: 'none'
          })
        }
      }).catch(err => {
        console.info('fetchActivity fail: ', err)
      })
    })
  },

  onTabsChange(e) {
    const type = e.detail.value
    this.setData({
      members: this.data[type]
    })
  },

  notifyNotSignIn() {
    const { activityId, notSignIn, activityInfo } = this.data
    if (!activityInfo._id) return

    wx.notifyGroupMembers({
      title: activityInfo.title,
      type: 'participate',
      members: notSignIn,
      entrancePath: `packageChatTool/pages/activity_detail/index?activityId=${activityId}`,
      complete(res) {
        console.info('notifyGroupMembers: ', res)
      }
    })
  },

  signIn() {
    const that = this
    const { signIn, activityInfo, groupInfo } = this.data
    const { roomid, groupOpenID } = groupInfo

    if (signIn.includes(groupOpenID)) {
      wx.showToast({
        title: '已签到',
        icon: 'none'
      })
      return
    }

    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'signIn',
        roomid,
        groupOpenID,
        activityId: this.data.activityId,
      }
    }).then(resp => {
      if (resp.result.success) {
        const { signIn } = activityInfo
        signIn.push(groupOpenID)
        that.refreshData(activityInfo, groupInfo, false)
        that.updateChatToolMsg({
          targetState: 1,
          parameterList: [{
            groupOpenID,
            state: 1,
          }]
        })
      } else {
        wx.showToast({
          title: '报名失败',
          icon: 'none'
        })
      }
    }).catch(err => {
      console.info('signIn fail: ', err)
    })
  },

  remindExpiration() {
    this.updateChatToolMsg({
      targetState: 2,
    })
    wx.showToast({
      title: '已触发',
      icon: 'none'
    })
  },

  earlyTerminate() {
    this.updateChatToolMsg({
      targetState: 3,
    })
    wx.showToast({
      title: '已触发',
      icon: 'none'
    })
  },

  updateChatToolMsg(params = {}) {
    const { targetState, parameterList } = params
    // const templateId = '2A84254B945674A2F88CE4970782C402795EB607' // 参与
    const templateId = '4A68CBB88A92B0A9311848DBA1E94A199B166463' // 完成

    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'updateChatToolMsg',
        activityId: this.data.activityId,
        targetState: targetState || 1,
        templateId,
        parameterList: parameterList || [],
        versionType: getVersionType()
      }
    }).then(resp => {
      console.info('updateChatToolMsg: ', resp)
    }).catch(err => {
      console.info('updateChatToolMsg Fail: ', err)
    })
  },

  updateProgressImage() {
    const that = this
    setTimeout(() => {
      this.createSelectorQuery()
        .select('#target')
        .node()
        .exec(res => {
          const node = res[0].node
          node.takeSnapshot({
            type: 'file',
            format: 'png',
            success: (res) => {
              const imagePath = res.tempFilePath
              console.info('snapshot: ', imagePath)
              that.data.progressImage = imagePath
            },
            fail(res) {
              console.info('takeSnapshot fail: ', res)
              wx.showToast({
                title: '分享进度失败',
                icon: 'none'
              })
            }
          })
        })
    }, 20)
  },

  sendProgress() {
    const { progressImage, activityId } = this.data
    const entrancePath = `packageChatTool/pages/activity_detail/index?activityId=${activityId}`
    wx.shareImageToGroup({
      imagePath: progressImage,
      needShowEntrance: true,
      entrancePath,
      complete(res) {
        console.info('shareImageToGroup: ', res)
      }
    })
  },

  share() {
    const { activityInfo, activityId } = this.data
    if (!activityInfo._id) return

    wx.cloud.downloadFile({
      fileID: activityInfo.coverImage,
      success: res => {
        wx.shareAppMessageToGroup({
          title: activityInfo.title,
          imageUrl: res.tempFilePath,
          path: `packageChatTool/pages/activity_detail/index?activityId=${activityId}`,
        })
      },
      fail: console.error
    })
  },
})
