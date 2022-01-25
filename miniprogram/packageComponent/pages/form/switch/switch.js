Page({
  data: {
    theme: 'light'
  },
  onShareAppMessage() {
    return {
      title: 'switch',
      path: 'packageComponent/pages/form/switch/switch'
    }
  },

  switch1Change(e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },

  switch2Change(e) {
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
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
