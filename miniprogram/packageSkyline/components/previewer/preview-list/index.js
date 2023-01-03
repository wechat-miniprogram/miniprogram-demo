import { getRectInfo } from '../../../utils/tool'
import EventBus from '../../../utils/event-bus'
import { PREVIEWER_GESTURE_STATE } from '../../../utils/constant'

const runOnUI = wx.worklet.runOnUI
const shared = wx.worklet.shared

// sharedValues
const GESTURE_STATE = 0
const CURRENT_ID = 1
const WINDOW_WIDTH = 2

Component({
  properties: {
    index: {
      type: Number,
      value: 0,
    },
    list: {
      type: Array,
      value: [],
    },
  },

  data: {
    isRouteDone: false,
    currentIndex: -99,
    statusBarHeight: 0,
    needSwiperAnimation: true,
  },

  observers: {
    list(list) {
      const index = this.data.index
      const current = list[index]
      if (!current) return

      const sharedValues = this.sharedValues ?? []
      sharedValues[CURRENT_ID].value = current.id

      this.toggleImage(index, true)
    },

    index(index) {
      const len = this.data.list.length
      if (!len) return

      if (index !== this.data.currentIndex && index >= 0 && index < len) {
        this.toggleImage(index, true)
      } else {
        // 设置相同的 index 也给一下 render 事件
        const image = this.data.list[index]
        if (image && image.id === this.currentRenderImage) {
          // 要求 image 已经渲染完成
          this.onImageRender({ detail: image })
        }
      }
    },
  },

  lifetimes: {
    created() {
      this.sharedValues = [
        shared(0), // GESTURE_STATE
        shared(''), // CURRENT_ID
        shared(0), // WINDOW_WIDTH
      ]
    },

    async attached() {
      const { windowWidth, safeArea } = getRectInfo()
      this.setData({
        statusBarHeight: safeArea.top,
      })

      const pageId = this.getPageId()
      const sharedValues = this.sharedValues ?? []
      sharedValues[WINDOW_WIDTH].value = windowWidth

      runOnUI(() => {
        'worklet'
        if (!globalThis.temp[`${pageId}PreviewerBack`]) {
          globalThis.temp[`${pageId}PreviewerBack`] = () => sharedValues[GESTURE_STATE].value = PREVIEWER_GESTURE_STATE.Back
          globalThis.eventBus.on(`${pageId}Back`, globalThis.temp[`${pageId}PreviewerBack`])
        }

        if (!globalThis.temp[`${pageId}PreviewerToggle`]) {
          globalThis.temp[`${pageId}PreviewerToggle`] = () => sharedValues[GESTURE_STATE].value = PREVIEWER_GESTURE_STATE.Toggle
          globalThis.eventBus.on(`${pageId}Toggle`, globalThis.temp[`${pageId}PreviewerToggle`])
        }

        if (!globalThis.temp[`${pageId}PreviewerMoving`]) {
          globalThis.temp[`${pageId}PreviewerMoving`] = () => sharedValues[GESTURE_STATE].value = PREVIEWER_GESTURE_STATE.Moving
          globalThis.eventBus.on(`${pageId}Moving`, globalThis.temp[`${pageId}PreviewerMoving`])
        }

        if (!globalThis.temp[`${pageId}PreviewerMove`]) {
          globalThis.temp[`${pageId}PreviewerMove`] = args => {
            // 此处只做转发
            const currentId = sharedValues[CURRENT_ID].value
            globalThis.eventBus.emit(`${pageId}${currentId}Move`, args)
          }
          globalThis.eventBus.on(`${pageId}Move`, globalThis.temp[`${pageId}PreviewerMove`])
        }

        if (!globalThis.temp[`${pageId}PreviewerScale`]) {
          globalThis.temp[`${pageId}PreviewerScale`] = args => {
            // 此处只做转发
            const currentId = sharedValues[CURRENT_ID].value
            globalThis.eventBus.emit(`${pageId}${currentId}Scale`, args)
          }
          globalThis.eventBus.on(`${pageId}Scale`, globalThis.temp[`${pageId}PreviewerScale`])
        }

        if (!globalThis.temp[`${pageId}PreviewerEnd`]) {
          globalThis.temp[`${pageId}PreviewerEnd`] = args => {
            // 此处只做转发
            const currentId = sharedValues[CURRENT_ID].value
            globalThis.eventBus.emit(`${pageId}${currentId}End`, args)
          }
          globalThis.eventBus.on(`${pageId}End`, globalThis.temp[`${pageId}PreviewerEnd`])
        }
      })()
    },

    detached() {
      const pageId = this.getPageId()
      runOnUI(() => {
        'worklet'
        const removeList = ['Back', 'Toggle', 'Moving', 'Move', 'Scale', 'End']
        removeList.forEach(item => {
          'worklet'
          const globalKey = `${pageId}Previewer${item}`
          if (globalThis.temp[globalKey]) {
            globalThis.eventBus.off(`${pageId}${item}`, globalThis.temp[globalKey])
            delete globalThis.temp[globalKey]
          }
        })
      })()
    },
  },

  pageLifetimes: {
    routeDone() {
      this.setData({ isRouteDone: true })
    },
  },

  methods: {
    async toggleImage(index, disableAnimation = false) {
      const image = this.data.list[index]
      if (!image) return

      const sharedValues = this.sharedValues ?? []
      sharedValues[CURRENT_ID].value = image.id

      this.setData({
        currentIndex: index,
        needSwiperAnimation: !disableAnimation,
      })
      this.data.index = index // index 也更新一下，方便其他地方取用

      this.triggerEvent('beforerender', { index, image })
    },

    onImageRender(evt) {
      const list = this.data.list
      const index = this.data.currentIndex
      const image = list[index] || {}

      if (evt.detail.id !== image.id) return

      this.currentRenderImage = image.id
      this.triggerEvent('render', {
        index,
        image,
      })
    },

    onTapImage() {
      this.triggerEvent('tapimage')
    },

    shouldResponseOnMove() {
      'worklet'
      const sharedValues = this.sharedValues ?? []
      return sharedValues[GESTURE_STATE].value === PREVIEWER_GESTURE_STATE.Toggle
    },

    onSwiperChange(evt) {
      const { current, source } = evt.detail
      if (source === 'touch') this.toggleImage(current, false)
    },

    onSwiperAnimationFinish() {
      const pageId = this.getPageId()
      const image = this.data.list[this.data.index]
      if (image) EventBus.emit(`${pageId}SwiperAnimationFinish`, image)
    },
  },
})
