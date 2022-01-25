const pageData = {
  data: {
    theme: 'light'
  },
  onShareAppMessage() {
    return {
      title: 'slider',
      path: 'packageComponent/pages/form/slider/slider'
    }
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
}

for (let i = 1; i < 5; ++i) {
  (function (index) {
    pageData[`slider${index}change`] = function (e) {
      console.log(`slider${index}发生change事件，携带值为`, e.detail.value)
    }
  }(i))
}

Page(pageData)
