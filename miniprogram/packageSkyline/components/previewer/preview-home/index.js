import { getShowTime, getRectInfo } from '../../../utils/tool'
import { THUMBNAIL_CNT_HEIGHT } from '../../../utils/constant'
import EventBus from '../../../utils/event-bus'

const thumbnailWidth = 45
const thumbnailActiveWidth = 60
const thumbnailMargin = 10

Component({
  properties: {
    imageId: {
      type: String,
      value: '',
    },
    sourcePageId: {
      type: String,
      value: '',
    },
    list: {
      type: Array,
      value: [],
    },
  },

  data: {
    THUMBNAIL_CNT_HEIGHT,
    previewTopHeight: 0,
    previewBottomHeight: 0,
    halfScreenWidth: 0,
    title: '',
    index: 0,
    thumbnailIndex: -1, // 下发预览图列表中的下标
    tempImageIndex: -1, // 用于快速预览图片
    pretty: false,
    thumbnailWidth,
    thumbnailActiveWidth,
    thumbnailMargin,
    thumbnailScrollLeft: 0,
    thumbnailScrollWithAnimation: false,
    isThumbnailScrolling: false,
    isThumbnailScrollingByDrag: false,
  },

  observers: {
    thumbnailIndex(thumbnailIndex) {
      // 切换照片时会影响前一个页面的图片
      const { list, sourcePageId } = this.data
      const image = list[thumbnailIndex]
      if (image) EventBus.emit(`${sourcePageId}PreviewerChange`, image)
    },
  },

  lifetimes: {
    attached() {
      const { screenWidth, screenHeight, safeArea, navigationBarHeight } = getRectInfo()
      const safeAreaInsetBottom = screenHeight - safeArea.bottom

      const imageId = this.data.imageId     
      const list = this.data.list
      let index = 0
      if (imageId) {
        const currentIndex = list.findIndex(item => item.id === imageId)
        if (currentIndex !== -1) index = currentIndex
      }

      this.setData({
        halfScreenWidth: screenWidth / 2,
        previewTopHeight: safeArea.top + navigationBarHeight,
        previewBottomHeight: safeAreaInsetBottom + THUMBNAIL_CNT_HEIGHT,
        index,
        tempImageIndex: index, // 盖在上面的缩略图
      })
    },

    detached() {
      EventBus.emit(`${this.data.sourcePageId}PreviewerDestroy`)
    },
  },

  methods: {
    onRender() {
      if (this.renderTimer) clearTimeout(this.renderTimer)
      this.renderTimer = setTimeout(() => {
        // 同时给足时间渲染原图，再撤下临时缩略图
        this.setData({ tempImageIndex: -1 })
      }, 100)
    },

    onBeforeRender(evt) {
      const { index, image } = evt.detail
      const { createTime } = image
      const title = getShowTime(createTime)

      const thumbnailIndex = index
      const thumbnailScrollLeft = (thumbnailIndex * (thumbnailWidth + thumbnailMargin)) + (thumbnailActiveWidth / 2) + (thumbnailMargin / 2) // 屏幕居中

      this.data.index = index // 也需要更新下 index，但是可以不走 setData
      this.setData({
        title,
        thumbnailIndex,
      }, () => {
        // 这里 scrollLeft 必须延迟设置才能生效
        setTimeout(() => {
          this.setData({ thumbnailScrollLeft })

          if (!this.data.thumbnailScrollWithAnimation) {
            // 这里等第一次 thumbnailScrollLeft 设置完之后再恢复 thumbnailScrollWithAnimation
            setTimeout(() => {
              this.setData({ thumbnailScrollWithAnimation: true })
            }, 16)
          }
        }, 16)
      })
    },

    onTapImage() {
      this.setData({ pretty: !this.data.pretty })
    },

    onTapThumbnail(evt) {
      let { idx } = evt.currentTarget.dataset
      if (idx !== this.data.thumbnailIndex) {
        this.setData({
          index: idx,
          tempImageIndex: idx, // 先用小点的缩略图预览
        })
      }
    },

    onTouchStartThumbnailList() {
      this.isTouchThumbnailList = true
    },

    onTouchEndThumbnailList() {
      this.isTouchThumbnailList = false

      if (this.thumbnailScrollTimer) clearTimeout(this.thumbnailScrollTimer)
      this.thumbnailScrollTimer = setTimeout(() => {
        this.thumbnailScrollTimer = 0

        // 滚动结束
        this.onThumbnailListScrollEnd()
      }, 100)
    },

    onThumbnailListScroll(evt) {
      if (!this.data.isThumbnailScrolling) this.setData({ isThumbnailScrolling: true })

      // 拖拽引发的滚动
      if (evt.detail.isDrag) this.isDragScrollThumbnailList = true

      if (this.isDragScrollThumbnailList) {
        // 拖拽引发的滚动
        const scrollLeft = evt.detail.scrollLeft

        // 解 scrollLeft
        const targetIndex = (scrollLeft - (thumbnailActiveWidth / 2)) / (thumbnailWidth + thumbnailMargin)
        const len = this.data.list.length

        let tempImageIndex = Math.round(targetIndex)
        if (tempImageIndex < 0) tempImageIndex = 0
        if (tempImageIndex >= len) tempImageIndex = len - 1

        this.setData({
          tempImageIndex,
          isThumbnailScrollingByDrag: true,
        })
      }

      if (this.thumbnailScrollTimer) clearTimeout(this.thumbnailScrollTimer)
      this.thumbnailScrollTimer = setTimeout(() => {
        this.thumbnailScrollTimer = 0

        // 手指仍在触摸，放弃
        if (this.isTouchThumbnailList) return

        // 滚动结束
        this.onThumbnailListScrollEnd()
      }, 100)
    },

    onThumbnailListScrollEnd() {
      if (this.data.isThumbnailScrolling) this.setData({ isThumbnailScrolling: false })
      if (this.data.isThumbnailScrollingByDrag) this.setData({ isThumbnailScrollingByDrag: false })

      const tempImageIndex = this.data.tempImageIndex
      let checkThumbnailIndex = this.data.thumbnailIndex

      if (tempImageIndex >= 0 && tempImageIndex !== checkThumbnailIndex) {
        // 避免重置掉放缩表现
        this.setData({ index: tempImageIndex })
      } else if (this.isDragScrollThumbnailList) {
        // 只是轻微移动也会设置 tempImageIndex，需要重置回去
        const thumbnailIndex = this.data.thumbnailIndex
        this.setData({
          tempImageIndex: -1,
          thumbnailScrollLeft: (thumbnailIndex * (thumbnailWidth + thumbnailMargin)) + (thumbnailActiveWidth / 2) + (thumbnailMargin / 2), // 屏幕居中
        })
      }

      this.isDragScrollThumbnailList = false
    },

    onBack(evt) {
      this.triggerEvent('back', evt.detail)
    },
  },
})
