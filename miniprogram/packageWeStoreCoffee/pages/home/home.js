const { buildCatalog, CATEGORIES } = require('../../data/seed.js')

const CATALOG_VERSION = 3

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

Page({
  data: {
    categories: [],
    activeCategoryId: 0,
    items: [],
    title: '全部饮品',
    subTitle: '',
    searchKeyword: '',
    isSearching: false,
    headerPaddingTop: 88
  },

  onLoad(query) {
    this.setData({ headerPaddingTop: calcHeaderPaddingTop() })

    const keyword = query && query.keyword ? String(query.keyword) : ''

    try {
      const app = getApp()
      if (app && app.takeAgentHandoff) {
        const handoff = app.takeAgentHandoff(this.getPageId())
        if (handoff) console.log('[home] handoff', handoff)
      }
    } catch (e) {}

    const catalog = loadCatalog()
    this._catalog = catalog
    const categories = [{ id: 0, name: '全部' }].concat(CATEGORIES)

    let items = catalog
    let title = '全部饮品'
    let subTitle = `共 ${catalog.length} 款`
    let searchKeyword = ''
    let isSearching = false

    if (keyword) {
      const kw = keyword.toLowerCase()
      items = catalog.filter(d =>
        d.name.toLowerCase().includes(kw) ||
        d.categoryName.toLowerCase().includes(kw) ||
        (d.description || '').toLowerCase().includes(kw)
      )
      title = `「${keyword}」搜索结果`
      subTitle = `共 ${items.length} 款`
      searchKeyword = keyword
      isSearching = true
    }

    this.setData({ categories, activeCategoryId: 0, items, title, subTitle, searchKeyword, isSearching })
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value })
  },

  onSearchConfirm() {
    this.runSearch()
  },

  runSearch() {
    const kw = (this.data.searchKeyword || '').trim()
    if (!kw) {
      this.onClearSearch()
      return
    }
    const lower = kw.toLowerCase()
    const items = this._catalog.filter(d =>
      d.name.toLowerCase().includes(lower) ||
      d.categoryName.toLowerCase().includes(lower) ||
      (d.description || '').toLowerCase().includes(lower)
    )
    this.setData({
      isSearching: true,
      items,
      title: `「${kw}」搜索结果`,
      subTitle: `共 ${items.length} 款`
    })
  },

  onClearSearch() {
    this.setData({
      searchKeyword: '',
      isSearching: false,
      activeCategoryId: 0,
      items: this._catalog,
      title: '全部饮品',
      subTitle: `共 ${this._catalog.length} 款`
    })
  },

  onTapCategory(e) {
    const id = Number(e.currentTarget.dataset.id)
    const items = id === 0
      ? this._catalog
      : this._catalog.filter(d => d.categoryId === id)
    this.setData({ activeCategoryId: id, items, subTitle: `共 ${items.length} 款` })
  },

  onTapDrink(e) {
    const item = e.currentTarget.dataset.item
    if (!item) return
    wx.navigateTo({ url: `/packageWeStoreCoffee/pages/sku-picker/sku-picker?drinkId=${item.id}` })
  }
})
