const { getCatalog } = require('../utils/storage.js')

async function searchDrinks({ keyword } = {}) {
  try {
    const hasKw = !!(keyword && typeof keyword === 'string' && keyword.trim())
    const catalog = getCatalog()

    const matched = hasKw
      ? (() => {
          const kw = keyword.trim().toLowerCase()
          return catalog.filter(d =>
            d.name.toLowerCase().includes(kw) ||
            d.categoryName.toLowerCase().includes(kw) ||
            (d.description || '').toLowerCase().includes(kw)
          )
        })()
      : catalog

    if (hasKw && !matched.length) {
      return {
        isError: true,
        content: [{
          type: 'text',
          text: `未在商品库中匹配到包含「${keyword}」的饮品记录。禁止编造商品名再次调用本接口。正确出口：引导用户换个关键词（如拿铁、美式、奶咖、水果茶）重新搜索，或不带关键词调用本接口浏览全部饮品。`
        }]
      }
    }

    const picked = matched

    const items = picked.map(d => ({
      drinkId: d.id,
      name: d.name,
      price: d.price,
      categoryName: d.categoryName,
      description: d.description,
      pagePath: 'packageWeStoreCoffee/pages/sku-picker/sku-picker?drinkId='+ d.id
    }))

    const viewItems = picked.map(d => ({
      drinkId: d.id,
      name: d.name,
      price: d.price,
      categoryName: d.categoryName,
      description: d.description,
      imageUrl: d.imageUrl
    }))

    return {
      isError: false,
      content: [{
        type: 'text',
        text: hasKw
          ? `已搜索到 ${matched.length} 款匹配「${keyword}」的饮品。本次检索已完成，请直接用一句简短话术引导用户点击下方小程序卡片，在结果列表中自行挑选。【必须遵守】本轮禁止再次调用检索、也禁止自行编写代码对本批饮品逐条比对筛选。若用户指定的具体饮品名与结果中任何一款都不完全相同（例如用户想要名字恰好叫「拿铁」的，但结果里只有「焦糖蜂窝拿铁」这类带前缀的），说明该店没有完全同名的商品，此时必须直接展示本批结果卡片，并用一句话向用户说明没有完全同名的商品、请其从相近结果中挑选，严禁反复重新搜索。禁止以纯文本列出饮品详情。`
          : `已为用户列出全部 ${matched.length} 款饮品。请用一句简短话术引导用户点击下方小程序卡片进入完整列表挑选。禁止以纯文本列出饮品详情。`
      }],
      structuredContent: {
        items,
        total: matched.length,
        hasMore: matched.length > picked.length,
        keyword: hasKw ? keyword : null
      },
      handoff: {
        query: hasKw ? `keyword=${encodeURIComponent(keyword)}` : '',
        payload: { items: viewItems, keyword: hasKw ? keyword : null }
      },
      _meta: {
        viewItems
      }
    }
  } catch (err) {
    console.error('[searchDrinks] error', err)
    return {
      isError: true,
      content: [{ type: 'text', text: `搜索失败：${err.message || '未知错误'}。请引导用户稍后重试。` }]
    }
  }
}

module.exports = searchDrinks
