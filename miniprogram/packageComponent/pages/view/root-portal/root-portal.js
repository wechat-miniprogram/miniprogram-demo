const app = getApp()
Page({
  data: {
    items: [{}],
    show: false,
  },
  onLoad() {
    const items = []
    for (let i = 0; i < 200; i++) {
      const item = {}
      //   const r = Math.floor(255 * Math.random())
      //   const g = Math.floor(255 * Math.random())
      //   const b = Math.floor(255 * Math.random())
      //   item.bg = `background-color: rgb(${r}, ${g}, ${b})`

      const r = Math.floor(Math.random() * (229 - 105) + 105)// 生成固定灰色
      item.bg = `background-color: rgb(${r}, ${r}, ${r})`
      items.push(item)
    }
    this.setData({ items })
  },
  tap() {
    this.setData({ show: true })
  },
  handleStatus(e) {
    this.setData({ show: false })
  }
})
