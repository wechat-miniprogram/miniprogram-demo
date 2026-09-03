Component({
  data: {
    title: '为你推荐',
    items: [],
    total: 0,
    hasMore: false
  },
  lifetimes: {
    created() {
      this._modelCtx = wx.modelContext.getContext(this)
      this._viewCtx = wx.modelContext.getViewContext(this)
      const { NotificationType } = wx.modelContext
      this._modelCtx.on(NotificationType.Result, (data) => {
        const result = data && data.result ? data.result : {}
        const sc = result.structuredContent || {}
        const meta = result._meta || {}
        const viewItems = meta.viewItems || sc.items || []
        this.setData({
          items: viewItems.slice(0, 3),
          total: sc.total || viewItems.length,
          hasMore: sc.hasMore || (sc.total && sc.total > 3),
          title: sc.keyword ? `"${sc.keyword}" 搜索结果` : '为你推荐'
        })
        if (sc.keyword) {
          this._viewCtx.setRelatedPage({ query: `keyword=${encodeURIComponent(sc.keyword)}` })
        }
      })
    }
  },
  methods: {
    onTapItem(e) {
      const item = e.currentTarget.dataset.item
      if (!item) return
      this._modelCtx.sendFollowUpMessage({
        content: [
          { type: 'text', text: `选择${item.name}` },
          { type: 'api/call', data: { name: 'selectDrink', arguments: { drinkId: item.drinkId } } }
        ]
      })
    },
    onTapMore() {
      this._viewCtx.openDetailPage({
        url: '/packageWeStoreCoffee/pages/home/home'
      })
    }
  }
})
