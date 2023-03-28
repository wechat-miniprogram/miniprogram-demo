import EventBus from '../../../utils/event-bus'

const runOnUI = wx.worklet.runOnUI
const shared = wx.worklet.shared

const IMAGE_INIT_WIDTH = 0
const IMAGE_INIT_HEIGHT = 1
const IMAGE_WIDTH = 2
const IMAGE_HEIGHT = 3
const IMAGE_TARGET_WIDTH = 4
const IMAGE_TARGET_HEIGHT = 5
const IMAGE_RATIO = 6
const OPACITY = 7
const IN_PREVIEW = 8

let windowWidth = 0
let windowHeight = 0

Component({
  properties: {
    shareKey: {
      type: String,
      value: '',
    },
    image: {
      type: Object,
      value: {},
    },
    src: {
      type: String,
      value: '',
    },
    width: {
      type: Number,
      value: 0,
    },
    height: {
      type: Number,
      value: 0,
    },
  },

  observers: {
    'width, height'() {
      this.renderImage()
    },
  },

  lifetimes: {
    created() {
      console.log('created')
      this.sharedValues = [
        shared(0), // IMAGE_INIT_WIDTH
        shared(0), // IMAGE_INIT_HEIGHT
        shared(0), // IMAGE_WIDTH
        shared(0), // IMAGE_HEIGHT
        shared(0), // IMAGE_TARGET_WIDTH
        shared(0), // IMAGE_TARGET_HEIGHT
        shared(0), // IMAGE_RATIO
        shared(1), // OPACITY
        shared(false), // IN_PREVIEW
      ]
    },

    attached() {
      const pageId = this.getPageId()
      const uniqueId = `${pageId}-${this.data.image.id}`
      const sharedValues = this.sharedValues ?? []
      this.uniqueId = uniqueId

      runOnUI(() => {
        'worklet'
        if (!globalThis.temp[`${uniqueId}CustomRouteBack`]) {
          globalThis.temp[`${uniqueId}CustomRouteBack`] = args => {
            if (!sharedValues[IN_PREVIEW].value) return

            // 在预览页拖拽返回时会有 scale 效果，所以需要矫正第 0 帧时的宽高，不然会在切 share-element 时突然失去 scale 效果
            const targetImageWidth = sharedValues[IMAGE_TARGET_WIDTH].value
            const targetImageHeight = sharedValues[IMAGE_TARGET_HEIGHT].value
            const scale = args.scale
            sharedValues[IMAGE_WIDTH].value = targetImageWidth * scale
            sharedValues[IMAGE_HEIGHT].value = targetImageHeight * scale
          }
          globalThis.eventBus.on(`${pageId}CustomRouteBack`, globalThis.temp[`${uniqueId}CustomRouteBack`])
        }
      })()

      this.applyAnimatedStyle('.img', () => {
        'worklet'
        return {
          width: `${sharedValues[IMAGE_WIDTH].value}px`,
          height: `${sharedValues[IMAGE_HEIGHT].value}px`,
        }
      })

      this.applyAnimatedStyle('.slot-wrapper', () => {
        'worklet'
        return {
          opacity: `${sharedValues[OPACITY].value}`,
        }
      })

      const resetShareValues = () => {
        sharedValues[IMAGE_WIDTH].value = sharedValues[IMAGE_INIT_WIDTH].value
        sharedValues[IMAGE_HEIGHT].value = sharedValues[IMAGE_INIT_HEIGHT].value
        sharedValues[OPACITY].value = 1
        sharedValues[IN_PREVIEW].value = false
      }

      // 监听图片切换
      this._onPreviewerChange = image => {
        if (image.id === this.data.image.id) {
          // 切到当前图片了
          sharedValues[OPACITY].value = 0
          sharedValues[IN_PREVIEW].value = true

          if (!this.imageRatio) {
            // 如果还没有 onload 事件，就用 getImageInfo 补一刀
            wx.getImageInfo({ src: this.data.src }).then(res => {
              const { width, height } = res
              const imageRatio = width / height

              this.imageRatio = imageRatio
              sharedValues[IMAGE_RATIO].value = imageRatio
              this.renderImage()
            })
          }
        } else {
          // 切到其他图片了，恢复原样
          resetShareValues()
        }
      }
      EventBus.on(`${pageId}PreviewerChange`, this._onPreviewerChange)

      this._onPreviewerHide = () => {
        // 预览页销毁了，恢复原样
        // 这里可能有返回动画，所以延迟 reset
        setTimeout(resetShareValues, 300)
      }
      EventBus.on(`${pageId}PreviewerDestroy`, this._onPreviewerHide)
    },

    detached() {
      const pageId = this.getPageId()
      const uniqueId = this.uniqueId
      runOnUI(() => {
        'worklet'
        if (globalThis.temp[`${uniqueId}CustomRouteBack`]) {
          globalThis.eventBus.off(`${pageId}CustomRouteBack`, globalThis.temp[`${uniqueId}CustomRouteBack`])
          delete globalThis.temp[`${uniqueId}CustomRouteBack`]
        }
      })()

      EventBus.off(`${pageId}PreviewerChange`, this._onPreviewerChange)
      EventBus.off(`${pageId}PreviewerDestroy`, this._onPreviewerHide)
    },
  },

  methods: {
    onFrame(evt) {
      'worklet'
      const rect = evt.rect
      const sharedValues = this.sharedValues ?? []
      const cntWidth = rect.width
      const cntHeight = rect.height
      const progress = evt.progress
      const imageRatio = sharedValues[IMAGE_RATIO].value
      const isPop = evt.direction === 1

      sharedValues[OPACITY].value = isPop ? progress : (1 - progress)

      let width = cntWidth
      let height = cntHeight
      if (imageRatio) {
        const cntRatio = cntWidth / cntHeight

        if (cntRatio > imageRatio) height = cntWidth / imageRatio
        else if (cntRatio <= imageRatio) width = cntHeight * imageRatio

        // 获取图片的初始大小和目标大小
        const initImageWidth = sharedValues[IMAGE_INIT_WIDTH].value
        const initImageHeight = sharedValues[IMAGE_INIT_HEIGHT].value
        const targetImageWidth = sharedValues[IMAGE_TARGET_WIDTH].value
        const targetImageHeight = sharedValues[IMAGE_TARGET_HEIGHT].value
        if (initImageWidth && initImageHeight && targetImageWidth && targetImageHeight) {
          if (isPop) {
            // 退出动画
            width = targetImageWidth - (targetImageWidth - initImageWidth) * progress
            height = targetImageHeight - (targetImageHeight - initImageHeight) * progress
          } else {
            // 进入动画
            width = initImageWidth + (targetImageWidth - initImageWidth) * progress
            height = initImageHeight + (targetImageHeight - initImageHeight) * progress
          }
        }
      }

      sharedValues[IMAGE_WIDTH].value = width
      sharedValues[IMAGE_HEIGHT].value = height
    },

    onImageLoad(evt) {
      const { width, height } = evt.detail
      const sharedValues = this.sharedValues ?? []
      const imageRatio = width / height

      this.imageRatio = imageRatio
      sharedValues[IMAGE_RATIO].value = imageRatio
      this.renderImage()
    },

    renderImage() {
      const sharedValues = this.sharedValues ?? []
      const { width: cntWidth, height: cntHeight } = this.data
      const imageRatio = this.imageRatio

      if (!windowWidth || !windowHeight) {
        const systemInfo = wx.getSystemInfoSync()
        windowWidth = systemInfo.windowWidth
        windowHeight = systemInfo.windowHeight
      }

      if (cntWidth && cntHeight && imageRatio) {
        let initWidth = cntWidth
        let initHeight = cntHeight
        let targetImageWidth = windowWidth
        let targetImageHeight = windowHeight
        const cntRatio = cntWidth / cntHeight
        const targetRatio = windowWidth / windowHeight

        if (cntRatio > imageRatio) {
          initHeight = cntWidth / imageRatio
        } else if (cntRatio < imageRatio) {
          initWidth = cntHeight * imageRatio
        }

        if (targetRatio > imageRatio) {
          targetImageWidth = targetImageHeight * imageRatio
        } else if (targetRatio < imageRatio) {
          targetImageHeight = targetImageWidth / imageRatio
        }

        sharedValues[IMAGE_INIT_WIDTH].value = initWidth
        sharedValues[IMAGE_INIT_HEIGHT].value = initHeight
        sharedValues[IMAGE_WIDTH].value = initWidth
        sharedValues[IMAGE_HEIGHT].value = initHeight
        sharedValues[IMAGE_TARGET_WIDTH].value = targetImageWidth
        sharedValues[IMAGE_TARGET_HEIGHT].value = targetImageHeight
      }
    },
  },
})
