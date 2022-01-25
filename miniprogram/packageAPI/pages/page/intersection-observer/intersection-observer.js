Page({
  onShareAppMessage() {
    return {
      title: 'WXML节点布局相交状态',
      path: 'packageAPI/pages/page/intersection-observer/intersection-observer'
    }
  },

  data: {
    theme: 'light',
    appear: false
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
    this._observer = wx.createIntersectionObserver(this)
    this._observer
      .relativeTo('.scroll-view')
      .observe('.ball', (res) => {
        console.log(res)
        this.setData({
          appear: res.intersectionRatio > 0
        })
      })
  },
  onUnload() {
    if (this._observer) this._observer.disconnect()
  }
})
