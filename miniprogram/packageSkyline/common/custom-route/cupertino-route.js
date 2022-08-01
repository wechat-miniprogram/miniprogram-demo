/* eslint-disable @typescript-eslint/naming-convention */

import { IRouteContext, CurveAnimation, Curves } from './common';

/**
 * 仿 iOS 返回自定义路由
 */
export const CupertinoRouteBuilder = ({
  primaryAnimation,
  secondaryAnimation,
  primaryAnimationStatus,
  secondaryAnimationStatus,
  userGestureInProgress,
}) => {
  const { windowWidth } = wx.getSystemInfoSync();

  const _curvePrimaryAnimation = CurveAnimation({
    animation: primaryAnimation,
    animationStatus: primaryAnimationStatus,
    curve: Curves.linearToEaseOut,
    reverseCurve: Curves.easeInToLinear,
  });

  const handlePrimaryAnimation = () => {
    'worklet';
    /**
     * 1. 手势拖动时采用原始值
     * 2. 页面进入时采用 curve 曲线生成的值
     * 3. 页面返回时采用 reverseCurve 生成的值
     */
    let t = primaryAnimation.value;
    if (!userGestureInProgress.value) {
      t = _curvePrimaryAnimation.value;
    }

    // 页面从右至左推入
    return {
      transform: [{ translateX: windowWidth * (1 - t) }],
    };
  };

  const _curveSecondaryAnimation = CurveAnimation({
    animation: secondaryAnimation,
    animationStatus: secondaryAnimationStatus,
    curve: Curves.linearToEaseOut,
    reverseCurve: Curves.easeInToLinear,
  });

  const handleSecondaryAnimation = () => {
    'worklet';
    let t = secondaryAnimation.value;
    if (!userGestureInProgress.value) {
      t = _curveSecondaryAnimation.value;
    }

    // 下一个页面推入时，当前页面继续向左推入 1/3
    return {
      transform: [{ translateX: (-1 / 3) * windowWidth * t }],
    };
  };

  // const handleDragStart = () => {
  //   'worklet';
  //   startUserGesture();
  // };

  // const handleDragUpdate = (delta: number) => {
  //   'worklet';
  //   const newVal = primaryAnimation.value - delta;
  //   primaryAnimation.value = clamp(newVal, 0.0, 1.0);
  // };

  // const handleDragEnd = (velocity: number) => {
  //   'worklet';
  //   let animateForward = false;
  //   if (Math.abs(velocity) >= _kMinFlingVelocity) {
  //     animateForward = velocity <= 0;
  //   } else {
  //     animateForward = primaryAnimation.value > 0.5;
  //   }
  //   const t = primaryAnimation.value;
  //   const animationCurve = Curves.fastLinearToSlowEaseIn;
  //   if (animateForward) {
  //     const droppedPageForwardAnimationTime = Math.min(
  //       Math.floor(lerp(_kMaxDroppedSwipePageForwardAnimationTime, 0, t)),
  //       _kMaxPageBackAnimationTime,
  //     );
  //     primaryAnimation.value = timing(
  //       1.0,
  //       {
  //         duration: droppedPageForwardAnimationTime,
  //         easing: animationCurve,
  //       },
  //       () => {
  //         stopUserGesture();
  //       },
  //     );
  //   } else {
  //     const droppedPageBackAnimationTime = Math.floor(lerp(0, _kMaxDroppedSwipePageForwardAnimationTime, t));
  //     primaryAnimation.value = timing(
  //       0.0,
  //       {
  //         duration: droppedPageBackAnimationTime,
  //         easing: animationCurve,
  //       },
  //       () => {
  //         didPop();
  //         stopUserGesture();
  //       },
  //     );
  //   }
  // };

  // const handleHorizontalDrag = (gestureEvent: any) => {
  //   'worklet';
  //   if (gestureEvent.state === GestureState.BEGIN) {
  //     handleDragStart();
  //   } else if (gestureEvent.state === GestureState.ACTIVE) {
  //     const delta = gestureEvent.deltaX / windowWidth;
  //     handleDragUpdate(delta);
  //   } else if (gestureEvent.state === GestureState.END) {
  //     const velocity = gestureEvent.velocityX / windowWidth;
  //     handleDragEnd(velocity);
  //   } else if (gestureEvent.state === GestureState.CANCELLED) {
  //     handleDragEnd(0.0);
  //   }
  // };
  return {
    opaque: true,
    handlePrimaryAnimation,
    handleSecondaryAnimation,
    transitionDuration: 300,
    reverseTransitionDuration: 300,
    canTransitionTo: true,
    canTransitionFrom: true,
  };
};

export default CupertinoRouteBuilder;
