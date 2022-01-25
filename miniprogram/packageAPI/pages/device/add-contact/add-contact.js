Page({
  onShareAppMessage() {
    return {
      title: '新增联系人',
      path: 'packageAPI/pages/device/add-contact/add-contact'
    }
  },

  submit(e) {
    const formData = e.detail.value
    wx.addPhoneContact({
      ...formData,
      success() {
        wx.showToast({
          title: '联系人创建成功'
        })
      },
      fail() {
        wx.showToast({
          title: '联系人创建失败'
        })
      }
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
