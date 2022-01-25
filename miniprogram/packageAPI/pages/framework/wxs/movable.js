// pages/movable/movable.js
Page({
  onShareAppMessage() {
    return {
      title: 'movable',
      path: 'packageAPI/pages/framework/wxs/movable'
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    theme: 'light',
    left: 50,
    top: 50,
    taptest: 'taptest',
    show: true,
    dataObj: {
      obj: 1
    }
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
    setTimeout(() => {
      this.setData({
        // show: false,
      })
    }, 3000)
  },
  taptest() {
    this.setData({
      show: false,
    })
  }
})
