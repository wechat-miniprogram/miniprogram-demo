

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  properties: {
    tabIndex: {
      type: Number,
      value: 0
    }
  },
  relations: {
    '../vtabs/vtabs': {
      type: 'parent'
    }
  },
  lifetimes: {
    attached: function attached() {}
  },
  methods: {
    calcHeight: function calcHeight(callback) {
      const query = this.createSelectorQuery()
      query.select('.weui-vtabs-content__item').boundingClientRect(function (rect) {
        callback && callback(rect)
      }).exec()
    }
  }
})
