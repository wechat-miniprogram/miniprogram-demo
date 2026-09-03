const { assertEquals, assertTrue, assertType, runAssertions } = require('../utils/assert.js')
const {
  isAgentPrivacyAuthorizeAvailable,
  callAgentPrivacyAuthorize
} = require('../utils/privacyAuthorize.js')

const FIRST_AGREEMENTS = [
  { name: '用户服务协议', path: 'pages/protocol/user-service' }
]
const LATER_AGREEMENTS = [
  { name: '隐私政策', path: 'pages/protocol/privacy' }
]

async function requirePrivacyAuthConcurrent() {
  if (!isAgentPrivacyAuthorizeAvailable()) {
    return {
      isError: true,
      content: [{ type: 'text', text: '当前基础库不支持 wx.requestAgentPrivacyAuthorization，无法验证并发共享。请直接告知用户该能力暂不可用，禁止重试本接口。' }],
      structuredContent: {
        available: false,
        count: 0,
        authorizedList: [],
        allSame: false,
        authorized: false,
        errMsg: 'wx.requestAgentPrivacyAuthorization is not a function'
      }
    }
  }

  try {
    const startedAt = Date.now()
    const results = await Promise.all([
      callAgentPrivacyAuthorize({ privacyAgreements: FIRST_AGREEMENTS }),
      callAgentPrivacyAuthorize({ privacyAgreements: LATER_AGREEMENTS }),
      callAgentPrivacyAuthorize()
    ])
    const authorizedList = results.map(item => !!item.authorized)
    const authorized = authorizedList[0]
    const allSame = authorizedList.every(item => item === authorized)
    const result = {
      available: true,
      count: results.length,
      authorizedList,
      allSame,
      authorized,
      firstAgreementNames: FIRST_AGREEMENTS.map(item => item.name),
      ignoredLaterAgreementNames: LATER_AGREEMENTS.map(item => item.name),
      elapsedMs: Date.now() - startedAt,
      errMsg: (results[0] && results[0].errMsg) || ''
    }
    const assertions = runAssertions([
      ['并发次数为 3', () => assertEquals(result.count, 3)],
      ['全部结果一致', () => assertTrue(allSame, `authorizedList=${JSON.stringify(authorizedList)}`)],
      ['authorized 是 boolean', () => assertType(authorized, 'boolean')]
    ])

    return {
      isError: !assertions.passed,
      content: [{
        type: 'text',
        text: assertions.passed
          ? `并发 3 次调用结果一致，卡片应采用首发协议「用户服务协议」，后续的「隐私政策」不应覆盖首发内容。请结合卡片显示确认首发协议生效。`
          : `并发共享断言失败：${assertions.failures.map(item => item.errMsg).join('；')}`
      }],
      structuredContent: Object.assign({}, result, { assertions })
    }
  } catch (err) {
    const errMsg = (err && (err.errMsg || err.message)) || String(err)
    console.error('[requirePrivacyAuthConcurrent] error', err)
    return {
      isError: true,
      content: [{ type: 'text', text: `并发拉起隐私授权卡片失败：${errMsg}。请直接告知用户授权未完成，禁止重试本接口。` }],
      structuredContent: {
        available: true,
        count: 3,
        authorizedList: [],
        allSame: false,
        authorized: false,
        errMsg
      }
    }
  }
}

module.exports = requirePrivacyAuthConcurrent
