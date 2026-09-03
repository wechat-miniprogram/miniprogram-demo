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

function loadOrder(orderId) {
  if (!orderId) return null
  try {
    const orders = wx.getStorageSync(`orders_${getOpenid()}`) || []
    return orders.find(o => o.orderId === orderId) || null
  } catch (e) {
    return null
  }
}

function saveOrder(order) {
  try {
    const key = `orders_${getOpenid()}`
    const orders = wx.getStorageSync(key) || []
    const idx = orders.findIndex(o => o.orderId === order.orderId)
    if (idx >= 0) orders[idx] = order
    else orders.push(order)
    wx.setStorageSync(key, orders)
  } catch (e) {}
}

function normalizeOrder(order) {
  if (!order) return order
  if (!Array.isArray(order.items)) {
    if (order.drinkName || order.drinkId) {
      order.items = [{
        drinkId: order.drinkId,
        drinkName: order.drinkName,
        imageUrl: order.imageUrl,
        specs: order.specs,
        specText: order.specText,
        basePrice: order.basePrice,
        extraPrice: order.extraPrice,
        totalPrice: order.totalPrice
      }]
    } else {
      order.items = []
    }
  }
  order.itemCount = order.items.length
  order.totalPrice = order.items.reduce((sum, it) => sum + (Number(it.totalPrice) || 0), 0)
  return order
}

function clearActiveOrderId() {
  try { wx.removeStorageSync(`active_order_${getOpenid()}`) } catch (e) {}
}

function buildDisplayItems(order) {
  const items = (order && Array.isArray(order.items)) ? order.items : []
  const map = {}
  const list = []
  items.forEach(it => {
    const key = `${it.drinkName}||${it.specText || ''}`
    if (map[key]) {
      map[key].qty += 1
      map[key].lineTotal += Number(it.totalPrice) || 0
    } else {
      const row = {
        drinkName: it.drinkName,
        specText: it.specText,
        imageUrl: it.imageUrl,
        unitPrice: Number(it.totalPrice) || 0,
        qty: 1,
        lineTotal: Number(it.totalPrice) || 0
      }
      map[key] = row
      list.push(row)
    }
  })
  return list
}

Page({
  data: {
    order: null,
    displayItems: [],
    address: null,
    paying: false,
    paid: false,
    headerPaddingTop: 88,
    navBackTop: 88,
    navBackSize: 64
  },

  onLoad(query) {
    const nb = calcNavBack()
    this.setData({ headerPaddingTop: calcHeaderPaddingTop(), navBackTop: nb.top, navBackSize: nb.size })

    const orderId = query && query.orderId ? String(query.orderId) : ''

    let payload = null
    try {
      const app = getApp()
      if (app && app.takeAgentHandoff) {
        const handoff = app.takeAgentHandoff(this.getPageId())
        payload = handoff && handoff.payload
        if (handoff) console.log('[checkout] handoff', handoff)
      }
    } catch (e) {}

    let order = loadOrder(orderId)
    if (payload && payload.orderId) {
      order = Object.assign({}, order || {}, payload)
      saveOrder(order)
    }

    if (!order || !order.orderId) {
      wx.showToast({ title: '订单不存在', icon: 'none' })
      return
    }

    normalizeOrder(order)

    const address = order.address || this._readStoredAddress()
    if (address && !order.address) {
      order.address = address
      order.status = 'confirmed'
      saveOrder(order)
    }

    this.setData({
      order,
      displayItems: buildDisplayItems(order),
      address: address || null,
      paid: order.status === 'paid'
    })
  },

  onTapBack() {
    const pages = getCurrentPages()
    if (pages && pages.length > 1) {
      wx.navigateBack({ delta: 1 })
    } else {
      wx.reLaunch({ url: '/packageWeStoreCoffee/pages/home/home' })
    }
  },

  _readStoredAddress() {
    try {
      return wx.getStorageSync(`address_${getOpenid()}`) || null
    } catch (e) {
      return null
    }
  },

  onTapChooseAddress() {
    if (!wx.chooseAddress) {
      wx.showToast({ title: '当前环境不支持选择地址', icon: 'none' })
      return
    }
    wx.chooseAddress({
      success: (res) => {
        const detail = (res.provinceName || '') + (res.cityName || '') + (res.countyName || '') + (res.detailInfo || '')
        const address = { name: res.userName, phone: res.telNumber, detail }
        try { wx.setStorageSync(`address_${getOpenid()}`, address) } catch (e) {}
        const order = Object.assign({}, this.data.order, { address, status: 'confirmed' })
        saveOrder(order)
        this.setData({ address, order })
      },
      fail: () => {
        wx.showToast({ title: '未选择地址', icon: 'none' })
      }
    })
  },

  onTapPay() {
    const { order, address, paying } = this.data
    if (paying) return
    if (!order) return
    if (!address) {
      wx.showToast({ title: '请先选择收货地址', icon: 'none' })
      return
    }
    this.setData({ paying: true })

    const finishPaid = (method) => {
      const paid = Object.assign({}, order, {
        status: 'paid',
        payTime: new Date().toISOString(),
        payMethod: method
      })
      saveOrder(paid)
      clearActiveOrderId()
      this.setData({ paying: false, paid: true, order: paid })
      wx.showToast({ title: '支付成功', icon: 'success' })
    }

    if (!wx.requestPayment) {
      finishPaid('mock')
      return
    }
    // 注意：以下为演示用占位参数
    wx.requestPayment({
      timeStamp: String(Math.floor(Date.now() / 1000)),
      nonceStr: 'demo_' + Math.random().toString(36).slice(2, 10),
      package: 'prepay_id=demo_prepay',
      signType: 'RSA',
      paySign: 'demo_sign',
      success: () => finishPaid('wxpay'),
      fail: () => finishPaid('mock')
    })
  },

  onTapBackHome() {
    wx.reLaunch({ url: '/packageWeStoreCoffee/pages/home/home' })
  }
})
