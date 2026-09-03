const { getActiveOrder, getAddress, saveOrder, setActiveOrderId, recalcOrderTotal } = require('../utils/storage.js')
const { buildOrderItem } = require('../utils/sku.js')
const { genOrderId } = require('../utils/id.js')

async function addToOrder({ drinkId, specs } = {}) {
  try {
    if (!drinkId) {
      return {
        isError: true,
        content: [{ type: 'text', text: '缺少 drinkId。禁止编造，应先调用 selectDrink 获取有效 drinkId。' }]
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

    let order = getActiveOrder()
    const isNewOrder = !order
    if (isNewOrder) {
      order = {
        orderId: genOrderId(),
        items: [],
        itemCount: 0,
        totalPrice: 0,
        status: 'pending',
        createTime: new Date().toISOString()
      }
    }

    order.items = Array.isArray(order.items) ? order.items : []
    order.items.push(item)
    recalcOrderTotal(order)

    const address = order.address || getAddress()
    if (address) order.address = address
    const needAddress = !address
    order.status = needAddress ? 'pending' : 'confirmed'
    saveOrder(order)
    if (isNewOrder) setActiveOrderId(order.orderId)

    const structuredContent = {
      orderId: order.orderId,
      items: order.items.map(it => ({ itemId: it.itemId, drinkName: it.drinkName, specText: it.specText, totalPrice: it.totalPrice })),
      itemCount: order.itemCount,
      totalPrice: order.totalPrice,
      needAddress,
      status: order.status
    }

    const handoffPayload = {
      orderId: order.orderId,
      items: order.items,
      itemCount: order.itemCount,
      totalPrice: order.totalPrice,
      address: address || null,
      needAddress,
      status: order.status
    }

    const actionText = isNewOrder
      ? `已为用户新建订单并加入「${item.drinkName} ${item.specText}」，当前共 ${order.itemCount} 件，合计 ¥${order.totalPrice}。请用一句简短话术引导用户点击下方小程序卡片进入结算页查看已选商品并${needAddress ? '补充地址后' : ''}下单。禁止以纯文本列出订单详情。`
      : `已把「${item.drinkName} ${item.specText}」加入当前订单，现共 ${order.itemCount} 件，合计 ¥${order.totalPrice}。请用一句简短话术引导用户点击下方小程序卡片进入结算页查看已选商品并${needAddress ? '补充地址后' : ''}下单。禁止以纯文本列出订单详情。`

    return {
      isError: false,
      content: [{ type: 'text', text: actionText }],
      structuredContent,
      handoff: {
        query: `orderId=${order.orderId}`,
        payload: handoffPayload
      },
      _meta: {
        items: order.items,
        address: address || null,
        pendingOrderId: needAddress ? order.orderId : undefined
      }
    }
  } catch (err) {
    console.error('[addToOrder] error', err)
    return {
      isError: true,
      content: [{ type: 'text', text: `追加商品失败：${err.message || '未知错误'}。` }]
    }
  }
}

module.exports = addToOrder
