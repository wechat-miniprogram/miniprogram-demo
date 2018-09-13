Page({
  onShareAppMessage() {
    return {
      title: '获取发票抬头',
      path: 'page/API/pages/choose-invoice-title/choose-invoice-title'
    }
  },

  data: {
    type: '',
    title: '',
    taxNumber: '',
    companyAddress: '',
    telephone: '',
    bankName: '',
    bankAccount: '',
  },
  chooseInvoiceTitle() {
    wx.chooseInvoiceTitle({
      success: (res) => {
        this.setData({
          type: res.type,
          title: res.title,
          taxNumber: res.taxNumber,
          companyAddress: res.companyAddress,
          telephone: res.telephone,
          bankName: res.bankName,
          bankAccount: res.bankAccount
        })
      },
      fail: (err) => {
        console.error(err)
      }
    })
  }
})
