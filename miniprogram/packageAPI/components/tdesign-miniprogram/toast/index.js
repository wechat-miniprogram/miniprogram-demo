import {getInstance} from '../common/utils'

const __rest = (this && this.__rest) || function (s, e) {
  const t = {}
  for (var p in s) { if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p] }
  if (s != null && typeof Object.getOwnPropertySymbols === 'function') {
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]]
    }
  }
  return t
}

function Toast(options) {
  let _a
  const {context, selector = '#t-toast'} = options; const
    Options = __rest(options, ['context', 'selector'])
  const instance = getInstance(context, selector)
  if (instance) {
    instance.show({...Options, duration: (_a = Options.duration) !== null && _a !== void 0 ? _a : 2000})
  }
}
function showToast(options = {}) {
  Toast(options)
}
function hideToast(options = {}) {
  const {context, selector = '#t-toast'} = options
  const instance = getInstance(context, selector)
  if (instance) {
    instance.hide()
  }
}
export {Toast as default, showToast, hideToast}
