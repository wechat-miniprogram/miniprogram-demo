Component({
  data: {
    keyword: ''
  },
  lifetimes: {
    created() {
      this._modelCtx = wx.modelContext.getContext(this)
      this._viewCtx = wx.modelContext.getViewContext(this)
      const { NotificationType } = wx.modelContext
      this._modelCtx.on(NotificationType.Input, (data) => {
        const input = (data && data.input) || {}
        this.setData({ keyword: input.keyword || '' })
      })
    }
  },
  methods: {
    onTapBrowse() {
      this._viewCtx.openDetailPage({ url: '/packageWeStoreCoffee/pages/home/home' })
    }
  }
})
