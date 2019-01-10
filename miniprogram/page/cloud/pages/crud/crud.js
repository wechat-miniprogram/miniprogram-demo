// 参考文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html

const app = getApp()

Page({
  onShareAppMessage() {
    return {
      title: '基本操作',
      path: 'page/cloud/pages/crud/crud'
    }
  },

  data: {
    openid: '',
    todoListFetched: false,
    todoList: [],
    searchContent: '',
    newContent: '',
    filtered: false,
    loading: false
  },

  onLoad() {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
      this.queryTodoList()
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
          this.queryTodoList()
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

  onShow() {
    if (this.data.openid) {
      this.queryTodoList()
    }
  },

  createTodo() {
    if (this.data.loading) {
      return
    }
    const {newContent} = this.data
    if (!newContent) {
      return
    }

    this.setData({loading: true})
    const db = wx.cloud.database()
    db.collection('todos').add({
      data: {
        description: newContent,
        done: false,
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          todoList: [
            ...this.data.todoList,
            {
              _id: res._id,
              _openid: this.data.openid,
              description: newContent,
              done: false,
            }
          ],
          newContent: ''
        })
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      },
      complete: () => {
        this.setData({loading: false})
      }
    })
  },

  queryTodoList() {
    wx.showLoading({
      title: '正在查询...'
    })
    const db = wx.cloud.database()
    db.collection('todos').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          todoListFetched: true,
          todoList: res.data,
          filtered: false
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

  searchTodo() {
    const {searchContent} = this.data
    if (!searchContent) {
      this.queryTodoList()
      return
    }

    const db = wx.cloud.database()
    let descriptionCondition = searchContent
    const execResult = /^\/([\s\S]*)\//.exec(searchContent)
    if (execResult) {
      const reStr = execResult[1].trim().replace(/\s+/g, '|')
      descriptionCondition = db.RegExp({
        regexp: reStr
      })
    }
    wx.showLoading({
      title: '正在查询...'
    })
    db.collection('todos').where({
      _openid: this.data.openid,
      description: descriptionCondition
    }).get({
      success: res => {
        this.setData({
          todoList: res.data,
          filtered: true
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

  toggleComplete(e) {
    if (this.data.loading) {
      return
    }
    const {id: todoId, index} = e.currentTarget.dataset
    const todo = this.data.todoList[index]

    this.setData({loading: true})
    const db = wx.cloud.database()
    db.collection('todos').doc(todoId).update({
      data: {done: !todo.done},
      success: () => {
        this.setData({
          [`todoList[${index}].done`]: !todo.done
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '更新失败',
        })
        console.error('[数据库] [更新记录] 失败：', err)
      },
      complete: () => {
        this.setData({loading: false})
      }
    })
  },

  toDetail(e) {
    const {id: todoId} = e.currentTarget.dataset
    wx.navigateTo({
      url: `/page/cloud/pages/crud-detail/crud-detail?todoId=${todoId}`,
    })
  },

  onInputSearchContent(e) {
    this.setData({
      searchContent: e.detail.value
    })
  },

  onInputNewContent(e) {
    this.setData({
      newContent: e.detail.value
    })
  }
})
