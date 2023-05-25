Component({
  properties: {
    title: {
      type: String,
      value: '',
    },
    intro: {
      type: String,
      value: '',
    },
    hint: {
      type: String,
      value: '',
    },
    code: {
      type: String,
      value: '',
    },
    json: {
      type: String,
      value: '',
    },
    js: {
      type: String,
      value: '',
    },
    showBackBtn: {
      type: Boolean,
      value: false,
    },
  },
  data: {
  },
  lifetimes: {
    attached() {
      wx.xrTitle = this.data.title;
    }
  },
  methods: {
    onClickBack() {
      wx.navigateBack()
    },
  },
  options: {
    multipleSlots: true
  }
})