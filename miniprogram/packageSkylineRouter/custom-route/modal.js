import {
  Colors,
  CurveAnimation,
  Curves,
} from './util'

const Modal = (customRouteContext) => {
  const menuRect = wx.getMenuButtonBoundingClientRect()

  const {
    primaryAnimation,
    primaryAnimationStatus,
    userGestureInProgress,
  } = customRouteContext

  const topRadius = 12
  const offsetToMuenu = 2
  const prevPageVisibleOffset = 10
  const prevPageTop = menuRect.bottom + offsetToMuenu
  const nextPageTop = prevPageTop + prevPageVisibleOffset

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
      overflow: 'hidden',
      borderRadius: `${topRadius}px ${topRadius}px 0px 0px`,
      marginTop: `${nextPageTop}px`,
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
    handlePrimaryAnimation,
    handlePreviousPageAnimation
  }
}

export default Modal