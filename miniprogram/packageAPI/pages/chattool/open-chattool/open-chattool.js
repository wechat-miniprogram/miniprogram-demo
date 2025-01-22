Page({
  data: {
    activityList: [],
  },

  onShareAppMessage() {
    return {
      title: '群签到助手',
      path: 'packageAPI/pages/chattool/open-chattool/open-chattool'
    }
  },

  onUnload() {
    if (wx.offThemeChange) {
      wx.offThemeChange()
    }
  },

  onLoad() {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        this.setData({ theme })
      })
    }

    this.fetchActivityList()
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
