Page({
  onShareAppMessage() {
    return {
      title: '操作菜单',
      path: 'packageAPI/pages/page/action-sheet/action-sheet'
    }
  },

  actionSheetTap() {
    wx.showActionSheet({
      itemList: ['item1', 'item2', 'item3', 'item4'],
      success(e) {
        console.log(e.tapIndex)
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
