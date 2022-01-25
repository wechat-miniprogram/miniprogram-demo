const util = {}

// const { formatDateTime } = require('../../../../util/util')
Date.prototype.Format = function (fmt) {
  const o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  }

  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }

  return fmt
}

util.renderName = (name) => {
  switch (name) {
    case 'appLaunch':
      return '小程序启动'
      break
    case 'firstRender':
      return '页面首次渲染'
      break
    case 'route':
      return '路由性能'
      break
    case 'evaluateScript':
      return '注入脚本'
      break
  }
}

util.renderEntryType = (entryType) => {
  switch (entryType) {
    case 'navigation':
      return '路由'
      break
    case 'render':
      return '渲染'
      break
    case 'script':
      return '脚本'
      break
  }
}

util.renderDuration = (duration) => (duration ? duration + 'ms' : '')

util.renderStartTime = (startTime) => {
  if (!startTime) return ''

  const date = new Date(startTime)
  return date.Format('yyyy-MM-dd hh:mm:ss')
}

module.exports = util
