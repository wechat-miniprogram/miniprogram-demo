const genList = (num) => {
  const ans = []
  for (let i = 0; i < num; i++) {
    ans.push({
      id: i,
    })
  }
  return ans
}
Page({
  data: {
    type: 'fade',
    duration: 300,
    closedElevation: 1,
    closedBorderRadius: 4,
    openElevation: 4,
    openBorderRadius: 0,
    list: genList(10),
    detailPage: '../detail/index',
    renderer: '',
  },
  onShareAppMessage() {
    return {
      title: 'open-container',
      path: 'packageSkylineRouter/page/open-container/index/index'
    }
  },
  onLoad() {
    this.setData({
      renderer: this.renderer
    })
  },

  goDetail() {
    wx.navigateTo({
      url: '../detail/index'
    })
  },

  toggleType() {
    const type = this.data.type === 'fade' ? 'fadeThrough' : 'fade'
    this.setData({
      type
    })
    wx.showToast({
      info: 'none',
      title: `${type}`,
    })
  }
})
