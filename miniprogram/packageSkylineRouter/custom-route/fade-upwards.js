import {
  Curves,
  genSecondaryAnimationHandler
} from './util'

const FadeUpwards = (customRouteContext) => {
  const {
    primaryAnimation,
  } = customRouteContext

  const handlePrimaryAnimation = () => {
    'worklet'
    let t = primaryAnimation.value
    const oProgress = Curves.easeIn(t)
    const yProgress = Curves.fastOutSlowIn(t)
    const transY = 0.25 * (1 - yProgress)

    return {
      opacity: 1 * oProgress,
      transform: `translateY(${transY * 100}%)`
    }
  }

  const handlePreviousPageAnimation = () => {
    'worklet'
    return {}
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

export default FadeUpwards