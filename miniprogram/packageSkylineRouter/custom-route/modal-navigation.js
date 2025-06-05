import {
  CurveAnimation,
  Curves,
} from './util'

const ModalNavigation = (customRouteContext) => {
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
  const nextPageBoxShadow = '0px 0px 10px 5px rgba(0, 0, 0, 0.12)'

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
      boxShadow: nextPageBoxShadow,
      borderRadius: `${topRadius}px ${topRadius}px 0px 0px`,
      marginTop: `${nextPageTop}px`,
      transform: `translateX(${(1 - t) * 100}%)`,
    }
  }

  return {
    opaque: false,
    handlePrimaryAnimation,
  }
}

export default ModalNavigation