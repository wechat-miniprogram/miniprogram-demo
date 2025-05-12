const imageList = []
export function getAlbum() {
  if (!imageList.length) {
    const srcList = [
      'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYcv7mQABQVg50gh51-Kb1mlBq0c8Difu3rXn0ldrZdZwVx9REPbKVyZb3E9Wq6YFLA',
      'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYVtRBEXZ74JLECYN4Hc3Cdml3x7cJcbcBj3sIdYb2L_7DJ14X8TAHiZ7Ydct52WIYA',
      'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYfaqohk6ndcC6_CBkUZszfSpKbqUAV7S2xWRbAQ459YsPWAmLKkicEOPS1L3NmnnRA',
      'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYYa7k4CAG71Ci0SRPExPB1sGiiVPcYwSD5CAYgq8Ni2RhGQlqIrIwnBlt90mUzL7Lg',
      'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYYjda9Dp372N3T05q_nn3PgvoXBoReXvaXBfkthtXQLN7m5_YI6FoTre-xvJBDFLMA',
      'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYTIqRBCdQgzZm3KO3usZT7zM2O0EoylisontlH4TZAC_qfVjFVU4L4CPjLm0mppQwg',
      'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYfa6mRnywhNbBFV5eAt7oTz3zjlNJeujfQx0PVA1ufenPHBvxYXRNJ5chyi6RPaE7A',
      'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYYY1OalScOn4EMcQpkPaJ1Sxhri8CScjnhqVfjAZnLuVFl0JAM4VziHhSzHLZXtAaQ',
      'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYSPfXw5qxNvP3f5uJhy0kdkaTAbIZ187IFWmBiluEs8Puw0tXgBlBgGKN-irLPOIDw',
      'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYZB1p48LLH-Pc7Rzr4nN0YF-uZg7FW7zksw_Kjp0BNDHcZp9R9SRKbg0rA1HBaeK3Q',
      'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYYXMoGlbo8DkSiia6d-_3Dv15DjMGCEhBkPYd5BrNkSUTPtomAm0CVeHgC244sapKw',
      'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYf3q0W302-kseD8VxLKoItZ6HgneLkgpQSEMIgEKz_xVE7putZxs2YEYqB13Uh37_w',
      'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYRu0VRyVvePJ4pB4_Dvj0ytF-ovjQzMl6WMLyuCeKk3579HNjKLIeNrHE7OprTBx5w',
      'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYc-vygvNNpz1fcZZjZ6B0Jm0X2dpOWJBn4u4T15gwL-1Qr70v6fkFgUswldiPhQG0Q',
      'https://res.wx.qq.com/op_res/7_miJnK0wxIrh5bV2QqvYUo-SgGpk2gpFNixuaCMxDadRvvWxqC5jc1ma-oobJf4mWVg3F3iRt1Bkv-sR0l3-Q',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJCk-lm-hNrvdJ9paSPqTXkCKLE6eIuc6zAs3Lr1Qh6jEMxdfgP_rvTftB0SQiZeQNQ',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJImpE8Sm-oMoeJizjFr8mxotXQSFlSm8ZUD6GLf_ptM5ozLvnc2eczwSN09Y5M0ovg',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJBAK7KJg9KId_6N1-rJ4OyCCQoJGVMOaTabboo2viRucoxkPvHRkn2fVl6tectlzBg',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJGVi_kGQppwXClflw43wtANVzuw0_Y8ij9VzW1O8hr6cR195D87X7zQS_1gjRo8IdQ',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJHhlMVj_svRRdDMHjtAvwGwU2d_VAJ-y3SigDx2XjjA22Y63oStS-fw5gooV5rX42Q',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJPRaN5CDI6NZFg_qbSxeqF8UBpM4lXJ_1o9S9bsOOxMpuXGLeKyAKleWlAXmVLmQOw',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJMQYuLq5q6_CWdtW3RnWbYMaNhzew60nGsQfBtyeogj3vRfGimJBi87ThS577HC6ag',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJBalQKoYXBze_mRhoUHIh5OfHiR95JEa18ob-y7uu8W1gpOjO87BbOcki3xM_RrO1Q',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJAqHss14EPHStg3OpHjtIYzOGQgxvsDcACMxQc2waTpAMsJBFxVlp1JkZQJy2gXu3g',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJH2f0R4uXyqnNGlrivO8cKbn0nz1DE_6s22rc91zluwIrqiAVZNREvCeVYAUS8aaZw',
    ]
    const thumbnailList = [
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJDaOeA5r3yDpl5AjlRxMmKPaX0WbJIRr0PjZzsfxIGq1n5Q0o65EpxFGpGpbT9e8QQ',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJACGFAh31lY9OxoD1iSXsyYpk2adWITN6b7gT7RcBEeDXhppBLYI3JhSMJDyIvPrcg',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJJX5J79IIhayRchEZTln15RdpFkFfsqsvng5dqMa12Vm9rmcT-hhw1alfHvxTXVVRw',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJApluxMePb-2yj-XeDSDlr-pNZnbKpaNwl4BUXyZ0bKXWMcqKQSGDdOWFPOP08-4Sw',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJI8Xazme5-MIIJYUg9t2ibxTp-PtGPUXes9XZj8rRIfyhZJgyfejqwzwpSDBh-K5eg',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJHOt1gRAQQbf2Bx8mJoYj_8hoN17WusJ_kEzxqYbkN6X1dRjDMdp0gS9jJf-VAezfg',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJNLlVMP9qArsQkkz294mrVFbI2pxwKxf0I1F8S86W4zZ8bcpuDv4xIWioikrD-85Dw',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJOY6-yX_tVBt6ZC4ffTUqdnMXaCEKf0mYb8ebfl0l-VUKHzayRrbipPLqsynrTN0FA',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJMgKiLq4XOYd9BtY9HCvD4BvuYDo9ro9XBb3_fQk90z8odHLs4eYvoHwkyKaM3ztZA',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJH3eO7DeTKRV0Ys2vZ2aqUom-xWvymxzS3uiu06syi2vlj8hzWyIK1_inNHTVkuWPw',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJA7-uaVSCPgd7Q32x1_vmHrDLaretZxRboZv2wZiNBkRdgihEvRhcWRHrm0vBUggzw',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJBUmVY1MDz1vsXTJlQCPd-fHF8AsVCi6yVK4BxhjBXs085BQZaI6LoWW4GfnqMRqbg',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJKh4kMbGYKCPnBu-ZWsQnn3NEFKDEN0DgdKH_R9v8Snkp-cfiU8dZd_abw5QcyiWBQ',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJKPDdtcGoJzhB8HdWlDtWaxeIOvdYSmQoihkYQPrHDoGr2PJD31RPzqcz5u8b3rpoQ',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJFryDUHWInyL4LeRP6y_wIUpf7kQSfrcGPcGeZbLuOtan8ml9SbJ1k0Qdgelf6iEBg',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJE1YvpBMZCjoKqX1Sy1xqlqntchR2vwtu82wt0XLsCMUtsJ0x2K5fFvEiaouWbViFg',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJIJE5jTu_BNqZ_LR4E82Kj6hBC7UlZ1BDeqhJEKDtQ-vTzpwv8m3Rj16kJtE2dSBAg',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJBi8YFt3WToEbW0L6-BmqV4_HjXOvB0Z5IJ3GLVtBj8hcRP_O4mf9Ia6T8ITbfkKBw',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJFIvGogPbbDumfRVNxlgPRqYwmSTuhsE2OyzcnJXRc49-6SanEHKsiPM-vIlUlGOFQ',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJNt8AklXWChR3D1545zHosDzkcT6gNUv9UwevKbgsGE6_Skgr9Et86OA8tw3PgW0ew',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJMNA5xeVo8u0lFyyFwLvexHmQTRi_oaiYuS6wCrZHm3931x3KbVeeLJv8hI2YvL1yQ',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJD3V9rkvi7OQ852nZavb3k2sdVOl_JEjqRbhYBhgPPqhgaIkawklFj-4w5oQ9BR1xg',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJDLPwxnddCKwDrDOjA9lWQkB1_2KcFc9L48-AjNV7lMTDV7EvpwWRy3aLVmvXmmi-w',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJNMTtzowAlaXSt-ZZajhbZeYcZj9njs9Czy2iRLoh6m-PrGRaCb7koaoeVzHvMwrFg',
      'https://res.wx.qq.com/op_res/0-l2fyKjv3_BR62E3KwTJMQV_yLC-b3ewPS_sYPnmdwvIlB-IlyEjoyVtv13rE7Qulx6GR2H-p5JIIZNDWXg6Q',
    ]
    const now = Date.now()
    srcList.forEach((src, index) => {
      const id = (now + index).toString()
      imageList.push({
        id,
        src,
        thumbnail: thumbnailList[index],
        createTime: now - (index * 3600 * 1000)
      })
    })
  }

  return imageList
}

