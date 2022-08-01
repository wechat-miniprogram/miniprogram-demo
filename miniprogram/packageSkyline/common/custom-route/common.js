export const GestureState = {
  POSSIBLE: 0, // 0 此时手势未识别，如 panDown等
  BEGIN: 1, // 1 手势已识别
  ACTIVE: 2, // 2 连续手势活跃状态
  END: 3, // 3 手势终止
  CANCELLED: 4, // 4 手势取消，
}

export const ScrollState = {
  scrollStart: 0,
  scrollUpdate: 1,
  scrollEnd: 2,
}

export const AnimationStatus = {
  /// The animation is stopped at the beginning.
  dismissed: 0,

  /// The animation is running from beginning to end.
  forward: 1,

  /// The animation is running backwards, from end to beginning.
  reverse: 2,

  /// The animation is stopped at the end.
  completed: 3,
}

export const Curves = {};

if (wx.worklet) {
  const { Easing } = wx.worklet;
  Object.assign(Curves, {
    fastLinearToSlowEaseIn: Easing.bezier(0.18, 1.0, 0.04, 1.0).factory(),
    linearToEaseOut: Easing.bezier(0.35, 0.91, 0.33, 0.97).factory(),
    easeInToLinear: Easing.bezier(0.67, 0.03, 0.65, 0.09).factory(),
    fastOutSlowIn: Easing.bezier(0.4, 0.0, 0.2, 1.0).factory(),
  });
}

export const lerp = function (begin, end, t) {
  'worklet';
  return begin + (end - begin) * t;
};

export const clamp = function (cur, lowerBound, upperBound) {
  'worklet';
  if (cur > upperBound) return upperBound;
  if (cur < lowerBound) return lowerBound;
  return cur;
};

export function CurveAnimation({ animation, animationStatus, curve, reverseCurve }) {
  const { derived } = wx.worklet;

  return derived(() => {
    'worklet';
    const useForwardCurve = !reverseCurve || animationStatus.value !== AnimationStatus.reverse;
    const activeCurve = useForwardCurve ? curve : reverseCurve;

    const t = animation.value;
    if (!activeCurve) return t;
    if (t === 0 || t === 1) return t;
    return activeCurve(t);
  });
}

const emptyFn = function () {
  'worklet';
};

export const _kMinFlingVelocity = 1.0;
export const _kMaxPageBackAnimationTime = 300;
export const _kMaxDroppedSwipePageForwardAnimationTime = 800;
export const timing = wx.worklet?.timing || emptyFn;
