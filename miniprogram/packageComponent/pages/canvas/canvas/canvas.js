import {compareVersion} from '../../../../util/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: 'light',

  },
  onReady() {
    // 解决基础库小于 2.7.0 的兼容问题
    const {SDKVersion} = wx.getSystemInfoSync()
    if (compareVersion(SDKVersion, '2.7.0') < 0) {
      console.log('123')
      this.setData({
        canIUse: false,
      })
    } else {
      // canvas
      this.position = {
        x: 150,
        y: 150,
        vx: 2,
        vy: 2
      }

      this.drawBall()
      this.interval = setInterval(this.drawBall, 17)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})