const { getAddress, saveOrder, setActiveOrderId } = require('../utils/storage.js')
const { buildOrderItem } = require('../utils/sku.js')
const { genOrderId } = require('../utils/id.js')

async function createOrder({ drinkId, specs } = {}) {
  try {
    if (!drinkId) {
      return {
        isError: true,
        content: [{ type: 'text', text: '缺少 drinkId。禁止编造，应先调用 selectDrink。' }]
      }
    }

    const built = buildOrderItem(drinkId, specs)
    if (!built.valid) {
      const isSpecErr = /不支持|不合法|可选/.test(built.error || '')
      const text = isSpecErr
        ? `规格不合法：${built.error}。禁止再次使用相同无效值重试。正确出口：引导用户通过饮品详情卡片上的"选规格"按钮打开半屏重新选择。`
        : `未找到 drinkId=${drinkId} 的饮品。禁止编造 ID，应先调用 selectDrink 获取有效 drinkId。`
      return { isError: true, content: [{ type: 'text', text }] }
    }

    const item = built.item
    const orderId = genOrderId()
    const order = {
      orderId,
      items: [item],
      itemCount: 1,
      totalPrice: item.totalPrice,
      status: 'pending',
      createTime: new Date().toISOString()
    }

    const address = getAddress()
    if (address) order.address = address
    saveOrder(order)
    setActiveOrderId(orderId)

    const needAddress = !address
    order.status = needAddress ? 'pending' : 'confirmed'
    saveOrder(order)

    const structuredContent = {
      orderId,
      items: order.items.map(it => ({ itemId: it.itemId, drinkName: it.drinkName, specText: it.specText, totalPrice: it.totalPrice })),
      itemCount: order.itemCount,
      totalPrice: order.totalPrice,
      needAddress,
      status: order.status
    }

    const handoffPayload = {
      orderId,
      items: order.items,
      itemCount: order.itemCount,
      totalPrice: order.totalPrice,
      address: address || null,
      needAddress,
      status: order.status
    }

    const actionText = needAddress
      ? `已为用户新建订单（${item.drinkName} ${item.specText}，¥${item.totalPrice}），尚未填写收货地址。请用一句简短话术引导用户点击下方小程序卡片进入结算页补充地址并下单。禁止以纯文本列出订单详情。`
      : `已为用户新建并确认订单（${item.drinkName} ${item.specText}，¥${item.totalPrice}）。请用一句简短话术引导用户点击下方小程序卡片进入结算页确认并支付。禁止以纯文本列出订单详情。【地址处理规则】收货地址由用户在结算页内自行选择填写，本轮不需要保存地址。即使用户提到了配送地点（如『送到公司』『送到家』），只要没有同时给出完整的收货人姓名和手机号，就不要保存地址，也禁止把收货人姓名/手机号编造成占位值去保存；直接引导用户点击卡片进入结算页填写收货信息即可。`

    return {
      isError: false,
      content: [{ type: 'text', text: actionText }],
      structuredContent,
      handoff: {
        query: `orderId=${orderId}`,
        payload: handoffPayload
      },
      _meta: {
        items: order.items,
        address: address || null,
        pendingOrderId: needAddress ? orderId : undefined
      }
    }
  } catch (err) {
    console.error('[createOrder] error', err)
    return {
      isError: true,
      content: [{ type: 'text', text: `新建订单失败：${err.message || '未知错误'}。` }]
    }
  }
}

module.exports = createOrder
