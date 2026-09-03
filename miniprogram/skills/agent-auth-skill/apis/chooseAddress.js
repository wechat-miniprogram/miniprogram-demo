const { assertType, runAssertions } = require('../utils/assert.js')
const { wxCall, errMsgOf } = require('../utils/wxCall.js')

async function chooseAddress() {
  if (typeof wx.chooseAddress !== 'function') {
    return {
      isError: true,
      content: [{ type: 'text', text: '当前基础库不支持 wx.chooseAddress。请直接告知用户该能力暂不可用，禁止重试本接口。' }],
      structuredContent: {
        available: false,
        selected: false,
        errMsg: 'wx.chooseAddress is not a function'
      }
    }
  }

  try {
    const res = await wxCall(wx.chooseAddress)
    const result = {
      available: true,
      selected: true,
      userName: (res && res.userName) || '',
      telNumber: (res && res.telNumber) || '',
      postalCode: (res && res.postalCode) || '',
      provinceName: (res && res.provinceName) || '',
      cityName: (res && res.cityName) || '',
      countyName: (res && res.countyName) || '',
      streetName: (res && res.streetName) || '',
      detailInfo: (res && res.detailInfo) || '',
      nationalCode: (res && res.nationalCode) || '',
      errMsg: (res && res.errMsg) || 'chooseAddress:ok'
    }
    const assertions = runAssertions([
      ['userName 是 string', () => assertType(result.userName, 'string')],
      ['telNumber 是 string', () => assertType(result.telNumber, 'string')]
    ])

    return {
      isError: !assertions.passed,
      content: [{
        type: 'text',
        text: assertions.passed
          ? `用户已选择收货地址：${result.userName} ${result.telNumber} ${result.provinceName}${result.cityName}${result.countyName}${result.detailInfo}。请用一句简短话术告知用户地址已选好。`
          : `收货地址断言失败：${assertions.failures.map(item => item.errMsg).join('；')}`
      }],
      structuredContent: Object.assign({}, result, { assertions })
    }
  } catch (err) {
    const errMsg = errMsgOf(err)
    console.error('[chooseAddress] error', err)
    return {
      isError: true,
      content: [{ type: 'text', text: `选择收货地址失败：${errMsg}。请用一句简短话术告知用户未选择地址，禁止重复拉起。` }],
      structuredContent: {
        available: true,
        selected: false,
        errMsg
      }
    }
  }
}

module.exports = chooseAddress
