const htmlSnip =
`<div class="div_class">
  <h1>Title</h1>
  <p class="p">
    Life is&nbsp;<i>like</i>&nbsp;a box of
    <b>&nbsp;chocolates</b>.
  </p>
</div>
`
Page({
  data: {
    theme: 'light',
    disableContextMenu: true,
    showBtn: false,
    btnX: 0,
    btnY: 0,
    selectedString: '',
    htmlSnip,
  },
  onShareAppMessage() {
    return {
      title: 'selection',
      path: 'packageComponent/pages/content/selection/selection'
    }
  },
  onUnload() {
    if (wx.offThemeChange) {
      wx.offThemeChange()
    }
  },
  onLoad() {
    this.setData({
      theme: getApp().globalData.theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        this.setData({ theme })
      })
    }
  },
  selectionChangeHandler(e) {
    const selection = e.detail
    if (selection.isCollapsed === false) {
      this.setData({
        showBtn: true,
        selectedString: e.detail.selectedString,
        btnX: e.detail.firstRangeRect.x,
        btnY: e.detail.firstRangeRect.y,
      })
    } else {
      this.setData({
        showBtn: false
      })
    }
  },
  copySelectedString() {
    wx.setClipboardData({
      data: this.data.selectedString,
      success() {
        wx.getClipboardData({
          success(res) {
            wx.showToast({
              title: `复制成功:${res.data}`
            })
          }
        })
      }
    })
  }
})
