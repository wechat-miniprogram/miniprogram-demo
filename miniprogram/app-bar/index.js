// components/app-bar/index.js

const { shared, timing, Easing } = wx.worklet

export const GestureState = {
  POSSIBLE: 0,
  BEGIN: 1,
  ACTIVE: 2,
  END: 3,
  CANCELLED: 4,
}

export const lerp = function (begin, end, t) {
  'worklet'
  return begin + (end - begin) * t
}

export const clamp = function (cur, lowerBound, upperBound) {
  'worklet'
  if (cur > upperBound) return upperBound
  if (cur < lowerBound) return lowerBound
  return cur
}

const systemInfo = wx.getSystemInfoSync()
const { statusBarHeight, screenHeight, screenWidth, safeArea } = systemInfo
console.info('@@@ systemInfo', systemInfo)
Component({
  properties: {

  },

  data: {
    maxCoverSize: 0,
    statusBarHeight: 0,
    musicCover: 'https://res.wx.qq.com/op_res/Nu9XXzXcXnD1j5EgWQ2ElxNcl1yMvnKypRo4MTbjOv7FC3saigGoOBTZibyESC7EXaClnPYhB6pvfb-IRmso6g'
  },

  lifetimes: {
    attached() {
      const progress = shared(0)
      const initCoverSize = 60 // 初始图片大小
      const pagePadding = 24
      const maxCoverSize = screenWidth - 2 * pagePadding
      const safeAreaInsetBottom = screenHeight - safeArea.bottom
      const isIOS = systemInfo.system.indexOf('iOS') >= 0
      this.setData({ statusBarHeight, maxCoverSize })

      this.applyAnimatedStyle('.cover', () => {
        'worklet'
        const height = initCoverSize + (maxCoverSize - initCoverSize) * progress.value
        return {
          width: `${height}px`,
          height:`${height}px`,
        }
      })

      this.applyAnimatedStyle('.expand-container', () => {
        'worklet'
        const t = progress.value
        const maxRadius = 30
        const radius = isIOS ? maxRadius * t : 0
        const initBarHeight = initCoverSize + 8 * 2 + safeAreaInsetBottom
        return {
          top: `${(screenHeight - initBarHeight) * (1 - t)}px`,
          borderRadius: `${radius}px ${radius}px 0px 0px`
        }
      })

      this.applyAnimatedStyle('.title-wrap', () => {
        'worklet'
        return {
          opacity: 1 - progress.value
        }
      })

      const navBarHeight = statusBarHeight + (isIOS ? 40 : 44)
      this.applyAnimatedStyle('.nav-bar', () => {
        'worklet'
        const t = progress.value
        const threshold = 0.8
        const opacity = t < threshold ? 0 : (t - threshold) / (1 - threshold)

        return {
          opacity,
          height: `${navBarHeight * progress.value}px`
        }
      })

      this.progress = progress
    }
  },

  methods: {
    close() {
      this.progress.value = timing(0, {
        duration: 250,
        easing: Easing.ease
      })
    },

    expand() {
      this.progress.value = timing(1, {
        duration: 250,
        easing: Easing.ease
      })
    },

    handleDragUpdate(delta) {
      'worklet'
      const curValue = this.progress.value
      const newVal = curValue - delta
      this.progress.value = clamp(newVal, 0.0, 1.0)
    },

    handleDragEnd(velocity) {
      'worklet'
      const t = this.progress.value
      let animateForward = false
      if (Math.abs(velocity) >= 1) {
        animateForward = velocity <= 0
      } else {
        animateForward = t > 0.7
      }
      const animationCurve = Easing.out(Easing.ease)
      if (animateForward) {
        this.progress.value = timing(
          1.0, {
          duration: 200,
          easing: animationCurve,
        })
      } else {
        this.progress.value = timing(
          0.0, {
          duration: 250,
          easing: animationCurve,
        })
      }
    },

    handleVerticalDrag(evt) {
      'worklet'
      if (evt.state === GestureState.ACTIVE) {
        const delta = evt.deltaY / screenHeight
        this.handleDragUpdate(delta)
      } else if (evt.state === GestureState.END) {
        const velocity = evt.velocityY / screenHeight
        this.handleDragEnd(velocity)
      } else if (evt.state === GestureState.CANCELLED) {
        this.handleDragEnd(0.0)
      }
    },
  },

})