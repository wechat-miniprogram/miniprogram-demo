// half-page/index.js
import {
  GestureState,
  lerp,
  clamp,
  Curves,
  bottomSheetSuspendedCurve,
} from '../../../custom-route/util'

const getList = (num) => {
  const ans = []
  for (let i = 0; i < num; i++) {
    ans.push({
      id: i
    })
  }
  return ans
}

const {
  timing,
  shared
} = wx.worklet

const _minFlingVelocity = 500
const _closeProgressThreshold = 0.6
const _duration = 400

Page({
  data: {
    list: getList(40),
    nextRouteType: '',
    fullscreen: false
  },

  onLoad(query) {
    const { nextRouteType, fullscreen, disableDrag } = query
    this.setData({
      nextRouteType,
      fullscreen
    })
    this.disableDrag = disableDrag == '1'
    this.initSharedValue()
  },

  goNextpage() {
    const { nextRouteType, fullscreen } = this.data
    if (!nextRouteType) return

    wx.navigateTo({
      url: `/packageSkylineRouter/pages/preset-router/list/index?fullscreen=${fullscreen}&nextRouteType=${nextRouteType}`,
      routeType: nextRouteType
    })
  },

  back() {
    wx.navigateBack({
      delta: 1,
    })
  },

  initSharedValue() {
    this.childHeight = shared(0)
    this.scrollTop = shared(0)
    this.startPan = shared(false)
    this.customRouteContext = wx.router.getRouteContext(this) || {}

    this.getChildHeight()
  },

  getChildHeight() {
    this.createSelectorQuery().select('.container').boundingClientRect((rect) => {
      this.childHeight.value = rect.height
    }).exec()
  },

  shouldPanResponse() {
    'worklet'

    return this.startPan.value
  },
  shouldScrollViewResponse(pointerEvent) {
    'worklet'

    const {
      primaryAnimation
    } = this.customRouteContext
    if (primaryAnimation.value < 1) return false
    const scrollTop = this.scrollTop.value
    const {
      deltaY
    } = pointerEvent
    const result = !(scrollTop <= 0 && deltaY > 0)
    this.startPan.value = !result
    return result
  },
  adjustDecelerationVelocity(velocity) {
    'worklet'

    const scrollTop = this.scrollTop.value
    return scrollTop <= 0 ? 0 : velocity
  },
  handleScroll(evt) {
    'worklet'

    this.scrollTop.value = evt.detail.scrollTop
  },
  handleDragStart() {
    'worklet'

    this.startPan.value = true
    const {
      startUserGesture
    } = this.customRouteContext
    startUserGesture()
  },

  handleDragUpdate(delta) {
    'worklet'

    const {
      primaryAnimation
    } = this.customRouteContext
    const newVal = primaryAnimation.value - delta
    primaryAnimation.value = clamp(newVal, 0.0, 1.0)
  },

  handleDragEnd(velocity) {
    'worklet'

    this.startPan.value = false
    const {
      primaryAnimation,
      stopUserGesture,
      userGestureInProgress,
      didPop
    } = this.customRouteContext

    if (!userGestureInProgress.value) return

    let animateForward = false
    if (Math.abs(velocity) >= _minFlingVelocity) {
      animateForward = velocity <= 0
    } else {
      animateForward = primaryAnimation.value > _closeProgressThreshold
    }
    const t = primaryAnimation.value
    const animationCurve = bottomSheetSuspendedCurve(t, Curves.decelerateEasing)

    if (animateForward) {
      const remainingFraction = 1.0 - t
      const simulationDuration = _duration * remainingFraction

      primaryAnimation.value = timing(
        1.0,
        {
          duration: simulationDuration,
          easing: animationCurve,
        },
        () => {
          'worklet'

          stopUserGesture()
        },
      )
    } else {
      // TODO: 结合松手时的速度作 spring 动画
      const remainingFraction = t
      const simulationDuration = _duration * remainingFraction
      const animationCurve = Curves.easeOutCubic

      primaryAnimation.value = timing(
        0.0,
        {
          duration: simulationDuration,
          easing: animationCurve,
        },
        () => {
          'worklet'

          stopUserGesture()
          didPop()
        },
      )
    }
  },

  handleVerticalDrag(evt) {
    'worklet'

    if (this.disableDrag) return
    if (evt.state === GestureState.BEGIN) {
      this.handleDragStart()
    } else if (evt.state === GestureState.ACTIVE) {
      const delta = evt.deltaY / this.childHeight.value
      this.handleDragUpdate(delta)
    } else if (evt.state === GestureState.END) {
      const velocity = evt.velocityY
      this.handleDragEnd(velocity)
    } else if (evt.state === GestureState.CANCELLED) {
      this.handleDragEnd(0.0)
    }
  },
})
