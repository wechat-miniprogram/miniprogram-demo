const { assertType, runAssertions } = require('../utils/assert.js')
const { wxCall, errMsgOf } = require('../utils/wxCall.js')

const SCOPE = 'scope.werun'

async function getWeRunData() {
  if (typeof wx.getWeRunData !== 'function') {
    return {
      isError: true,
      content: [{ type: 'text', text: '当前基础库不支持 wx.getWeRunData。请直接告知用户该能力暂不可用，禁止重试本接口。' }],
      structuredContent: {
        available: false,
        authorized: false,
        encryptedData: '',
        iv: '',
        cloudID: '',
        errMsg: 'wx.getWeRunData is not a function'
      }
    }
  }

  try {
    if (typeof wx.login === 'function') {
      await wxCall(wx.login)
    }
    if (typeof wx.authorize === 'function') {
      await wxCall(wx.authorize, { scope: SCOPE })
    }

    const res = await wxCall(wx.getWeRunData)
    const result = {
      available: true,
      authorized: true,
      encryptedData: (res && res.encryptedData) || '',
      iv: (res && res.iv) || '',
      cloudID: (res && res.cloudID) || '',
      errMsg: (res && res.errMsg) || 'getWeRunData:ok'
    }
    const assertions = runAssertions([
      ['encryptedData 是 string', () => assertType(result.encryptedData, 'string')]
    ])

    return {
      isError: !assertions.passed,
      content: [{
        type: 'text',
        text: assertions.passed
          ? '已获取微信运动加密数据（需后端解密后才是明文步数）。请用一句简短话术告知用户已拿到运动数据，不要在对话里展开 encryptedData。'
          : `获取微信运动断言失败：${assertions.failures.map(item => item.errMsg).join('；')}`
      }],
      structuredContent: Object.assign({}, result, { assertions })
    }
  } catch (err) {
    const errMsg = errMsgOf(err)
    console.error('[getWeRunData] error', err)
    return {
      isError: true,
      content: [{ type: 'text', text: `获取微信运动失败：${errMsg}。请用一句简短话术告知用户未获得运动数据，禁止重复发起授权。` }],
      structuredContent: {
        available: true,
        authorized: false,
        encryptedData: '',
        iv: '',
        cloudID: '',
        errMsg
      }
    }
  }
}

module.exports = getWeRunData
