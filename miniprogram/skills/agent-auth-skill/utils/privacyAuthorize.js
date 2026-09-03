function isAgentPrivacyAuthorizeAvailable() {
  return typeof wx.requestAgentPrivacyAuthorization === 'function'
}

function callAgentPrivacyAuthorize(options) {
  if (!isAgentPrivacyAuthorizeAvailable()) {
    return Promise.reject({
      errMsg: 'wx.requestAgentPrivacyAuthorization is not a function'
    })
  }

  const opts = options && typeof options === 'object' ? Object.assign({}, options) : {}

  return new Promise((resolve, reject) => {
    let settled = false
    const done = (fn, value) => {
      if (settled) return
      settled = true
      fn(value)
    }
    const toResult = (res) => ({
      authorized: !!(res && res.authorized),
      errMsg: (res && res.errMsg) || 'requestAgentPrivacyAuthorization:ok',
      raw: res || {}
    })

    try {
      const ret = wx.requestAgentPrivacyAuthorization(Object.assign({}, opts, {
        success: (res) => done(resolve, toResult(res)),
        fail: (err) => done(reject, err || { errMsg: 'requestAgentPrivacyAuthorization:fail' })
      }))

      if (ret && typeof ret.then === 'function') {
        ret
          .then((res) => done(resolve, toResult(res)))
          .catch((err) => done(reject, err || { errMsg: 'requestAgentPrivacyAuthorization:fail' }))
      }
    } catch (e) {
      done(reject, { errMsg: (e && (e.errMsg || e.message)) || String(e) })
    }
  })
}

module.exports = {
  isAgentPrivacyAuthorizeAvailable,
  callAgentPrivacyAuthorize
}
