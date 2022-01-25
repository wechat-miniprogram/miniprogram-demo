Page({
  onShareAppMessage() {
    return {
      title: 'textarea',
      path: 'packageComponent/pages/form/textarea/textarea'
    }
  },

  data: {
    theme: 'light',
    focus: false
  },

  bindTextAreaBlur(e) {
    console.log(e.detail.value)
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
