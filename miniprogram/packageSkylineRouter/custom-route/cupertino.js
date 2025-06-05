import {
  CurveAnimation,
  Curves,
  genSecondaryAnimationHandler
} from './util'

const Cupertino = (customRouteContext) => {
  const {
    primaryAnimation,
    primaryAnimationStatus,
    userGestureInProgress
  } = customRouteContext

  const _curvePrimaryAnimation = CurveAnimation({
    animation: primaryAnimation,
    animationStatus: primaryAnimationStatus,
    curve: Curves.linearToEaseOut,
    reverseCurve: Curves.easeInToLinear
  })

  const handlePrimaryAnimation = () => {
    'worklet'
    let t = primaryAnimation.value
    if (!userGestureInProgress.value) {
      t = _curvePrimaryAnimation.value
    }
    return {
      transform: `translateX(${(1 - t ) * 100}%)`
    }
  }

  const handlePreviousPageAnimation = () => {
    'worklet'
    let t = primaryAnimation.value
    if (!userGestureInProgress.value) {
      t = _curvePrimaryAnimation.value
    }
    return {
      transform: `translateX(${-1 / 3 * t * 100}%)`
    }
  }

  const handleSecondaryAnimation = genSecondaryAnimationHandler(customRouteContext)

  return {
    transitionDuration: 400,
    reverseTransitionDuration: 400,
    handlePrimaryAnimation,
    handlePreviousPageAnimation,
    handleSecondaryAnimation
  }
}

export default Cupertino