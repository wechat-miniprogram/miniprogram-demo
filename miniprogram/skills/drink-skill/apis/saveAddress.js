const { setAddress, getActiveOrder, saveOrder, recalcOrderTotal } = require('../utils/storage.js')

function isPhone(p) {
  return typeof p === 'string' && /^1\d{10}$/.test(p)
}

async function saveAddress({ name, phone, detail } = {}) {
  try {
    if (!name || !String(name).trim()) {
      return { isError: true, content: [{ type: 'text', text: '缺少收货人姓名。请反问用户补充。' }] }
    }
    if (!isPhone(phone)) {
      return { isError: true, content: [{ type: 'text', text: '手机号格式不正确，需为 11 位数字。请反问用户确认手机号。' }] }
    }
    if (!detail || !String(detail).trim()) {
      return { isError: true, content: [{ type: 'text', text: '缺少详细地址。请反问用户补充。' }] }
    }

    const address = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      detail: String(detail).trim()
    }
    setAddress(address)

    const order = getActiveOrder()
    if (order) {
      order.address = address
      order.status = 'confirmed'
      recalcOrderTotal(order)
      saveOrder(order)

      const structuredContent = {
        success: true,
        orderId: order.orderId,
        items: order.items.map(it => ({ itemId: it.itemId, drinkName: it.drinkName, specText: it.specText, totalPrice: it.totalPrice })),
        itemCount: order.itemCount,
        totalPrice: order.totalPrice,
        needAddress: false,
        status: 'confirmed'
      }

      const handoffPayload = {
        orderId: order.orderId,
        items: order.items,
        itemCount: order.itemCount,
        totalPrice: order.totalPrice,
        address,
        needAddress: false,
        status: 'confirmed'
      }

      return {
        isError: false,
        content: [{
          type: 'text',
          text: `地址已保存，订单（共 ${order.itemCount} 件，合计 ¥${order.totalPrice}）已更新为 confirmed。请用一句简短话术引导用户点击下方小程序卡片进入结算页确认并支付。禁止以纯文本列出订单详情。`
        }],
        structuredContent,
        handoff: {
          query: `orderId=${order.orderId}`,
          payload: handoffPayload
        },
        _meta: {
          items: order.items,
          address
        }
      }
    }

    return {
      isError: false,
      content: [{ type: 'text', text: '地址已保存成功。' }],
      structuredContent: { success: true },
      _meta: {}
    }
  } catch (err) {
    console.error('[saveAddress] error', err)
    return {
      isError: true,
      content: [{ type: 'text', text: `保存地址失败：${err.message || '未知错误'}。` }]
    }
  }
}

module.exports = saveAddress
