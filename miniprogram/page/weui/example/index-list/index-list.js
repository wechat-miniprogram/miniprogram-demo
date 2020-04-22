const QQMapWX = require('./lib/qqmap-wx-jssdk.min.js')
const QQMapKey = 'NDLBZ-4Y6KF-S2LJ6-NAOAA-BOW56-LMB44'
const qqmapsdk = new QQMapWX({ key: QQMapKey })


Page({

  onLoad(options) {
    this.getCitys()
  },

  onChoose(e) {
    console.log('onChoose', e)
  },

  getCitys() {
    const _this = this
    qqmapsdk.getCityList({
      success(res) {
        const cities = res.result[1]
        // 按拼音排序
        cities.sort((c1, c2) => {
          let pinyin1 = c1.pinyin.join('')
          let pinyin2 = c2.pinyin.join('')
          return pinyin1.localeCompare(pinyin2)
        })
        // 添加首字母
        const map = new Map()
        for (const city of cities) {
          const alpha = city.pinyin[0].charAt(0).toUpperCase()
          if (!map.has(alpha)) map.set(alpha, [])
          map.get(alpha).push({ name: city.fullname })
        }
    
        const keys = []
        for (const key of map.keys()) {
          keys.push(key)
        }
        keys.sort()
    
        const list = []
        for (const key of keys) {
          list.push({
            alpha: key,
            subItems: map.get(key)
          })
        }

        _this.setData({list})
      }
    })     
  }

})