Page({
  data: {
    vtabs: [],
    activeTab: 0,
  },

  onLoad() {
    const titles = ['tabs1', 'tabs2', 'tabs3', 'tabs4', 'tabs5', 'tabs6', 'tabs7'];
    const vtabs = titles.map(item => ({title: item}))
    this.setData({vtabs})
  },

  onTabClick(e) {
    const index = e.detail.index
    console.log('tabClick', index)
  },

  onChange(e) {
    const index = e.detail.index
    console.log('change', index)
  }

})
