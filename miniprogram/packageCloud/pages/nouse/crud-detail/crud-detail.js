const app = getApp()

Page({
  onShareAppMessage() {
    return {
      title: '基本操作',
      path: 'packageCloud/pages/crud/crud'
    }
  },

  data: {
    theme: 'light',
    openid: '',
    todoId: '',
    description: '',
    done: false,
    updating: false,
    deleting: false
  },

  onLoad(options) {
    const {todoId} = options
    this.setData({
      todoId
    })
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
      this.queryTodo()
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
          this.queryTodo()
          return openid
        }).catch(err => {
          console.error(err)
          wx.hideLoading()
        })
    }
  },

  queryTodo() {
    wx.showLoading({
      title: '正在查询...'
    })
    const db = wx.cloud.database()
    db.collection('todos').doc(this.data.todoId).get({
      success: res => {
        this.setData({
          description: res.data.description,
          done: res.data.done
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  updateTodo() {
    if (this.data.updating || !this.data.todoId) {
      return
    }
    const {todoId, description} = this.data
    if (!description) {
      return
    }

    this.setData({updating: true})
    const db = wx.cloud.database()
    db.collection('todos').doc(todoId).update({
      data: {
        description
      },
      success: () => {
        console.log('he')
        wx.showToast({
          title: '更新成功',
        })
        wx.navigateBack()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '更新失败',
        })
        console.error('[数据库] [更新记录] 失败：', err)
      },
      complete: () => {
        this.setData({updating: false})
      }
    })
  },

  removeTodo() {
    if (this.data.deleting || !this.data.todoId) {
      return
    }
    const {todoId} = this.data

    this.setData({deleting: true})
    const db = wx.cloud.database()
    db.collection('todos').doc(todoId).remove({
      success: () => {
        wx.showToast({
          title: '删除成功',
        })
        wx.navigateBack()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      },
      complete: () => {
        this.setData({deleting: false})
      }
    })
  },

  onInputContent(e) {
    this.setData({
      description: e.detail.value
    })
  }
})
