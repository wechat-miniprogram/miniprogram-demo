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
    wx.cloud.init({
      // env 参数说明：
      //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
      //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
      //   如不填则使用默认环境（第一个创建的环境）
      env: "test-f0b102",
      traceUser: true,
    });
    
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
