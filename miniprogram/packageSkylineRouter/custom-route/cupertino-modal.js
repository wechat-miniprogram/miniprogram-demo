import {
  CurveAnimation,
  Curves,
} from './util'

const {
  shared,
  runOnJS
} = wx.worklet

const setNavigationBarColor = () => {
  wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#000000',
      duration: 50,
  });
}

const resetNavigationBarColor = () => {
  wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      duration: 50,
  });
}

const NavBarColorStatus = {
  white: 0,
  black: 1,
}

const CupertinoModal = (customRouteContext) => {
  const menuRect = wx.getMenuButtonBoundingClientRect()

  const {
    primaryAnimation,
    primaryAnimationStatus,
    userGestureInProgress,
  } = customRouteContext

  const topRadius = 12
  const offsetToMuenu = 2
  const navBarColoThreshold = 0.3
  const prevPageBrightness = 0.9
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

  const navBarColor = shared(NavBarColorStatus.black)

  const handlePrimaryAnimation = () => {
    'worklet'
    let t = primaryAnimation.value
    if (!userGestureInProgress.value) {
      t = _curvePrimaryAnimation.value
    }
    
    if (t > navBarColoThreshold) {
      if (navBarColor.value === NavBarColorStatus.black) {
        navBarColor.value = NavBarColorStatus.white
        runOnJS(setNavigationBarColor)()
      }
    } else {
      if (navBarColor.value === NavBarColorStatus.white) {
        navBarColor.value = NavBarColorStatus.black
        runOnJS(resetNavigationBarColor)()
      }
    }

    return {
      overflow: 'hidden',
      boxShadow: nextPageBoxShadow,
      borderRadius: `${topRadius}px ${topRadius}px 0px 0px`,
      marginTop: `${nextPageTop}px`,
      transform: `translateY(${(1 - t) * 100}%)`,
    }
  }

  const handlePreviousPageAnimation = () => {
    'worklet'
    let t = primaryAnimation.value
    if (!userGestureInProgress.value) {
      t = _curvePrimaryAnimation.value
    }

    const scale = 1 - t / 10
    const brightness = 1 + (prevPageBrightness - 1) * t
    
    return {
      overflow: 'hidden',
      filter: `brightness(${brightness})`,
      borderRadius: `${topRadius}px ${topRadius}px 0px 0px`,
      transformOrigin: 'top center',
      transform: `translateY(${prevPageTop * t}px) scale(${scale})`,
    }

  }

  return {
    opaque: false,
    transitionDuration: 400,
    reverseTransitionDuration: 400,
    handlePrimaryAnimation,
    handlePreviousPageAnimation,
  }
}

export default CupertinoModal