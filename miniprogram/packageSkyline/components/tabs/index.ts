// packageSkyline/components/tabs/index.ts
import { shared } from '../../common/worklet-api';

enum ScrollState {
  scrollStart,
  scrollUpdate,
  scrollEnd
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: [],
      observer: function observer(newVal) {
        // const _this = this

        // if (newVal.length === 0) return
        // const data = this.data
        // const alphabet = data.list.map(function (item) {
        //   return item.alpha
        // })
        // console.log(alphabet)
        // this.setData({
        //   alphabet,
        //   current: alphabet[0]
        // }, function () {
        //   _this.computedSize()
        // })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabList: ['gallery', 'media', 'souvenir'],
    selectedTab: 'gallery',
    swiperSelect: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapTab(evt: any) {
      const { tab } = evt.currentTarget.dataset || {}
      this.setData({
        selectedTab: tab,
        swiperSelect: tab === 'gallery' ? 0 : tab === 'media' ? 1 : 2,
      })
    },
  
    onTabChanged(evt: any) {
      const index = evt.detail.current
      this.setData({
        selectedTab: index === 0 ? 'gallery' : index === 1 ? 'media' : 'souvenir',
        swiperSelect: index,
      })
    },
  
    onTabTransition(evt: any) {
      'worklet'
      const translateRatio = evt.detail.dx / this._windowWidth.value
      
      this._translateX.value = this._lastTranslateX.value + translateRatio * this._tabWidth.value
  
      // 控制 scale 值，拖到中间时 scale 处于最大值 1，两端递减
      const scaleRatio = (this._translateX.value / this._tabWidth.value) % 1
      const changedScale = scaleRatio <= 0.5 ? scaleRatio : (1 - scaleRatio)
      this._scaleX.value = Math.abs(changedScale) * 0.6 + 0.7
  
      if (evt.detail.state === ScrollState.scrollEnd) {
        this._lastTranslateX.value = this._translateX.value
      }
    },
  },

  lifetimes: {
    created() {

    },
    attached() {
      const { screenWidth, windowWidth } = wx.getSystemInfoSync()
      const innerWindowWidth = windowWidth - 48
      this._translateX = shared(0)
      this._lastTranslateX = shared(0)
      this._scaleX = shared(0.7)
      this._tabWidth = shared(innerWindowWidth / 3)
      this._windowWidth = shared(windowWidth)

      this.applyAnimatedStyle('.tab-border', () => {
        'worklet'
        return {
          transform: `translateX(${this._translateX.value}px) scaleX(${this._scaleX.value})`,
        }
      })
    }
  }
})
