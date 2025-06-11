// components/swiper-back/index.js
import {
  GestureState,
  lerp,
  clamp,
  Curves,
} from '../../custom-route/util'

const {
  timing,
} = wx.worklet

const {
  screenWidth
} = wx.getSystemInfoSync()

Component({
  options: {
    virtualHost: true
  },
  /**
     * 组件的属性列表
     */
  properties: {

  },

  /**
     * 组件的初始数据
     */
  data: {
    isHomePage: false
  },

  lifetimes: {
    attached() {
      const pageStack = getCurrentPages()
      if (pageStack.length === 1) {
        this.setData({
          isHomePage: true
        })
      }
      this.customRouteContext = wx.router.getRouteContext(this) || {}
    }
  },

  /**
     * 组件的方法列表
     */
  methods: {
    handleDragStart() {
      'worklet'

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

      const {
        primaryAnimation,
        stopUserGesture,
        didPop
      } = this.customRouteContext

      let animateForward = false
      if (Math.abs(velocity) >= 1.0) {
        animateForward = velocity <= 0
      } else {
        animateForward = primaryAnimation.value > 0.5
      }
      const t = primaryAnimation.value
      const animationCurve = Curves.fastLinearToSlowEaseIn
      if (animateForward) {
        const droppedPageForwardAnimationTime = Math.min(
          Math.floor(lerp(300, 0, t)),
          300,
        )
        primaryAnimation.value = timing(
          1.0,
          {
            duration: droppedPageForwardAnimationTime,
            easing: animationCurve,
          },
          () => {
            'worklet'

            stopUserGesture()
          },
        )
      } else {
        const droppedPageBackAnimationTime = Math.floor(lerp(0, 300, t))
        primaryAnimation.value = timing(
          0.0,
          {
            duration: droppedPageBackAnimationTime,
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

    onSwipeBack(evt) {
      'worklet'

      if (evt.state === GestureState.BEGIN) {
        this.handleDragStart()
      } else if (evt.state === GestureState.ACTIVE) {
        const delta = evt.deltaX / screenWidth
        this.handleDragUpdate(delta)
      } else if (evt.state === GestureState.END) {
        const velocity = evt.velocityX / screenWidth
        this.handleDragEnd(velocity)
      } else if (evt.state === GestureState.CANCELLED) {
        this.handleDragEnd(0.0)
      }
    },
  }
})
