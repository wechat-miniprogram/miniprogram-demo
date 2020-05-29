// miniprogram/page/API/pages/wxs/wxs.js
Page({
  onShareAppMessage() {
    return {
      title: 'wxs',
      path: 'packageAPI/pages/wxs/wxs'
    }
  },
  handleNavChange(e) {
    console.log(e);
    wx.navigateTo({
      url: `/packageAPI/pages/wxs/${e.currentTarget.dataset.nav}`,
    })
  }
})