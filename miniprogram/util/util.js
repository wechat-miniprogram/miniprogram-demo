export const lightBlue = {
  // 0: '#E1F5FE',
  // 100: '#B3E5FC',
  // 200: '#81D4FA',
  // 300: '#4FC3F7',
  // 400: '#29B6F6',
  // 500: '#03A9F4',
  // 600: '#039BE5',
  // 700: '#0288D1',
  // 800: '#0277BD',
  // 900: '#01579B',
  0: '#efefef',
  100: '#d7d7d7',
  200: '#bdbdbd',
  300: '#a3a3a3',
  400: '#8f8f8f',
  500: '#7b7b7b',
  600: '#989898;',
  700: '#747474',
  800: '#696969',
  900: '#5f5f5f',
}

export const generateList = (childCount) => {
  const ans = []
  for (let i = 0; i < childCount; i++) {
    ans.push({
      id: i,
      color: lightBlue[`${100 * (i % 9)}`],
    })
  }
  return ans
}

function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  const hour = parseInt(time / 3600, 10)
  time %= 3600
  const minute = parseInt(time / 60, 10)
  time = parseInt(time % 60, 10)
  const second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : `0${n}`
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

function fib(n) {
  if (n < 1) return 0
  if (n <= 2) return 1
  return fib(n - 1) + fib(n - 2)
}

function formatLeadingZeroNumber(n, digitNum = 2) {
  n = n.toString()
  const needNum = Math.max(digitNum - n.length, 0)
  return new Array(needNum).fill(0).join('') + n
}

function formatDateTime(date, withMs = false) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const ms = date.getMilliseconds()

  let ret = `${[year, month, day].map(value => formatLeadingZeroNumber(value, 2)).join('-')} ${[hour, minute, second].map(value => formatLeadingZeroNumber(value, 2)).join(':')}`
  if (withMs) {
    ret += `.${formatLeadingZeroNumber(ms, 3)}`
  }
  return ret
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

let safeAreaInsetBottom = null
function getSafeAreaInsetBottom() {
  if (safeAreaInsetBottom === null) {
    const { safeArea, screenHeight } = wx.getSystemInfoSync()
    safeAreaInsetBottom = screenHeight - safeArea.bottom
  }
  return safeAreaInsetBottom
}

let statusBarHeight = null
function getStatusBarHeight() {
  if (statusBarHeight === null) {
    const menuButton = wx.getMenuButtonBoundingClientRect()
    statusBarHeight = menuButton.top
  }
  return statusBarHeight
}

function getFrameSliceOptions(frameWidth, frameHeight, displayWidth, displayHeight) {
  const result = {
    start: [0, 0, 0],
    size: [-1, -1, 3]
  }

  const ratio = displayHeight / displayWidth

  if (ratio > frameHeight / frameWidth) {
    result.start = [0, Math.ceil((frameWidth - Math.ceil(frameHeight / ratio)) / 2), 0]
    result.size = [-1, Math.ceil(frameHeight / ratio), 3]
  } else {
    result.start = [Math.ceil((frameHeight - Math.floor(ratio * frameWidth)) / 2), 0, 0]
    result.size = [Math.ceil(ratio * frameWidth), -1, 3]
  }

  return result
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

export const generateGridList = (childCount, columns) => {
  const ans = []
  for (let i = 0; i < childCount; i++) {
    ans.push({
      id: i,
      sub: getRandomInt(columns) + 1,
    })
  }
  return ans
}

module.exports = {
  formatTime,
  formatLocation,
  fib,
  formatDateTime,
  compareVersion,
  getSafeAreaInsetBottom,
  getStatusBarHeight,
  getFrameSliceOptions,
  getRandomInt,
  generateList,
  generateGridList
}
