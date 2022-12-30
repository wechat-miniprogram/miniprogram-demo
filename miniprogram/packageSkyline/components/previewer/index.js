import { getRectInfo } from '../../utils/tool'
import { PREVIEWER_GESTURE_STATE, THUMBNAIL_CNT_HEIGHT } from '../../utils/constant'

const timing = wx.worklet.timing
const runOnUI = wx.worklet.runOnUI
const shared = wx.worklet.shared

const PrimaryAnimationStatus = {
  DISMISSED: 0,
  FORWARD: 1,
  REVERSE: 2,
  COMPLETED: 3,
}

const GestureState = {
  POSSIBLE: 0,
  BEGIN: 1,
  ACTIVE: 2,
  END: 3,
  CANCELLED: 4,
}

// sharedValues
const TRANSLATE_X = 0
const TRANSLATE_Y = 1
const START_Y = 2
const OPACITY = 3
const SCALE = 4
const MIN_SCALE = 5
const THUMBNAIL_CNT_CUT_HEIGHT = 6
const USER_GESTURE_IN_PROGRESS = 7
const GESTURE_STATE = 8
const PAGE_ID = 9
const TEMP_LAST_SCALE = 10
const WINDOW_WIDTH = 11

function clamp(value, min, max) {
  'worklet'
  return Math.min(max, Math.max(min, value))
}

function recoverTiming(target, callback) {
  'worklet'
  return timing(target, { duration: 200 }, callback)
}

function calcOpacity(moveY, windowHeight) {
  'worklet'
  const opacityRatio = moveY / (windowHeight / 2)
  return clamp((1 - opacityRatio) ** 3, 0, 1) // 最透明程度为 0
}

function calcScale(moveY, windowHeight) {
  'worklet'
  const scaleRange = 0.4
  const scaleRatio = moveY / (windowHeight / 3 * 2)
  return clamp(1 - scaleRange * scaleRatio, 0.6, 1) // 最小为 0.6
}

