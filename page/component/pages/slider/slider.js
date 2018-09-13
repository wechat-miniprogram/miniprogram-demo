const pageData = {
  onShareAppMessage() {
    return {
      title: 'slider',
      path: 'page/component/pages/slider/slider'
    }
  },
}

for (let i = 1; i < 5; ++i) {
  (function (index) {
    pageData['slider' + index + 'change'] = function (e) {
      console.log('slider' + index + '发生change事件，携带值为', e.detail.value)
    }
  }(i))
}

Page(pageData)
