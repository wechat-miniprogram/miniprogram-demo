const { derived, Easing } = wx.worklet

export const GestureState = {
  POSSIBLE: 0,
  BEGIN: 1,
  ACTIVE: 2,
  END: 3,
  CANCELLED: 4,
}

export const clamp = (v, lower, upper) => {
  'worklet'
  if (v < lower) return lower
  if (v > upper) return upper
  return v
}

export const lerp = (begin, end, t) => {
  'worklet'
  return begin + (end - begin) * t
}

export const AnimationStatus = {
  dismissed: 0,
  forward: 1,
  reverse: 2,
  completed: 3,
}

export const Colors = {
  black12: 'rgba(0, 0, 0, 0.12)',
  black26: 'rgba(0, 0, 0, 0.26)',
  black38: 'rgba(0, 0, 0, 0.38)',
  black45: 'rgba(0, 0, 0, 0.45)',
  black54: 'rgba(0, 0, 0, 0.54)',
  black87: 'rgba(0, 0, 0, 0.87)',
}

export const Curves = {
  fastLinearToSlowEaseIn: Easing.cubicBezier(0.18, 1.0, 0.04, 1.0),
  linearToEaseOut: Easing.cubicBezier(0.35, 0.91, 0.33, 0.97),
  easeInToLinear: Easing.cubicBezier(0.67, 0.03, 0.65, 0.09),
  fastOutSlowIn: Easing.cubicBezier(0.4, 0.0, 0.2, 1.0),
  decelerateEasing: Easing.cubicBezier(0.0, 0.0, 0.2, 1.0),
  easeOutCubic: Easing.cubicBezier(0.215, 0.61, 0.355, 1.0),
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  ease: Easing.ease,
}

export const bottomSheetSuspendedCurve = (startingPoint, curve = Curves.easeOutCubic) => {
  'worklet'
  return (t) => {
    'worklet'
    if (t < startingPoint) return t
    if (t === 1.0) return t
    const curveProgress = (t - startingPoint) / (1 - startingPoint)
    const transformed = curve(curveProgress)
    return startingPoint + (1 - startingPoint) * transformed
  }
}

export function CurveAnimation({
  animation,
  animationStatus,
  curve,
  reverseCurve
}) {
  return derived(() => {
    'worklet'
    const useForwardCurve = !reverseCurve || animationStatus.value !== AnimationStatus.reverse
    const activeCurve = useForwardCurve ? curve : reverseCurve
    const t = animation.value
    if (!activeCurve) return t
    if (t === 0 || t === 1) return t
    return activeCurve(t)
  })
}

export function genSecondaryAnimationHandler(customRouteContext) {
  const {
    secondaryAnimation,
    secondaryAnimationStatus,
    userGestureInProgress,
  } = customRouteContext

  const _curveSecondaryAnimation = CurveAnimation({
    animation: secondaryAnimation,
    animationStatus: secondaryAnimationStatus,
    curve: Curves.linearToEaseOut,
    reverseCurve: Curves.easeInToLinear
  })

  const handleSecondaryAnimation = () => {
    'worklet'
    let t = secondaryAnimation.value
    if (!userGestureInProgress.value) {
      t = _curveSecondaryAnimation.value
    }
    return {
      transform: `translateX(${-1 / 3 * t * 100}%)`
    }
  }
  return handleSecondaryAnimation
}
