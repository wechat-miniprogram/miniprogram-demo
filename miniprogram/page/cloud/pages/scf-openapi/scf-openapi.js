// 参考文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-server-api/database/

Page({
  onShareAppMessage() {
    return {
      title: '云函数中使用微信开放能力',
      path: 'page/cloud/pages/scf-openapi/scf-openapi'
    }
  },

  data: {
    sendTemplateMessageResult: '',
    sendTemplateMessageError: false,
    getWXACodeResult: '',
    getWXACodeError: false,
    sendTemplateMessageLoading: false,
    getWXACodeLoading: false,
  },

  sendTemplateMessageViaCloudFunction(e) {
    this.setData({
      sendTemplateMessageResult: '',
      sendTemplateMessageError: false,
      sendTemplateMessageLoading: true,
    })
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendTemplateMessage',
        formId: e.detail.formId,
      },
      // eslint-disable-next-line
    }).then((res) => {
      this.setData({
        sendTemplateMessageResult: res,
        sendTemplateMessageLoading: false,
      })
      console.log('[云调用] [发送模板消息] 成功: ', res)
    }).catch(err => {
      this.setData({
        sendTemplateMessageError: true,
        sendTemplateMessageLoading: false,
      })
      console.error('[云调用] [发送模板消息] 失败: ', err)
    })
  },

  getWXACodeViaCloudFunction() {
    this.setData({
      getWXACodeResult: '',
      getWXACodeError: false,
      getWXACodeLoading: true,
    })
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'getWXACode'
      }
      // eslint-disable-next-line
    }).then(res => {
      this.setData({
        getWXACodeResult: res,
        getWXACodeLoading: false,
      })
      console.log('[云调用] [获取小程序码]] 成功: ', res)
    }).catch(err => {
      this.setData({
        getWXACodeError: true,
        getWXACodeLoading: false,
      })
      console.error('[云调用] [获取小程序码] 失败: ', err)
    })
  },

  queryServerDataViaClient() {
    const db = wx.cloud.database()
    this.setData({
      clientLoading: true,
      serverDataClient: '',
      serverDataClientError: false
    })
    db.collection('perm4').where({
      _openid: 'server'
    }).get({
      success: res => {
        const resFirstData = (res.data && res.data[0]) || {}
        this.setData({
          serverDataClient: resFirstData.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        this.setData({
          serverDataClientError: true
        })
        console.error('[数据库] [查询记录] 失败：', err)
      },
      complete: () => {
        this.setData({
          clientLoading: false
        })
      }
    })
  },

  queryServerDataViaCloudFunction() {
    this.setData({
      cloudLoading: true,
      serverDataCloud: '',
      serverDataCloudError: false
    })
    wx.cloud.callFunction({
      name: 'getServerDataDemo',
      data: {},
      success: res => {
        console.log('[云函数] [getServerDataDemo] res: ', res.result)
        const resFirstData = (res.result.data && res.result.data[0]) || {}
        this.setData({
          serverDataCloud: resFirstData.data
        })
      },
      fail: err => {
        this.setData({
          serverDataCloudError: true
        })
        console.error('[云函数] [getServerDataDemo] 调用失败', err)
      },
      complete: () => {
        this.setData({
          cloudLoading: false
        })
      }
    })
  }
})
