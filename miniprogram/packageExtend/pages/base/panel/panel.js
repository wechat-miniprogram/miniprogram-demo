import CustomPage from '../../../base/CustomPage'

const base64 = require('../../images/base64')

CustomPage({
  onShareAppMessage() {
    return {
      title: 'panel',
      path: 'page/weui/example/panel/panel'
    }
  },
  onLoad() {
    this.setData({
      icon20: base64.icon20,
      icon60: base64.icon60
    })
  }
})
