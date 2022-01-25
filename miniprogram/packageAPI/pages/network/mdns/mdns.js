// miniprogram/page/API/pages/mdns/mdns.js
let serviceList = []
let resolveFailList = []
Page({
  onShareAppMessage() {
    return {
      title: 'mdns',
      path: 'packageAPI/pages/network/mdns/mdns'
    }
  },
  daga: {
    serviceList: [],
    resolveFailList: [],
  },
  onShow() {
    this.onLocalService()
  },

  startDiscovery() {
    wx.startLocalServiceDiscovery({
      serviceType: '_http._tcp.',
      success(res) {
        console.log(res)
        wx.showToast({
          title: '开启成功',
          icon: 'none',
          duration: 2000
        })
      },
      fail: (err) => {
        wx.showToast({
          title: '开启失败',
          icon: 'none',
          duration: 2000
        })
        console.log(err)
      },
      complete: () => {
        console.log('startDiscovery: complete')
      }
    })
  },

  stopDiscovery() {
    const that = this
    wx.stopLocalServiceDiscovery({
      success: () => {
        wx.showToast({
          title: '关闭成功',
          icon: 'none',
          duration: 2000
        })
        serviceList = []
        resolveFailList = []
        that.setData({
          serviceList: [],
          resolveFailList: []
        })
      },
      fail: () => {
        console.log('stopDiscovery: fail')
        wx.showToast({
          title: '关闭失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete: () => {
        console.log('stopDIscovery: complete')
      }
    })
  },


  // 监听列表
  onLocalService() {
    const that = this

    // 监听服务发现事件
    wx.onLocalServiceFound(function (obj) {
      console.log(obj)
      serviceList.push(obj)

      that.setData({
        serviceList,
      })
    })

    // 监听服务解析失败事件
    wx.onLocalServiceResolveFail(function (obj) {
      console.log(obj)
      resolveFailList.push(obj)
      that.setData({
        resolveFailList
      })
    })

    // 监听服务离开
    wx.onLocalServiceLost(function (obj) {
      console.log(obj)
    })

    // 监听搜索停止
    wx.onLocalServiceDiscoveryStop(function () {
      console.log('监听到搜索停止事件')
    })
  },
  // 取消监听
  offLocalService() {
    console.log('是否执行此部分数据')
    // 取消监听服务发现事件
    wx.offLocalServiceFound(function () {
      console.log('取消监听服务发现事件 成功')
    })

    // 取消监听服务解析失败事件
    wx.offLocalServiceResolveFail(function () {
      console.log('取消监听 mDNS 服务解析失败的事件 成功')
    })

    // 取消监听服务离开
    wx.offLocalServiceLost(function () {
      console.log('取消监听服务离开事件 成功')
    })

    // 取消监听搜索停止
    wx.offLocalServiceDiscoveryStop(function () {
      console.log('取消监听 mDNS 服务停止搜索的事件 成功')
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