let rectInfo = null
export function getRectInfo() {
  if (!rectInfo) {
    const {
      safeArea, screenWidth, screenHeight, windowWidth, windowHeight
    } = wx.getSystemInfoSync()
    const menuButtomRect = wx.getMenuButtonBoundingClientRect()

    rectInfo = {
      safeArea,
      statusBarHeight: safeArea.top,
      navigationBarHeight: menuButtomRect.height + ((menuButtomRect.top - safeArea.top) * 2),
      safeAreaInsetBottom: screenHeight - safeArea.bottom,
      windowWidth,
      windowHeight,
      screenWidth,
      screenHeight,
    }
  }

  return rectInfo
}

export function timeFormat(date, reg) {
  date = date instanceof Date ? date : new Date(date)
  const map = {}
  map.yyyy = date.getFullYear()
  map.yy = ('' + map.yyyy).substr(2)
  map.M = date.getMonth() + 1
  map.MM = (map.M < 10 ? '0' : '') + map.M
  map.d = date.getDate()
  map.dd = (map.d < 10 ? '0' : '') + map.d
  map.H = date.getHours()
  map.HH = (map.H < 10 ? '0' : '') + map.H
  map.m = date.getMinutes()
  map.mm = (map.m < 10 ? '0' : '') + map.m
  map.s = date.getSeconds()
  map.ss = (map.s < 10 ? '0' : '') + map.s

  return reg.replace(/\byyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s\b/g, $1 => map[$1])
}

export function getShowTime(timeStamp) {
  const date = new Date(timeStamp)
  const nextDate = new Date(date.getTime() + (24 * 60 * 60 * 1000))
  const now = new Date()

  if (date.getFullYear() !== now.getFullYear()) {
    return timeFormat(date, 'yyyy-MM-dd HH:mm')
  } else if (date.getMonth() === now.getMonth() && date.getDate() === now.getDate()) {
    return timeFormat(date, '今天 HH:mm')
  } else if (nextDate.getMonth() === now.getMonth() && nextDate.getDate() === now.getDate()) {
    return timeFormat(date, '昨天 HH:mm')
  } else {
    return timeFormat(date, 'MM-dd HH:mm')
  }
}
