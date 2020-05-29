// 使用周期性数据的时候，需要先调用setBackgroundFetchToken, 可在 app.js 中查看具体例子
Page({
  onShareAppMessage() {
    return {
      title: '周期性缓存',
      path: 'packageAPI/pages/get-background-fetch-data/get-background-fetch-data'
    }
  },
  onShow() {
    // 获取缓存的周期性更新数据
    this.getBackgroundFetchData();
  },
  data: {
    openid: '',
    appid: '',
    canIUse: true,
  },
  getBackgroundFetchData() {
    console.log('读取周期性更新数据')
    const that = this;
    if (wx.getBackgroundFetchData) {
      wx.getBackgroundFetchData({
        // 当type = 'periodic' 微信客户端会每隔 12 小时向服务器请求一次数据。
        fetchType: 'periodic',
        success(res) {
          console.log(res)
          const { fetchedData } = res;
          const result = JSON.parse(fetchedData)
          that.setData({
            appid: result.appid,
            openid: result.openid,
          })
          console.log('读取周期性更新数据成功')
        },
        fail() {
          console.log('读取周期性更新数据失败')
          wx.showToast({
            title: '无缓存数据',
            icon: 'none'
          })
        },
        complete() {
          console.log('结束读取')
        }
      })
    } else {
      this.setData({
        canIUse: false
      })
      wx.showModal({
        title: '微信版本过低，暂不支持本功能',
      })
    }
  }
})