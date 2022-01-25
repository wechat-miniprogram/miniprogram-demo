
import CustomPage from '../../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'index-list',
      path: 'packageExtend/pages/extend/index-list/index-list'
    }
  },
  onLoad() {
    this.getCitys()
  },

  getCitys() {
    const db = wx.cloud.database({
      env: 'release-b86096'
    })
    const mapCity = db.collection('mapCity')
    const _this = this

    mapCity.doc('6af880a55eb9574b008b78aa53a48405').get({
      success(re) {
        console.log(re)
        const cities = re.data.cities
        // 按拼音排序
        cities.sort((c1, c2) => {
          const pinyin1 = c1.pinyin.join('')
          const pinyin2 = c2.pinyin.join('')
          return pinyin1.localeCompare(pinyin2)
        })
        // 添加首字母
        const map = new Map()
        for (const city of cities) {
          const alpha = city.pinyin[0].charAt(0).toUpperCase()
          if (!map.has(alpha)) map.set(alpha, [])
          map.get(alpha).push({name: city.fullname})
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
