const fastOutSlowIn = wx.worklet.Easing.bezier(0.4, 0.0, 0.2, 1.0).factory()

export function initRoute() {
  wx.router.addRouteBuilder('fadeToggle', ({ primaryAnimation }) => {
    const handlePrimaryAnimation = () => {
      'worklet'
      return {
        opacity: fastOutSlowIn(primaryAnimation.value),
      }
    }

    return {
      opaque: false,
      handlePrimaryAnimation,
      transitionDuration: 300,
      reverseTransitionDuration: 300,
      canTransitionTo: false,
      canTransitionFrom: false,
    }
  })
}
