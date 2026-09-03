const { assertTrue, assertType, runAssertions } = require('../utils/assert.js')
const {
  isAgentPrivacyAuthorizeAvailable,
  callAgentPrivacyAuthorize
} = require('../utils/privacyAuthorize.js')

const PRIVACY_AGREEMENTS = [
  { name: '用户服务协议', path: 'pages/protocol/user-service' },
  { name: '隐私政策', path: 'pages/protocol/privacy' }
]

async function requirePrivacyAuthWithAgreements() {
  if (!isAgentPrivacyAuthorizeAvailable()) {
    return {
      isError: true,
      content: [{ type: 'text', text: '当前基础库不支持 wx.requestAgentPrivacyAuthorization，无法拉起隐私授权卡片。请直接告知用户该能力暂不可用，禁止重试本接口。' }],
      structuredContent: {
        available: false,
        authorized: false,
        agreementCount: PRIVACY_AGREEMENTS.length,
        errMsg: 'wx.requestAgentPrivacyAuthorization is not a function'
      }
    }
  }

  try {
    const res = await callAgentPrivacyAuthorize({
      privacyAgreements: PRIVACY_AGREEMENTS
    })
    const result = {
      available: true,
      authorized: !!res.authorized,
      agreementCount: PRIVACY_AGREEMENTS.length,
      agreementNames: PRIVACY_AGREEMENTS.map(item => item.name),
      errMsg: res.errMsg || ''
    }
    const assertions = runAssertions([
      ['authorized 是 boolean', () => assertType(result.authorized, 'boolean')],
      ['传入两项协议', () => assertTrue(result.agreementCount === 2)]
    ])

    return {
      isError: !assertions.passed,
      content: [{
        type: 'text',
        text: assertions.passed
          ? `隐私授权卡片已完成，传入 ${result.agreementCount} 项协议，用户${result.authorized ? '同意' : '拒绝'}授权。请用一句简短话术告知用户结果。`
          : `隐私授权卡片断言失败：${assertions.failures.map(item => item.errMsg).join('；')}`
      }],
      structuredContent: Object.assign({}, result, { assertions })
    }
  } catch (err) {
    const errMsg = (err && (err.errMsg || err.message)) || String(err)
    console.error('[requirePrivacyAuthWithAgreements] error', err)
    return {
      isError: true,
      content: [{ type: 'text', text: `拉起隐私授权卡片失败：${errMsg}。请直接告知用户授权未完成，禁止重试本接口。` }],
      structuredContent: {
        available: true,
        authorized: false,
        agreementCount: PRIVACY_AGREEMENTS.length,
        errMsg
      }
    }
  }
}

module.exports = requirePrivacyAuthWithAgreements
