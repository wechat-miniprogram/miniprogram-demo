const { assertType, runAssertions } = require('../utils/assert.js')
const {
  isAgentPrivacyAuthorizeAvailable,
  callAgentPrivacyAuthorize
} = require('../utils/privacyAuthorize.js')

const MIXED_AGREEMENTS = [
  { name: '  用户服务协议  ', path: '  pages/protocol/user-service  ' },
  { name: '', path: 'pages/protocol/privacy' },
  { name: '隐私政策', path: '   ' },
  null,
  'invalid-item'
]

async function requirePrivacyAuthInvalidAgreements() {
  if (!isAgentPrivacyAuthorizeAvailable()) {
    return {
      isError: true,
      content: [{ type: 'text', text: '当前基础库不支持 wx.requestAgentPrivacyAuthorization，无法验证协议清洗。请直接告知用户该能力暂不可用，禁止重试本接口。' }],
      structuredContent: {
        available: false,
        authorized: false,
        inputAgreementCount: MIXED_AGREEMENTS.length,
        expectedValidCount: 1,
        errMsg: 'wx.requestAgentPrivacyAuthorization is not a function'
      }
    }
  }

  try {
    const res = await callAgentPrivacyAuthorize({
      privacyAgreements: MIXED_AGREEMENTS
    })
    const result = {
      available: true,
      authorized: !!res.authorized,
      inputAgreementCount: MIXED_AGREEMENTS.length,
      expectedValidCount: 1,
      expectedAgreementName: '用户服务协议',
      errMsg: res.errMsg || ''
    }
    const assertions = runAssertions([
      ['非法协议项未导致调用失败', () => assertType(result.authorized, 'boolean')]
    ])

    return {
      isError: !assertions.passed,
      content: [{
        type: 'text',
        text: assertions.passed
          ? `协议清洗用例已完成：输入 ${result.inputAgreementCount} 项，卡片应仅显示 1 个有效协议链接「${result.expectedAgreementName}」。请结合卡片显示确认清洗结果。`
          : `协议清洗用例断言失败：${assertions.failures.map(item => item.errMsg).join('；')}`
      }],
      structuredContent: Object.assign({}, result, { assertions })
    }
  } catch (err) {
    const errMsg = (err && (err.errMsg || err.message)) || String(err)
    console.error('[requirePrivacyAuthInvalidAgreements] error', err)
    return {
      isError: true,
      content: [{ type: 'text', text: `协议清洗用例失败：${errMsg}。请直接告知用户验证未完成，禁止重试本接口。` }],
      structuredContent: {
        available: true,
        authorized: false,
        inputAgreementCount: MIXED_AGREEMENTS.length,
        expectedValidCount: 1,
        errMsg
      }
    }
  }
}

module.exports = requirePrivacyAuthInvalidAgreements
