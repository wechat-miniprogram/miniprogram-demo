const { getActiveOrder, saveOrder, clearActiveOrderId } = require('../utils/storage.js')

async function cancelOrder() {
  try {
    const order = getActiveOrder()
    if (!order || !Array.isArray(order.items) || !order.items.length) {
      return {
        isError: true,
        content: [{ type: 'text', text: '当前没有进行中的订单，无需取消。请直接告知用户暂无可取消的订单，禁止重试本接口。' }]
      }
    }

    const canceledCount = order.items.length
    order.items = []
    order.itemCount = 0
    order.totalPrice = 0
    order.status = 'canceled'
    order.cancelTime = new Date().toISOString()
    saveOrder(order)
    clearActiveOrderId()

    return {
      isError: false,
      content: [{
        type: 'text',
        text: `已取消当前订单（原有 ${canceledCount} 件商品已全部清空）。请用一句简短话术告知用户订单已取消，并引导用户点击下方小程序卡片回首页重新挑选下单。禁止以纯文本列出订单详情。`
      }],
      structuredContent: {
        success: true,
        orderId: order.orderId,
        canceledCount,
        status: 'canceled'
      },
      handoff: {
        query: ''
      },
      _meta: {}
    }
  } catch (err) {
    console.error('[cancelOrder] error', err)
    return {
      isError: true,
      content: [{ type: 'text', text: `取消订单失败：${err.message || '未知错误'}。` }]
    }
  }
}

module.exports = cancelOrder
