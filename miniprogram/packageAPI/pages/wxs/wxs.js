// miniprogram/page/API/pages/wxs/wxs.js
Page({
  handleNavChange(e) {
    console.log(e);
    wx.navigateTo({
      url: `/packageAPI/pages/wxs/${e.currentTarget.dataset.nav}`,
    })
  }
})