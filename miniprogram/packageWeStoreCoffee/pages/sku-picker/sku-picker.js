const { buildCatalog } = require('../../data/seed.js')

const CATALOG_VERSION = 3

const DEFAULT_SINGLE_SPEC = { temperature: 'ice', sugar: 'normal', cupSize: 'medium' }

function loadCatalog() {
  const cached = wx.getStorageSync('drinks_catalog')
  const version = wx.getStorageSync('drinks_catalog_version')
  if (cached && cached.length && version === CATALOG_VERSION) return cached
  const fresh = buildCatalog()
  try {
    wx.setStorageSync('drinks_catalog', fresh)
    wx.setStorageSync('drinks_catalog_version', CATALOG_VERSION)
  } catch (e) {}
  return fresh
}

function calcHeaderPaddingTop() {
  try {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    const statusBar = (info && info.statusBarHeight) || 20
    let capsuleBottom = statusBar + 44
    if (wx.getMenuButtonBoundingClientRect) {
      const rect = wx.getMenuButtonBoundingClientRect()
      if (rect && rect.bottom) capsuleBottom = rect.bottom + 8
    }
    const winWidth = (info && info.windowWidth) || 375
    return Math.max(Math.round(capsuleBottom * 750 / winWidth), 64)
  } catch (e) {
    return 88
  }
}

function calcNavBack() {
  try {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    const winWidth = (info && info.windowWidth) || 375
    const px2rpx = (px) => Math.round(px * 750 / winWidth)
    let top = ((info && info.statusBarHeight) || 20) + 6
    let size = 32
    if (wx.getMenuButtonBoundingClientRect) {
      const rect = wx.getMenuButtonBoundingClientRect()
      if (rect && rect.top) {
        top = rect.top
        size = rect.height || 32
      }
    }
    return { top: px2rpx(top), size: px2rpx(size) }
  } catch (e) {
    return { top: 88, size: 64 }
  }
}

function getOpenid() {
  const userInfo = wx.getStorageSync('userInfo')
  return (userInfo && userInfo.openid) ? userInfo.openid : 'anonymous'
}

