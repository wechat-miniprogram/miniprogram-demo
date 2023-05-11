import {CurveAnimation, Curves} from './common'
import { isOfficialSkyline } from './util'

const HalfScreenDialogRouteBuilder = ({
  primaryAnimation,
  primaryAnimationStatus,
  userGestureInProgress,
}) => {
  const {screenHeight} = getApp().globalData
  console.info('HalfScreenDialogRouteBuilder ', screenHeight)

  const isSupportOverflow = isOfficialSkyline()

  const _curvePrimaryAnimation = CurveAnimation({
    animation: primaryAnimation,
    animationStatus: primaryAnimationStatus,
    curve: Curves.linearToEaseOut,
    reverseCurve: Curves.easeInToLinear,
  })

  const handlePrimaryAnimation = () => {
    'worklet'

    /**
     * 1. 手势拖动时采用原始值
     * 2. 页面进入时采用 curve 曲线生成的值
     * 3. 页面返回时采用 reverseCurve 生成的值
     */
    let t = primaryAnimation.value
    if (!userGestureInProgress.value) {
      t = _curvePrimaryAnimation.value
    }
    const top = 0.12
    const selfHeight = (1 - top) * screenHeight

    const marginTop = top * screenHeight
    const translateY = selfHeight * (1 - t)

    const style = {
      marginTop: `${marginTop}px`,
      borderRadius: '10px',
      overflow: 'hidden',
      height: `${selfHeight}px`,
      transform: `translateY(${translateY}px)`,
    }
    if (!isSupportOverflow) delete style.overflow
    return style
  }

  return {
    opaque: false,
    handlePrimaryAnimation,
    transitionDuration: 300,
    reverseTransitionDuration: 300,
    canTransitionTo: true,
    canTransitionFrom: true,
  }
}

export default HalfScreenDialogRouteBuilder
