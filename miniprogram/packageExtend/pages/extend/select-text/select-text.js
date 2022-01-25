import CustomPage from '../../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'select-text',
      path: 'packageExtend/pages/extend/select-text/select-text'
    }
  },
  data: {
    arr: [{
      value: '长按，上侧复制',
      placement: 'top'
    }, {
      value: '长按，右侧复制',
      placement: 'right'
    }, {
      value: '长按，左侧复制',
      placement: 'left'
    }, {
      value: '长按，下侧复制',
      placement: 'bottom'
    }]
  },

  onLoad() {

  },

  onCopy(e) {
    console.log('onCopy', e)
  },

  handleTouchStart(e) {
    console.log('@@ touchstart', e)
  },

  handleTap(e) {
    console.log('@@ tap', e)
    this.setData({
      evt: e
    })
  }

})
