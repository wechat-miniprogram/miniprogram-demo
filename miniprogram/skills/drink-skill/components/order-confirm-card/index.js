Component({
  data: {
    orderId: '',
    drinkName: '',
    specText: '',
    totalPrice: 0,
    basePrice: 0,
    extraPrice: 0,
    imageUrl: '',
    address: null,
    hasAddress: false,
    hint: ''
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
        const addr = meta.address || null
        this.setData({
          orderId: sc.orderId || '',
          drinkName: sc.drinkName || '',
          specText: sc.specText || '',
          totalPrice: sc.totalPrice || 0,
          basePrice: meta.basePrice || 0,
          extraPrice: meta.extraPrice || 0,
          imageUrl: meta.imageUrl || '',
          address: addr,
          hasAddress: !!addr,
          hint: sc.needAddress ? '请先添加收货地址' : ''
        })
        if (sc.orderId) {
          this._viewCtx.setRelatedPage({ query: `orderId=${sc.orderId}` })
        }
      })
    }
  },
  methods: {
    onTapPay() {
    },
    onTapAddress() {
    }
  }
})
