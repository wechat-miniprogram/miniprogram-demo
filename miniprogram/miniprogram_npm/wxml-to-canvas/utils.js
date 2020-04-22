const hex = (color) => {
  let result = null

  if (/^#/.test(color) && (color.length === 7 || color.length === 9)) {
    return color
    // eslint-disable-next-line no-cond-assign
  } else if ((result = /^(rgb|rgba)\((.+)\)/.exec(color)) !== null) {
    return '#' + result[2].split(',').map((part, index) => {
      part = part.trim()
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

module.exports = {
  hex,
  splitLineToCamelCase
}