Page({
  data: {
    drink: null,
    dimensions: [],
    totalPrice: 0,
    extraPrice: 0,
    specTextPreview: '',
    headerPaddingTop: 88,
    navBackTop: 88,
    navBackSize: 64,
    hasActiveOrder: false,
    activeItemCount: 0
  },

  onLoad(query) {
    const nb = calcNavBack()
    this.setData({ headerPaddingTop: calcHeaderPaddingTop(), navBackTop: nb.top, navBackSize: nb.size })

    let drinkId = query && query.drinkId ? Number(query.drinkId) : 0

    let payload = null
    try {
      const app = getApp()
      if (app && app.takeAgentHandoff) {
        const handoff = app.takeAgentHandoff(this.getPageId())
        payload = handoff && handoff.payload
        if (handoff) {
          console.log('[sku-picker] handoff', handoff)
          if (!drinkId && payload && payload.drinkId) drinkId = Number(payload.drinkId)
        }
      }
    } catch (e) {}

    if (!drinkId) {
      try { drinkId = Number(wx.getStorageSync('current_sku_drink_id')) || 0 } catch (e) {}
    }

    let drink = null
    if (payload && payload.drinkId && Number(payload.drinkId) === drinkId && payload.skuSchema) {
      drink = {
        id: payload.drinkId,
        name: payload.name,
        price: payload.price,
        description: payload.description,
        categoryName: payload.categoryName,
        imageUrl: payload.imageUrl,
        skuSchema: payload.skuSchema
      }
    } else {
      const catalog = loadCatalog()
      drink = catalog.find(d => d.id === drinkId)
    }

    if (!drink) {
      wx.showToast({ title: '商品不存在', icon: 'none' })
      return
    }

    const schema = drink.skuSchema || { dimensions: [] }
    const dims = schema.dimensions.map(dim => {
      const defVal = DEFAULT_SINGLE_SPEC[dim.key] || (dim.options[0] && dim.options[0].value)
      return {
        key: dim.key,
        label: dim.label,
        multiple: !!dim.multiple,
        selectedValue: dim.multiple ? null : defVal,
        selectedValues: dim.multiple ? [] : null,
        options: dim.options
      }
    })
    this.setData({ drink, dimensions: dims })
    this._recalc()
    this._checkActiveOrder()
  },

  _checkActiveOrder() {
    try {
      const openid = getOpenid()
      const orders = wx.getStorageSync(`orders_${openid}`) || []
      const activeId = wx.getStorageSync(`active_order_${openid}`)
      const order = activeId ? orders.find(o => o.orderId === activeId) : null
      const items = order && order.status !== 'paid' && Array.isArray(order.items) ? order.items : []
      this.setData({ hasActiveOrder: items.length > 0, activeItemCount: items.length })
    } catch (e) {
      this.setData({ hasActiveOrder: false, activeItemCount: 0 })
    }
  },

  onTapBack() {
    const pages = getCurrentPages()
    if (pages && pages.length > 1) {
      wx.navigateBack({ delta: 1 })
    } else {
      wx.reLaunch({ url: '/packageWeStoreCoffee/pages/home/home' })
    }
  },

  onTapOption(e) {
    const { dimKey, value } = e.currentTarget.dataset
    const dims = this.data.dimensions.map(d => {
      if (d.key !== dimKey) return d
      if (d.multiple) {
        const list = [...(d.selectedValues || [])]
        const idx = list.indexOf(value)
        if (idx >= 0) list.splice(idx, 1)
        else list.push(value)
        return { ...d, selectedValues: list }
      }
      return { ...d, selectedValue: value }
    })
    this.setData({ dimensions: dims })
    this._recalc()
  },

  _recalc() {
    const { drink, dimensions } = this.data
    if (!drink) return
    let extra = 0
    const labels = []
    const nextDims = dimensions.map(dim => {
      const options = dim.options.map(opt => {
        const selected = dim.multiple
          ? (dim.selectedValues || []).indexOf(opt.value) >= 0
          : dim.selectedValue === opt.value
        return Object.assign({}, opt, { _selected: selected })
      })
      if (dim.multiple) {
        const names = []
        for (const opt of options) {
          if (opt._selected) {
            extra += (opt.extraPrice || 0)
            names.push(opt.label)
          }
        }
        if (names.length) labels.push(`${dim.label}:${names.join('+')}`)
      } else {
        const opt = options.find(o => o._selected)
        if (opt) {
          extra += (opt.extraPrice || 0)
          labels.push(opt.label)
        }
      }
      return Object.assign({}, dim, { options })
    })
    this.setData({
      dimensions: nextDims,
      extraPrice: extra,
      totalPrice: drink.price + extra,
      specTextPreview: labels.join(' / ')
    })
  },

  onTapConfirm(e) {
    const mode = (e && e.currentTarget && e.currentTarget.dataset.mode) || 'append'
    const { drink, dimensions, specTextPreview, totalPrice, extraPrice } = this.data
    if (!drink) return
    for (const dim of dimensions) {
      if (!dim.multiple && !dim.selectedValue) {
        wx.showToast({ title: `请选择${dim.label}`, icon: 'none' })
        return
      }
    }

    const item = {
      itemId: 'IT' + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 1e4).toString(36).toUpperCase(),
      drinkId: drink.id,
      drinkName: drink.name,
      imageUrl: drink.imageUrl,
      specText: specTextPreview,
      basePrice: drink.price,
      extraPrice,
      totalPrice
    }

    let orderId
    try {
      const openid = getOpenid()
      const ordersKey = `orders_${openid}`
      const activeKey = `active_order_${openid}`
      const orders = wx.getStorageSync(ordersKey) || []
      const activeId = wx.getStorageSync(activeKey)

      let order = null
      if (mode !== 'new' && activeId) {
        const found = orders.find(o => o.orderId === activeId)
        if (found && found.status !== 'paid') order = found
      }

      if (order) {
        order.items = Array.isArray(order.items) ? order.items : []
        order.items.push(item)
      } else {
        order = {
          orderId: 'LOCAL_' + Date.now(),
          items: [item],
          status: 'pending',
          createTime: new Date().toISOString()
        }
        orders.push(order)
      }
      order.itemCount = order.items.length
      order.totalPrice = order.items.reduce((sum, it) => sum + (Number(it.totalPrice) || 0), 0)

      const idx = orders.findIndex(o => o.orderId === order.orderId)
      if (idx >= 0) orders[idx] = order
      wx.setStorageSync(ordersKey, orders)
      wx.setStorageSync(activeKey, order.orderId)
      orderId = order.orderId
    } catch (err) {
      console.warn('[sku-picker] save order fail', err)
      orderId = 'LOCAL_' + Date.now()
    }

    wx.navigateTo({ url: `/packageWeStoreCoffee/pages/checkout/checkout?orderId=${orderId}` })
  }
})
