const { getActiveOrder, getAddress } = require('../utils/storage.js')

async function viewOrder() {
  try {
    const order = getActiveOrder()
    if (!order || !Array.isArray(order.items) || !order.items.length) {
      return {
        isError: true,
        content: [{ type: 'text', text: '当前没有进行中的订单可查看。请直接告知用户暂无进行中的订单，可先点单后再查看，禁止重试本接口。' }]
      }
    }

    const address = order.address || getAddress()
    const needAddress = !address

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

    return {
      isError: false,
      content: [{
        type: 'text',
        text: `已为用户调出当前订单（共 ${order.itemCount} 件，合计 ¥${order.totalPrice}）。请用一句简短话术引导用户点击下方小程序卡片进入结算页查看订单详情${needAddress ? '并补充收货地址' : ''}。禁止以纯文本列出订单详情。`
      }],
      structuredContent,
      handoff: {
        query: `orderId=${order.orderId}`,
        payload: handoffPayload
      },
      _meta: {
        items: order.items,
        address: address || null
      }
    }
  } catch (err) {
    console.error('[viewOrder] error', err)
    return {
      isError: true,
      content: [{ type: 'text', text: `查看订单失败：${err.message || '未知错误'}。` }]
    }
  }
}

module.exports = viewOrder
