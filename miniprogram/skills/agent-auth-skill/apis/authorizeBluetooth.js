const { assertType, runAssertions } = require('../utils/assert.js')
const { wxCall, errMsgOf } = require('../utils/wxCall.js')

const SCOPE = 'scope.bluetooth'

async function authorizeBluetooth() {
  if (typeof wx.authorize !== 'function') {
    return {
      isError: true,
      content: [{ type: 'text', text: '当前基础库不支持 wx.authorize，无法发起蓝牙授权。请直接告知用户该能力暂不可用，禁止重试本接口。' }],
      structuredContent: {
        available: false,
        authorized: false,
        scope: SCOPE,
        errMsg: 'wx.authorize is not a function'
      }
    }
  }

  try {
    const res = await wxCall(wx.authorize, { scope: SCOPE })
    const result = {
      available: true,
      authorized: true,
      scope: SCOPE,
      errMsg: (res && res.errMsg) || 'authorize:ok'
    }
    const assertions = runAssertions([
      ['errMsg 是 string', () => assertType(result.errMsg, 'string')]
    ])

    return {
      isError: !assertions.passed,
      content: [{
        type: 'text',
        text: assertions.passed
          ? '用户已同意蓝牙授权（scope.bluetooth）。请用一句简短话术告知用户授权完成。'
          : `蓝牙授权断言失败：${assertions.failures.map(item => item.errMsg).join('；')}`
      }],
      structuredContent: Object.assign({}, result, { assertions })
    }
  } catch (err) {
    const errMsg = errMsgOf(err)
    console.error('[authorizeBluetooth] error', err)
    return {
      isError: true,
      content: [{ type: 'text', text: `蓝牙授权失败：${errMsg}。请用一句简短话术告知用户未获得蓝牙权限，禁止重复发起授权。` }],
      structuredContent: {
        available: true,
        authorized: false,
        scope: SCOPE,
        errMsg
      }
    }
  }
}

module.exports = authorizeBluetooth
