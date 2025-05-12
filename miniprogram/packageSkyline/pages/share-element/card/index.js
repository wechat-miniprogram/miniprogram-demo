import { cardList } from '../data'

Component({
  properties: {
    idx: {
      type: Number,
      value: -1,
      observer(newVal) {
        this.setData({
          cardData: cardList[newVal],
        })
      },
    },
  },
  data: {
    cardData: {},
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '共享元素动画',
      path: 'packageSkyline/pages/share-element/card/index'
    }
  },
})
