function wxCall(fn, options) {
  if (typeof fn !== 'function') {
    return Promise.reject({ errMsg: 'wx API is not a function' })
  }

  const opts = options && typeof options === 'object' ? Object.assign({}, options) : {}

  return new Promise((resolve, reject) => {
    let settled = false
    const done = (next, value) => {
      if (settled) return
      settled = true
      next(value)
    }

    try {
      const ret = fn(Object.assign({}, opts, {
        success: (res) => done(resolve, res || {}),
        fail: (err) => done(reject, err || { errMsg: 'fail' })
      }))

      if (ret && typeof ret.then === 'function') {
        ret.then((res) => done(resolve, res || {})).catch((err) => done(reject, err || { errMsg: 'fail' }))
      }
    } catch (e) {
      done(reject, { errMsg: (e && (e.errMsg || e.message)) || String(e) })
    }
  })
}

function errMsgOf(err) {
  return (err && (err.errMsg || err.message)) || String(err)
}

module.exports = {
  wxCall,
  errMsgOf
}
