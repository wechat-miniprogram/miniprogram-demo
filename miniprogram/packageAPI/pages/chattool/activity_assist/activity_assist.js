const config = require('../../../../config')
const util = require('../../../../util/util')

const systemInfo = getApp().globalData
Page({
  data: {
    activityList: [],
  },

  onShareAppMessage() {
    return {
      title: '群签到助手',
      path: 'packageAPI/pages/chattool/activity_assist/activity_assist'
    }
  },

  onUnload() {
    if (wx.offThemeChange) {
      wx.offThemeChange()
    }
  },

  onLoad() {
    if (util.compareVersion(systemInfo.SDKVersion, '3.7.8') < 0) {
      wx.showModal({
        title: '需升级微信到新版本体验',
        showCancel: false,
        content: '',
      })
      return
    }

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

  onShow() {
    this.refresh()
  },

  refresh() {
    this.fetchActivityList()
  },

  fetchActivityList() {
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'fetchActivityList',
      }
    }).then(resp => {
      console.info('fetchActivityList: ', resp)
      if (resp.result) {
        const activityList = resp.result.dataList
        this.setData({ activityList })
      }
    }).catch(err => {
      console.error('fetchActivityList fail: ', err)
    })
  },

  create() {
    wx.openChatTool({
      url: '/packageChatTool/pages/activity_create/index',
    })
  },

  goDetail(e) {
    const { id, roomid, singlechat } = e.currentTarget.dataset
    wx.openChatTool({
      roomid,
      isSingleChat: Boolean(singlechat),
      url: `/packageChatTool/pages/activity_detail/index?activityId=${id}`,
    })
  },
})
