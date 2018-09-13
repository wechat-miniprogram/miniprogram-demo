Page({
  onShareAppMessage() {
    return {
      title: 'switch',
      path: 'page/component/pages/switch/switch'
    }
  },

  switch1Change(e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },

  switch2Change(e) {
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
  }
})
