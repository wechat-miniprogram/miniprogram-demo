import CustomPage from '../../../base/CustomPage'

CustomPage({
  data: {
    loading: false,
    show: true,
    animated: false,
    title: 'UI组件库'
  },
  toggleLoading() {
    this.setData({
      loading: !this.data.loading
    })
  },
  changeTitle() {
    this.setData({
      title: '修改标题内容之后的标题长这个样子'
    })
  },
  changeColor() {
    this.setData({
      color: '#07C160'
    })
  },
  changeBgColor() {
    this.setData({
      background: '#adadad'
    })
  },
  toggleShow() {
    this.setData({
      show: !this.data.show
    })
  },
  toggleAnimated() {
    this.setData({
      animated: !this.data.animated,
      show: !this.data.show
    })
  }
})
