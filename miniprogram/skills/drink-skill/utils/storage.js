const { buildCatalog, CATEGORIES } = require('../data/seed.js')

const CATALOG_KEY = 'drinks_catalog'
const CATEGORIES_KEY = 'drinks_categories'
const CATALOG_VERSION_KEY = 'drinks_catalog_version'
const CATALOG_VERSION = 3

function getOpenid() {
  const userInfo = wx.getStorageSync('userInfo')
  return (userInfo && userInfo.openid) ? userInfo.openid : 'anonymous'
}

function ensureCatalog() {
  let catalog = wx.getStorageSync(CATALOG_KEY)
  const version = wx.getStorageSync(CATALOG_VERSION_KEY)
  if (!catalog || !catalog.length || version !== CATALOG_VERSION) {
    catalog = buildCatalog()
    wx.setStorageSync(CATALOG_KEY, catalog)
    wx.setStorageSync(CATEGORIES_KEY, CATEGORIES)
    wx.setStorageSync(CATALOG_VERSION_KEY, CATALOG_VERSION)
    console.log('[drink-skill][storage] catalog seeded v' + CATALOG_VERSION, catalog.length)
  }
  return catalog
}

function getCatalog() {
  return ensureCatalog()
}

function getCategories() {
  ensureCatalog()
  return wx.getStorageSync(CATEGORIES_KEY) || CATEGORIES
}

function findDrink(drinkId) {
  const catalog = getCatalog()
  return catalog.find(d => d.id === Number(drinkId))
}

function getAddress() {
  const openid = getOpenid()
  return wx.getStorageSync(`address_${openid}`) || null
}

function setAddress(addr) {
  const openid = getOpenid()
  wx.setStorageSync(`address_${openid}`, addr)
}

function getOrders() {
  const openid = getOpenid()
  return wx.getStorageSync(`orders_${openid}`) || []
}

function saveOrder(order) {
  const openid = getOpenid()
  const orders = getOrders()
  const idx = orders.findIndex(o => o.orderId === order.orderId)
  if (idx >= 0) orders[idx] = order
  else orders.push(order)
  wx.setStorageSync(`orders_${openid}`, orders)
}

function findOrder(orderId) {
  const orders = getOrders()
  return orders.find(o => o.orderId === orderId) || null
}

function getActiveOrderId() {
  const openid = getOpenid()
  return wx.getStorageSync(`active_order_${openid}`) || null
}

function setActiveOrderId(orderId) {
  const openid = getOpenid()
  wx.setStorageSync(`active_order_${openid}`, orderId)
}

function clearActiveOrderId() {
  const openid = getOpenid()
  wx.removeStorageSync(`active_order_${openid}`)
}

function getActiveOrder() {
  const id = getActiveOrderId()
  if (!id) return null
  const order = findOrder(id)
  if (!order || order.status === 'paid') return null
  return order
}

function recalcOrderTotal(order) {
  const items = Array.isArray(order.items) ? order.items : []
  order.totalPrice = items.reduce((sum, it) => sum + (Number(it.totalPrice) || 0), 0)
  order.itemCount = items.length
  return order
}

module.exports = {
  getOpenid,
  getCatalog,
  getCategories,
  findDrink,
  getAddress,
  setAddress,
  getOrders,
  saveOrder,
  findOrder,
  getActiveOrderId,
  setActiveOrderId,
  clearActiveOrderId,
  getActiveOrder,
  recalcOrderTotal
}
