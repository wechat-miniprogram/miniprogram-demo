// miniprogram/packageAPI/pages/resizable/resizable.js
Page({
  data: {
    status: 'lock',
  },
  handleStatusChange: function(e) {
    this.setData({
      status: e.currentTarget.dataset.status,
    })
  }
})