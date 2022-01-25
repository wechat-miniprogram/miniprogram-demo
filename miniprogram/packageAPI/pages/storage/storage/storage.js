Page({
  onShareAppMessage() {
    return {
      title: '数据存储',
      path: 'packageAPI/pages/storage/storage/storage'
    }
  },

  data: {
    theme: 'light',
    key: '',
    data: '',
    dialog: {
      title: '',
      content: '',
      hidden: true
    }
  },

  keyChange(e) {
    this.data.key = e.detail.value
  },

  dataChange(e) {
    this.data.data = e.detail.value
  },

  getStorage() {
    const {key, data} = this.data
    let storageData

    if (key.length === 0) {
      this.setData({
        key,
        data,
      })
      wx.showModal({
        title: '读取数据失败',
        content: 'key 不能为空'
      })
    } else {
      storageData = wx.getStorageSync(key)
      console.log(storageData)
      if (storageData === '') {
        this.setData({
          key,
          data: storageData
        })
        wx.showModal({
          title: '读取数据失败',
          content: '找不到 key 对应的数据'
        })
      } else {
        this.setData({
          key,
          data: storageData
        })
        wx.showModal({
          title: '读取数据成功',
          content: storageData,
        })
      }
    }
  },

  setStorage() {
    const {key, data} = this.data
    if (key.length === 0) {
      this.setData({
        key,
        data,
      })
      wx.showModal({
        title: '保存数据失败',
        content: 'key 不能为空'
      })
    } else {
      wx.setStorageSync(key, data)
      this.setData({
        key,
        data,

      })
      wx.showModal({
        title: '存储数据成功'
      })
    }
  },

  clearStorage() {
    wx.clearStorageSync()
    this.setData({
      key: '',
      data: '',
    })
    wx.showModal({
      title: '清除数据成功'
    })
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
  }
})
