Page({
  onShareAppMessage() {
    return {
      title: '剪切板',
      path: 'packageAPI/pages/device/clipboard-data/clipboard-data'
    }
  },
  onShareTimeline() {
    return {
      title: '剪切板'
    }
  },

  data: {
    theme: 'light',
    value: 'edit and copy me',
    pasted: '',
  },

  valueChanged(e) {
    this.setData({
      value: e.detail.value
    })
  },

  copy() {
    wx.setClipboardData({
      data: this.data.value,
      success() {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },

  paste() {
    const self = this
    wx.getClipboardData({
      success(res) {
        self.setData({
          pasted: res.data
        })
        wx.showToast({
          title: '粘贴成功',
          icon: 'success',
          duration: 1000
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
