const paymentUrl = require('../../../../config').paymentUrl

const app = getApp()

Page({
  onShareAppMessage() {
    return {
      title: '发起支付',
      path: 'page/API/pages/request-payment/request-payment'
    }
  },

  onLoad() {},

  requestPayment() {
    const self = this

    self.setData({
      loading: true
    })

    // 此处需要先调用wx.login方法获取code，然后在服务端调用微信接口使用code换取下单用户的openId
    // 具体文档参考https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html?t=20161230#wxloginobject
    app.getUserOpenId(function (err, openid) {
      if (!err) {
        wx.request({
          url: paymentUrl,
          data: {
            openid
          },
          method: 'POST',
          success(res) {
            console.log('unified order success, response is:', res)
            const payargs = res.data.payargs
            wx.requestPayment({
              timeStamp: payargs.timeStamp,
              nonceStr: payargs.nonceStr,
              package: payargs.package,
              signType: payargs.signType,
              paySign: payargs.paySign
            })

            self.setData({
              loading: false
            })
          }
        })
      } else {
        console.log('err:', err)
        self.setData({
          loading: false
        })
      }
    })
  }
})
