const { assertType, runAssertions } = require('../utils/assert.js')
const { wxCall, errMsgOf } = require('../utils/wxCall.js')

const TMPL_ID = 'y1bXHAg_oDuvrQ3pHgcODcMPl-2hZHenWugsqdB2CXY'

async function requestSubscribeMessage() {
  if (typeof wx.requestSubscribeMessage !== 'function') {
    return {
      isError: true,
      content: [{ type: 'text', text: '当前基础库不支持 wx.requestSubscribeMessage。请直接告知用户该能力暂不可用，禁止重试本接口。' }],
      structuredContent: {
        available: false,
        tmplId: TMPL_ID,
        status: '',
        errMsg: 'wx.requestSubscribeMessage is not a function'
      }
    }
  }

  try {
    const res = await wxCall(wx.requestSubscribeMessage, { tmplIds: [TMPL_ID] })
    const status = res && typeof res[TMPL_ID] === 'string' ? res[TMPL_ID] : ''
    const result = {
      available: true,
      tmplId: TMPL_ID,
      status,
      accepted: status === 'accept',
      errMsg: (res && res.errMsg) || ''
    }
    const assertions = runAssertions([
      ['errMsg 是 string', () => assertType(result.errMsg, 'string')]
    ])

    let summary = `订阅消息面板已返回，模板 ${TMPL_ID} 的结果为 ${status || '未知'}。`
    if (status === 'accept') summary = '用户已同意订阅该模板消息。请用一句简短话术告知用户订阅成功。'
    else if (status === 'reject') summary = '用户拒绝订阅该模板消息。请用一句简短话术告知用户未订阅，禁止重复拉起订阅面板。'
    else if (status === 'ban') summary = '该模板消息已被后台封禁，无法订阅。请直接告知用户当前无法订阅。'
    else if (status === 'filter') summary = '该模板因标题同名被过滤。请直接告知用户当前无法订阅。'

    return {
      isError: !assertions.passed,
      content: [{
        type: 'text',
        text: assertions.passed
          ? summary
          : `订阅消息断言失败：${assertions.failures.map(item => item.errMsg).join('；')}`
      }],
      structuredContent: Object.assign({}, result, { assertions })
    }
  } catch (err) {
    const errMsg = errMsgOf(err)
    console.error('[requestSubscribeMessage] error', err)
    return {
      isError: true,
      content: [{ type: 'text', text: `订阅消息失败：${errMsg}。请直接告知用户订阅未完成，禁止重试本接口。` }],
      structuredContent: {
        available: true,
        tmplId: TMPL_ID,
        status: '',
        accepted: false,
        errMsg
      }
    }
  }
}

module.exports = requestSubscribeMessage
