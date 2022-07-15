// 获取字节长度，中文算2个字节
function getStrLen(str) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/[^\x00-\xff]/g, 'aa').length
}

// 截取指定字节长度的子串
function substring(str, n) {
  if (!str) return ''

  const len = getStrLen(str)
  if (n >= len) return str

  let l = 0
  let result = ''
  for (let i = 0; i < str.length; i++) {
    const ch = str.charAt(i)
    // eslint-disable-next-line no-control-regex
    l = /[^\x00-\xff]/i.test(ch) ? l + 2 : l + 1
    result += ch
    if (l >= n) break
  }
  return result
}

function getRandom(max = 10, min = 0) {
  return Math.floor(Math.random() * (max - min) + min)
}

function getFontSize(font) {
  const reg = /(\d+)(px)/i
  const match = font.match(reg)
  return (match && match[1]) || 10
}

function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i], 10)
    const num2 = parseInt(v2[i], 10)

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
  return 0
}

const getType = obj => Object.prototype.toString.call(obj).slice(8,-1)
const isArray = obj => getType(obj) === 'Array'

module.exports = {
  getStrLen,
  substring,
  getRandom,
  getFontSize,
  compareVersion,
  isArray
}