function calcThumbnailHeight(scale) {
  'worklet'
  return clamp(THUMBNAIL_CNT_HEIGHT * ((scale - 0.6) / 0.4), 0, THUMBNAIL_CNT_HEIGHT) // scale 最小为 0.6
}

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

  lifetimes: {
    created() {
      this.sharedValues = [
        shared(0), // TRANSLATE_X
        shared(0), // TRANSLATE_Y
        shared(0), // START_Y
        shared(1), // OPACITY
        shared(1), // SCALE
        shared(1), // MIN_SCALE
        shared(THUMBNAIL_CNT_HEIGHT), // THUMBNAIL_CNT_CUT_HEIGHT
        shared(false), // USER_GESTURE_IN_PROGRESS
        shared(0), // GESTURE_STATE
        shared(0), // PAGE_ID
        shared(1), // TEMP_LAST_SCALE
        shared(0), // WINDOW_WIDTH
      ]
    },

    attached() {
      const sourcePageId = this.data.sourcePageId
      const { windowWidth, windowHeight } = getRectInfo()
      const pageId = this.getPageId()
      const sharedValues = this.sharedValues ?? []
      sharedValues[PAGE_ID].value = pageId
      sharedValues[WINDOW_WIDTH].value = windowWidth

      this.customRouteContext = wx.router.getRouteContext(this)

      runOnUI(() => {
        'worklet'
        if (!globalThis.temp[`${pageId}GestureBack`]) {
          globalThis.temp[`${pageId}GestureBack`] = args => {
            if (sharedValues[GESTURE_STATE].value === PREVIEWER_GESTURE_STATE.Moving) return
            sharedValues[GESTURE_STATE].value = PREVIEWER_GESTURE_STATE.Back

            const { moveX, moveY, offsetY } = args

            // 横向永远跟手走
            sharedValues[TRANSLATE_X].value += moveX
            // 竖向在手指回到原处再往上时增加阻尼
            if (sharedValues[TRANSLATE_Y].value < 0) {
              const fy = 0.52 * ((1 - Math.min(offsetY / windowHeight, 1)) ** 2)
              const translateY = sharedValues[TRANSLATE_Y].value + Math.ceil(moveY * fy)
              sharedValues[TRANSLATE_Y].value = translateY
            } else {
              sharedValues[TRANSLATE_Y].value += moveY
            }

            // 拖动时的渐变
            sharedValues[OPACITY].value = calcOpacity(offsetY, windowHeight)

            // 拖动时的大小变化
            const scale = calcScale(offsetY, windowHeight)
            sharedValues[SCALE].value = scale
            sharedValues[MIN_SCALE].value = Math.min(scale, sharedValues[MIN_SCALE].value)

            // 缩略图栏的高度变化
            sharedValues[THUMBNAIL_CNT_CUT_HEIGHT].value = calcThumbnailHeight(scale)
          }
          globalThis.eventBus.on(`${pageId}Back`, globalThis.temp[`${pageId}GestureBack`])
        }

        if (!globalThis.temp[`${pageId}GestureBackEnd`]) {
          globalThis.temp[`${pageId}GestureBackEnd`] = () => {
            const moveY = sharedValues[TRANSLATE_Y].value
            const scale = sharedValues[SCALE].value
            const minScale = sharedValues[MIN_SCALE].value
            const { didPop } = this.customRouteContext || {}

            if (moveY > 1 && scale <= (minScale + 0.01)) {
              // 必须是一直处于缩小行为才退页面，否则恢复
              globalThis.eventBus.emit(`${sourcePageId}CustomRouteBack`, { scale })
              didPop()
            } else {
              sharedValues[OPACITY].value = recoverTiming(1)
              sharedValues[TRANSLATE_X].value = recoverTiming(0)
              sharedValues[TRANSLATE_Y].value = recoverTiming(0)
              sharedValues[SCALE].value = recoverTiming(1, () => {
                'worklet'
                sharedValues[GESTURE_STATE].value = PREVIEWER_GESTURE_STATE.Init
              })
              sharedValues[MIN_SCALE].value = 1
              sharedValues[THUMBNAIL_CNT_CUT_HEIGHT].value = recoverTiming(THUMBNAIL_CNT_HEIGHT)
            }
          }
          globalThis.eventBus.on(`${pageId}BackEnd`, globalThis.temp[`${pageId}GestureBackEnd`])
        }

        if (!globalThis.temp[`${pageId}GestureToggle`]) {
          globalThis.temp[`${pageId}GestureToggle`] = () => {
            if (sharedValues[GESTURE_STATE].value === PREVIEWER_GESTURE_STATE.Moving) return
            sharedValues[GESTURE_STATE].value = PREVIEWER_GESTURE_STATE.Toggle
          }
          globalThis.eventBus.on(`${pageId}Toggle`, globalThis.temp[`${pageId}GestureToggle`])
        }

        if (!globalThis.temp[`${pageId}GestureMoving`]) {
          globalThis.temp[`${pageId}GestureMoving`] = () => {
            sharedValues[GESTURE_STATE].value = PREVIEWER_GESTURE_STATE.Moving
          }
          globalThis.eventBus.on(`${pageId}Moving`, globalThis.temp[`${pageId}GestureMoving`])
        }
      })()

      this.applyAnimatedStyle('#preview-home >>> .need-transform-on-back', () => {
        'worklet'
        return {
          transform: `translate(${sharedValues[TRANSLATE_X].value}px, ${sharedValues[TRANSLATE_Y].value}px) scale(${sharedValues[SCALE].value})`,
        }
      })

      const { primaryAnimation, primaryAnimationStatus } = this.customRouteContext

      this.applyAnimatedStyle('#preview-home >>> .need-hide-on-back', () => {
        'worklet'
        const status = primaryAnimationStatus.value

        const isRunningAnimation = status === 1 || status === 2
        return {
          left: (isRunningAnimation || (sharedValues[GESTURE_STATE].value === PREVIEWER_GESTURE_STATE.Back)) ? '9999px' : '0',
        }
      })

      const fadeBackground = () => {
        'worklet'
        const status = primaryAnimationStatus.value

        const opacity = sharedValues[OPACITY].value
        if (!sharedValues[USER_GESTURE_IN_PROGRESS].value) {
          // 非手势触发
          const value = primaryAnimation.value
          let factor = value
          if (status === PrimaryAnimationStatus.FORWARD) {
            factor *= 3
            if (factor > 1) factor = 1
          } else if (status === PrimaryAnimationStatus.REVERSE) {
            factor = 1 - ((1 - factor) * 3)
            if (factor < 0) factor = 0
          }

          const newOpacity = opacity * factor
          return { opacity: newOpacity > 1 ? 1 : newOpacity }
        } else {
          // 手势触发
          return { opacity }
        }
      }

      this.applyAnimatedStyle('#preview-home >>> .preview-top-self', fadeBackground)
      this.applyAnimatedStyle('#preview-home >>> .preview-middle-self', fadeBackground)
      this.applyAnimatedStyle('#preview-home >>> .preview-bottom-self', fadeBackground)
      this.applyAnimatedStyle('#preview-home >>> .preview-thumbnail', () => {
        'worklet'
        const status = primaryAnimationStatus.value
        const height = sharedValues[THUMBNAIL_CNT_CUT_HEIGHT].value

        if (!sharedValues[USER_GESTURE_IN_PROGRESS].value) {
          // 非手势触发
          const value = primaryAnimation.value
          let factor = value
          if (status === PrimaryAnimationStatus.FORWARD) {
            factor *= 3
            if (factor > 1) factor = 1
          } else if (status === PrimaryAnimationStatus.REVERSE) {
            factor = 1 - ((1 - factor) * 3)
            if (factor < 0) factor = 0
          }

          const newHeight = height * factor
          return { height: `${newHeight > THUMBNAIL_CNT_HEIGHT ? THUMBNAIL_CNT_HEIGHT : newHeight}px` }
        } else {
          // 手势触发
          return { height: `${height}px` }
        }
      })
    },

    detached() {
      const pageId = this.getPageId()
      runOnUI(() => {
        'worklet'
        const removeList = ['Back', 'BackEnd', 'Toggle', 'Moving']
        removeList.forEach(item => {
          'worklet'
          const globalKey = `${pageId}Gesture${item}`
          if (globalThis.temp[globalKey]) {
            globalThis.eventBus.off(`${pageId}${item}`, globalThis.temp[globalKey])
            delete globalThis.temp[globalKey]
          }
        })
      })()
    },
  },

  methods: {
    onScale(evt) {
      'worklet'
      const sharedValues = this.sharedValues ?? []
      const pageId = sharedValues[PAGE_ID].value

      if (evt.state === GestureState.BEGIN) {
        sharedValues[START_Y].value = evt.focalY
        sharedValues[TEMP_LAST_SCALE].value = 1
        sharedValues[GESTURE_STATE].value = PREVIEWER_GESTURE_STATE.Init
        sharedValues[USER_GESTURE_IN_PROGRESS].value = true
      } else if (evt.state === GestureState.ACTIVE) {
        const focalX = evt.focalX
        const focalY = evt.focalY
        const moveX = evt.focalDeltaX
        const moveY = evt.focalDeltaY
        const offsetY = focalY - sharedValues[START_Y].value

        if (evt.pointerCount === 2) {
          // 双指放缩
          const pageId = sharedValues[PAGE_ID].value
          const realScale = evt.scale / sharedValues[TEMP_LAST_SCALE].value
          sharedValues[TEMP_LAST_SCALE].value = evt.scale

          globalThis.eventBus.emit(`${pageId}Scale`, {
            scale: realScale,
            centerX: focalX,
            centerY: focalY,
          })
        } else if (sharedValues[GESTURE_STATE].value === PREVIEWER_GESTURE_STATE.Back) {
          globalThis.eventBus.emit(`${pageId}Back`, {
            moveX,
            moveY,
            offsetY,
          })
        } else if (sharedValues[GESTURE_STATE].value === PREVIEWER_GESTURE_STATE.Toggle) {
          // ignore
        } else {
          globalThis.eventBus.emit(`${pageId}Move`, {
            moveX,
            moveY,
            offsetY,
            origin: 'move',
          })
        }
      } else if (evt.state === GestureState.END || evt.state === GestureState.CANCELLED) {
        const velocityX = evt.velocityX
        const velocityY = evt.velocityY
        sharedValues[USER_GESTURE_IN_PROGRESS].value = false

        if (sharedValues[GESTURE_STATE].value === PREVIEWER_GESTURE_STATE.Back) {
          globalThis.eventBus.emit(`${pageId}BackEnd`)
        } else if (sharedValues[GESTURE_STATE].value === PREVIEWER_GESTURE_STATE.Toggle) {
          sharedValues[GESTURE_STATE].value = PREVIEWER_GESTURE_STATE.Init
        } else {
          globalThis.eventBus.emit(`${pageId}End`, {
            velocityX,
            velocityY,
          })
          sharedValues[GESTURE_STATE].value = PREVIEWER_GESTURE_STATE.Init
        }
      }
    },

    onBack() {
      const sharedValues = this.sharedValues ?? []

      // 为了隐藏 previewer
      sharedValues[GESTURE_STATE].value = PREVIEWER_GESTURE_STATE.Back
    },

    shouldResponseOnMove() {
      'worklet'
      return true
    },
  },
})
