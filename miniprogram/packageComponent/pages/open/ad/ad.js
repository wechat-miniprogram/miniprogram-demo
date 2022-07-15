const info = wx.getSystemInfoSync()

Page({
  onShareAppMessage() {
    return {
      title: 'ad',
      path: 'packageComponent/pages/open/ad/ad'
    }
  },

  data: {
    index: 0,
    theme: 'light',
    platform: info.platform
  },
  onUnload() {
    if (wx.offThemeChange) {
      wx.offThemeChange()
    }
  },
  onLoad() {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })

    const res = wx.getExptInfoSync(['expt_args_2'])
    if (res.expt_args_2 === undefined) {
        // 返回空对象；未命中实验、实验待发布（白名单除外）或者实验结束后会命中该分支 
        /* 业务逻辑，可对齐线上 */
    } else if (res.expt_args_2 == '0') {
        /* 对照组业务逻辑 */
        this.setData({
          index: 1
        })
    } else if (res.expt_args_2 == '1') {
        /* 实验组1业务逻辑 */
        this.setData({
          index: 2
        })
    } else if (res.expt_args_2 == '2') {
        /* 实验组2业务逻辑 */
        this.setData({
          index: 3
        })
    } else {
        /* 异常分支逻辑 */
        console.log('error')
    }    

    if (wx.onThemeChange) {
      wx.onThemeChange(({theme}) => {
        this.setData({theme})
      })
    }
  }
})
