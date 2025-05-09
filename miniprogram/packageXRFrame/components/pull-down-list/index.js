const itemHeight = 56 * 2
Component({
  data: {
    childBoxHeight: 0,
  },
  externalClasses: ['t-class'],
  properties: {
    defaultOpen: {
      type: Boolean,
      value: false,
    },
    name: {
      type: String,
      value: '',
    },
    tag: {
      type: String,
      value: '',
    },
    root: {
      type: String,
      value: '',
    },
    childArr: {
      type: Array,
      value: [],
      observer(childArr) {
        this.setData({
          childBoxHeight: this.data.defaultOpen ? itemHeight * childArr.length : 0,
        })
      },
    },
  },
  methods: {
    switchHandle() {
      const { childArr, childBoxHeight } = this.data
      this.setData({
        childBoxHeight: childBoxHeight > 0 ? 0 : childArr.length * itemHeight,
      })
    },
    tapChild(e) {
      this.triggerEvent('click', {
        ...e.target.dataset,
        root: this.data.root
      })
    },
  },
})
