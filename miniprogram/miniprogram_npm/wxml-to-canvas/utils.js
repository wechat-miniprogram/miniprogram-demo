const hex = (color) => {
  let result = null

  if (/^#/.test(color) && (color.length === 7 || color.length === 9)) {
    return color
    // eslint-disable-next-line no-cond-assign
  } else if ((result = /^(rgb|rgba)\((.+)\)/.exec(color)) !== null) {
    return '#' + result[2].split(',').map((part, index) => {
      part = part.trim()
      part = index === 3 ? Math.floor(parseFloat(part) * 255) : parseInt(part, 10)
      part = part.toString(16)
      if (part.length === 1) {
        part = '0' + part
      }
      return part
    }).join('')
  } else {
    return '#00000000'
  }
}

const splitLineToCamelCase = (str) => str.split('-').map((part, index) => {
  if (index === 0) {
    return part
  }
  return part[0].toUpperCase() + part.slice(1)
}).join('')

const compareVersion = (v1, v2) => {
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

module.exports = {
  hex,
  splitLineToCamelCase,
  compareVersion
}
