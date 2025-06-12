import {
  genSecondaryAnimationHandler,
  AnimationStatus
} from './util'

const {
  shared,
  derived,
  Easing
} = wx.worklet


const Zoom = (customRouteContext) => {
  const {
    primaryAnimation,
    primaryAnimationStatus,
  } = customRouteContext

  const intervalCurve = (begin, end) => {
    return (t) => {
      'worklet'
      const clamp = (v, lower, upper) => {
        if (v < lower) return lower
        if (v > upper) return upper
        return v
      }
      t = clamp((t - begin) / (end - begin), 0.0, 1.0)
      return t
    }
  }

  const chainTween = (begin, end, curve) => {
    return (t) => {
      'worklet'
      if (t === 0.0) {
        return begin
      }
      if (t === 1.0) {
        return end
      }
      const transform_t = curve(t)
      const current = begin + (end - begin) * transform_t
      return current
    }
  }

  const fastOutExtraSlowInTweenSequenceItems = [{
    tween: chainTween(0.0, 0.4, Easing.cubicBezier(0.05, 0.0, 0.133333, 0.06)),
    weight: 0.166666
  }, {
    tween: chainTween(0.4, 1.0, Easing.cubicBezier(0.208333, 0.82, 0.25, 1.0)),
    weight: 1.0 - 0.166666
  }]

  const tweenSequence = (tweenSequenceItems = []) => {
    const _interval = (start, end) => {
      const value = (t) => {
        'worklet'
        return (t - start) / (end - start)
      }

      const contains = (t) => {
        'worklet'
        return t >= start && t < end
      }
      return {
        value,
        contains
      }
    }

    const _items = tweenSequenceItems.slice()

    let totalWeight = 0.0
    for (let item of _items) {
      totalWeight += item.weight
    }

    const _intervals = []
    let start = 0.0
    for (let i = 0; i < _items.length; i++) {
      const end = i === _items.length - 1 ? 1.0 : (start + _items[i].weight / totalWeight)
      _intervals.push(_interval(start, end))
      start = end
    }

    return (t) => {
      'worklet'
      const _evaluateAt = (t, index) => {
        const element = _items[index]
        const tInterval = _intervals[index].value(t)
        return element.tween(tInterval)
      }

      if (t === 0) {
        return _evaluateAt(t, _items.length - 1)
      }
      for (let index = 0; index < _items.length; index++) {
        if (_intervals[index].contains(t)) {
          return _evaluateAt(t, index)
        }
      }
    }
  }

  const scaleCurveSequence = tweenSequence(fastOutExtraSlowInTweenSequenceItems)

  let zoomEnterTransition, zoomExitTransition

  (() => {
    const _fadeInTransition = chainTween(0.00, 1.00, intervalCurve(0.125, 0.250))
    const _scaleDownTransition = chainTween(1.10, 1.00, scaleCurveSequence)
    const _scaleUpTransition = chainTween(0.85, 1.00, scaleCurveSequence)

    zoomEnterTransition = (reverse = false) => {
      if (reverse) {
        return (t) => {
          'worklet'
          const opacity = 1.0
          const scale = _scaleDownTransition(t)
          return {
            opacity,
            transform: `scale(${scale})`
          }
        }
      }
      return (t) => {
        'worklet'
        const opacity = _fadeInTransition(t)
        const scale = _scaleUpTransition(t)
        return {
          opacity,
          transform: `scale(${scale})`
        }
      }
    }
  })();

  (() => {
    const _fadeOutTransition = chainTween(1.0, 0.0, intervalCurve(0.0825, 0.2075))
    const _scaleUpTransition = chainTween(1.00, 1.05, scaleCurveSequence)
    const _scaleDownTransition = chainTween(1.00, 0.90, scaleCurveSequence)

    zoomExitTransition = (reverse = false) => {
      if (reverse) {
        return (t) => {
          'worklet'
          const opacity = _fadeOutTransition(t)
          const scale = _scaleDownTransition(t)
          return {
            opacity,
            transform: `scale(${scale})`
          }
        }
      }
      return (t) => {
        'worklet'
        const opacity = 1.0
        const scale = _scaleUpTransition(t)
        return {
          opacity,
          transform: `scale(${scale})`
        }
      }
    }
  })();

  const _generateAnimationHandler = (animation, animationStatus, forwardTransition, reverseTransition) => {
    const _effectiveAnimationStatus = shared(animationStatus.value)
    return () => {
      'worklet'
      const _calculateEffectiveAnimationStatus = (lastEffective, current) => {
        switch (current) {
          case AnimationStatus.dismissed:
          case AnimationStatus.completed:
            return current
          case AnimationStatus.forward:
            switch (lastEffective) {
              case AnimationStatus.dismissed:
              case AnimationStatus.completed:
              case AnimationStatus.forward:
                return current
              case AnimationStatus.reverse:
                return lastEffective
            }
          case AnimationStatus.reverse:
            switch (lastEffective) {
              case AnimationStatus.dismissed:
              case AnimationStatus.completed:
              case AnimationStatus.reverse:
                return current
              case AnimationStatus.forward:
                return lastEffective
            }
        }
      }

      const progress = animation.value
      const currentStatus = animationStatus.value
      const lastEffectiveStatus = _effectiveAnimationStatus.value

      const effectiveAnimationStatus = _calculateEffectiveAnimationStatus(
        lastEffectiveStatus,
        currentStatus,
      )
      _effectiveAnimationStatus.value = effectiveAnimationStatus

      let style
      switch (effectiveAnimationStatus) {
        case AnimationStatus.dismissed:
        case AnimationStatus.forward:
          style = forwardTransition(progress)
          break
        case AnimationStatus.reverse:
        case AnimationStatus.completed:
          style = reverseTransition(1 - progress)
          break
      }
      return style
    }
  }

  const reverseAnimation = derived(() => {
    'worklet'
    return 1 - primaryAnimation.value
  })

  const reverseAnimationStatus = derived(() => {
    'worklet'
    const status = primaryAnimationStatus.value
    switch (status) {
      case AnimationStatus.forward: return AnimationStatus.reverse
      case AnimationStatus.reverse: return AnimationStatus.forward
      case AnimationStatus.completed: return AnimationStatus.dismissed
      case AnimationStatus.dismissed: return AnimationStatus.completed
    }
  })

  const handlePrimaryAnimation = _generateAnimationHandler(primaryAnimation, primaryAnimationStatus, zoomEnterTransition(), zoomExitTransition(true))

  const handlePreviousPageAnimation = _generateAnimationHandler(reverseAnimation, reverseAnimationStatus, zoomEnterTransition(true), zoomExitTransition())

  const handleSecondaryAnimation = genSecondaryAnimationHandler(customRouteContext)


  return {
    transitionDuration: 400,
    reverseTransitionDuration: 400,
    handlePrimaryAnimation,
    handlePreviousPageAnimation,
    handleSecondaryAnimation
  }
}

export default Zoom