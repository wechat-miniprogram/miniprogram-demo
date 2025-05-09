import CustomPage from '../../../base/CustomPage'

CustomPage({
  data: {
    show1: false,
    show2: false,
    show3: false
  },
  showToptips1() {
    this.setData({
      show1: true
    })
  },
  showToptips2() {
    this.setData({
      show2: true
    })
  },
  showToptips3() {
    this.setData({
      show3: true
    })
  }
})
