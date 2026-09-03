const { findDrink } = require('../utils/storage.js')

async function selectDrink({ drinkId } = {}) {
  try {
    if (!drinkId) {
      return {
        isError: true,
        content: [{ type: 'text', text: '缺少 drinkId。禁止编造 ID 再次调用本接口。正确出口：先调用 searchDrinks 获取可用 drinkId。' }]
      }
    }
    const drink = findDrink(drinkId)
    if (!drink) {
      return {
        isError: true,
        content: [{
          type: 'text',
          text: `未在商品库中找到 drinkId=${drinkId} 的饮品记录。禁止编造其他 ID 再次调用本接口，禁止从用户自然语言推断 ID。正确出口：调用 searchDrinks 获取有效的 drinkId。`
        }]
      }
    }

    try { wx.setStorageSync('current_sku_drink_id', drink.id) } catch (e) {}

    const specOptions = {}
    drink.skuSchema.dimensions.forEach(d => {
      specOptions[d.key] = {
        label: d.label,
        multiple: !!d.multiple,
        options: d.options.map(o => ({ value: o.value, label: o.label, extraPrice: o.extraPrice || 0 }))
      }
    })

    return {
      isError: false,
      content: [{
        type: 'text',
        text: `已加载饮品「${drink.name}」详情（基础价 ¥${drink.price}）。请用一句简短话术引导用户点击下方小程序卡片进入饮品详情页，在页面内选规格并下单。禁止以纯文本列出商品详情。`
      }],
      structuredContent: {
        drinkId: drink.id,
        name: drink.name,
        price: drink.price,
        description: drink.description,
        categoryName: drink.categoryName,
        specOptions
      },
      handoff: {
        query: `drinkId=${drink.id}`,
        payload: {
          drinkId: drink.id,
          name: drink.name,
          price: drink.price,
          description: drink.description,
          categoryName: drink.categoryName,
          imageUrl: drink.imageUrl,
          skuSchema: drink.skuSchema
        }
      },
      _meta: {
        imageUrl: drink.imageUrl,
        skuSchema: drink.skuSchema
      }
    }
  } catch (err) {
    console.error('[selectDrink] error', err)
    return {
      isError: true,
      content: [{ type: 'text', text: `选择饮品失败：${err.message || '未知错误'}。` }]
    }
  }
}

module.exports = selectDrink
