Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: 'light',

  },

  // 请求订阅
  requestSubscribeMessage() {
    const self = this
    wx.requestSubscribeMessage({
      tmplIds: ['y1bXHAg_oDuvrQ3pHgcODcMPl-2hZHenWugsqdB2CXY'],
      success(res) {
        console.log(res)
        if (res.errMsg === 'requestSubscribeMessage:ok') {
          self.subscribeMessageSend()
        }
      },
      complete(res) {
        console.log(res)
      }
    })
  },

  // 下发订阅消息
  subscribeMessageSend() {
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
    theme: 'light',
        action: 'sendSubscribeMessage'
      },
      success: res => {
        console.warn('[云函数] [openapi] templateMessage.send 调用成功：', res)
        wx.showModal({
          title: '订阅成功',
          content: '请返回微信主界面查看',
          showCancel: false,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [openapi] templateMessage.send 调用失败：', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({theme}) => {
        this.setData({theme})
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '订阅消息',
      path: 'packageAPI/pages/api/subscribe-message/subscribe-message'
    }
  },
})
