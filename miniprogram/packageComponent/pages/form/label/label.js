Page({
  onShareAppMessage() {
    return {
      title: 'label',
      path: 'packageComponent/pages/form/label/label'
    }
  },

  data: {
    theme: 'light',
    checkboxItems: [
      {name: 'USA', value: '美国'},
      {name: 'CHN', value: '中国', checked: 'true'}
    ],
    radioItems: [
      {name: 'USA', value: '美国'},
      {name: 'CHN', value: '中国', checked: 'true'}
    ],
    hidden: false
  },

  checkboxChange(e) {
    const checked = e.detail.value
    const changed = {}
    for (let i = 0; i < this.data.checkboxItems.length; i++) {
      if (checked.indexOf(this.data.checkboxItems[i].name) !== -1) {
        changed[`checkboxItems[${i}].checked`] = true
      } else {
        changed[`checkboxItems[${i}].checked`] = false
      }
    }
    this.setData(changed)
  },

  radioChange(e) {
    const checked = e.detail.value
    const changed = {}
    for (let i = 0; i < this.data.radioItems.length; i++) {
      if (checked.indexOf(this.data.radioItems[i].name) !== -1) {
        changed[`radioItems[${i}].checked`] = true
      } else {
        changed[`radioItems[${i}].checked`] = false
      }
    }
    this.setData(changed)
  },

  tapEvent() {
    console.log('按钮被点击')
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
