Page({
  onShareAppMessage() {
    return {
      title: 'textarea',
      path: 'page/component/pages/textarea/textarea'
    }
  },

  data: {
    focus: false
  },

  bindTextAreaBlur(e) {
    console.log(e.detail.value)
  }
})
