import CustomPage from '../../../base/CustomPage'

const base64 = require('../../images/base64')

CustomPage({
  onShareAppMessage() {
    return {
      title: 'sliderview',
      path: 'packageExtend/pages/form/sliderview/sliderview'
    }
  },
  onLoad() {
    this.setData({
      icon: base64.icon20,
      slideButtons: [{
        text: '普通',
        src: global.isDemo ? '/packageExtend/pages/form/cell/icon_love.svg' : '/example/cell/icon_love.svg', // icon的路径
      }, {
        text: '普通',
        extClass: 'test',
        src: global.isDemo ? '/packageExtend/pages/form/cell/icon_star.svg' : '/example/cell/icon_star.svg', // icon的路径
      }, {
        type: 'warn',
        text: '警示',
        extClass: 'test',
        src: global.isDemo ? '/packageExtend/pages/form/cell/icon_del.svg' : '/example/cell/icon_del.svg', // icon的路径
      }],
    })
  },
  slideButtonTap(e) {
    console.log('slide button tap', e.detail)
  }
})
