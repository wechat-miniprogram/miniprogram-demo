const util = require('../../../../util/util.js')

// 参考文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-client-api/database/db.serverDate.html

const app = getApp()
const collection = 'serverDate'

Page({
  onShareAppMessage() {
    return {
      title: '服务端时间',
      path: 'packageCloud/pages/database/server-date/server-date'
    }
  },

  data: {
    theme: 'light',
    openid: '',
    loading: false,
    clientDate: null,
    serverDate: null,
    clientDateFormatted: '',
    serverDateFormatted: '',
    delta: 0
  },

  onLoad() {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({theme}) => {
        this.setData({theme})
      })
    }
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    } else {
      wx.showLoading({
        title: '正在初始化...'
      })
      app.getUserOpenIdViaCloud()
        .then(openid => {
          this.setData({
            openid
          })
          wx.hideLoading()
          return openid
        }).catch(err => {
          console.error(err)
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '初始化失败，请检查网络'
          })
        })
    }
  },

  showError() {
    wx.showToast({
      icon: 'none',
      title: '插入失败'
    })
  },

  completeTask() {
    this.setData({
      loading: false
    })
  },

  // 如果已有记录则更新，否则插入
  insertOrUpdateData(existedData, data) {
    const db = wx.cloud.database()
    if (existedData._id) {
      db.collection(collection).doc(existedData._id).update({data})
        .then(res => {
          this.setCompletedData(existedData._id)
          return res
        })
        .catch(err => {
          this.showError()
          console.error('[数据库] [更新记录] 失败：', err)
          this.completeTask()
        })
    } else {
      db.collection(collection).add({data})
        .then(res => {
          this.setCompletedData(res._id)
          return res
        })
        .catch(err => {
          this.showError()
          console.error('[数据库] [新增记录] 失败：', err)
          this.completeTask()
        })
    }
  },

  // 查询已插入/更新的数据中记录的服务端时间
  setCompletedData(id) {
    const db = wx.cloud.database()
    db.collection(collection).doc(id).get()
      .then(res => {
        this.setData({
          delta: Math.abs(res.data.time - this.data.clientDate), // 大致的时间差
          serverDate: res.data.time, // 服务端时间
          clientDateFormatted: util.formatDateTime(this.data.clientDate, true),
          serverDateFormatted: util.formatDateTime(res.data.time, true)
        })
        wx.showToast({
          title: '插入成功',
        })
        this.completeTask()
        return res
      })
      .catch(err => {
        this.showError()
        console.error('[数据库] [查询记录] 失败：', err)
        this.completeTask()
      })
  },

  insertData() {
    const db = wx.cloud.database()
    const data = {
      time: db.serverDate()
    }
    this.setData({
      loading: true
    })
    db.collection(collection).where({
      _openid: this.data.openid
    }).get()
      .then(res => {
        this.data.clientDate = new Date() // 客户端时间
        console.log('[数据库] [查询记录] 成功: ', res)
        const resFirstData = res.data[0] || {}
        this.insertOrUpdateData(resFirstData, data)
        return res
      })
      .catch(err => {
        this.showError()
        console.error('[数据库] [查询记录] 失败：', err)
        this.completeTask()
      })
  },
})
