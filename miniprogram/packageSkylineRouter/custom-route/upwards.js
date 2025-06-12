import {
  CurveAnimation,
  Curves,
  Colors,
  genSecondaryAnimationHandler,
} from './util'

const {
  Easing
} = wx.worklet

const Upwards = (customRouteContext) => {
  const {
    primaryAnimation,
    primaryAnimationStatus,
    userGestureInProgress,
  } = customRouteContext

  const transitionCurve = Easing.cubicBezier(0.20, 0.00, 0.00, 1.00)
  
  const _curvePrimaryAnimation = CurveAnimation({
    animation: primaryAnimation,
    animationStatus: primaryAnimationStatus,
    curve: transitionCurve,
    reverseCurve: Easing.out(transitionCurve)
  })

  const handlePrimaryAnimation = () => {
    'worklet'
    let t = primaryAnimation.value
    if (!userGestureInProgress.value) {
      t = _curvePrimaryAnimation.value
    }

    return {
      overflow: 'hidden',
      transform: `translateY(${(1 - t) * 100}%)`
    }
  }

  const handlePreviousPageAnimation = () => {
    'worklet'
    return {}
  }

  const handleSecondaryAnimation = genSecondaryAnimationHandler(customRouteContext)

  return {
    barrierColor: Colors.black26,
    transitionDuration: 400,
    reverseTransitionDuration: 400,
    handlePrimaryAnimation,
    handlePreviousPageAnimation,
    handleSecondaryAnimation
  }
}

export default Upwards