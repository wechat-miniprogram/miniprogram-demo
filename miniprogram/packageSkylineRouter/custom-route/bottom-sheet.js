import {
  CurveAnimation,
  Curves,
  Colors
} from './util'

const BottomSheet = (customRouteContext) => {
  const {
    primaryAnimation,
    primaryAnimationStatus,
    userGestureInProgress,
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

    const topRadius = 12
    
    return {
      overflow: 'hidden',
      borderRadius: `${topRadius}px ${topRadius}px 0px 0px`,
      marginTop: '40vh',
      transform: `translateY(${(1 - t) * 100}%)`,
    }
  }

  const handlePreviousPageAnimation = () => {
    'worklet'
    return {}
  }

  return {
    opaque: false,
    barrierColor: Colors.black87,
    barrierDismissible: true,
    transitionDuration: 400,
    reverseTransitionDuration: 400,
    fullscreenDrag: true,
    handlePrimaryAnimation,
    handlePreviousPageAnimation
  }
}

export default BottomSheet