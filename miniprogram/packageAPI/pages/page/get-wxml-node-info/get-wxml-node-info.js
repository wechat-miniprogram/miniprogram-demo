Page({
  onShareAppMessage() {
    return {
      title: '获取WXML节点信息',
      path: 'packageAPI/pages/page/get-wxml-node-info/get-wxml-node-info'
    }
  },

  data: {
    theme: 'light',
    metrics: []
  },

  onReady() {
    this.getNodeInfo()
  },

  getNodeInfo() {
    const $ = wx.createSelectorQuery()
    const target = $.select('.target')
    target.boundingClientRect()

    $.exec((res) => {
      const rect = res[0]
      if (rect) {
        const metrics = []
        // eslint-disable-next-line
        for (const key in rect) {
          if (key !== 'id' && key !== 'dataset') {
            const val = rect[key]
            metrics.push({key, val})
          }
        }

        this.setData({metrics})
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
