// index.js
import {
  GestureState,
  lerp,
  clamp,
  Curves,
  _kMinFlingVelocity,
  _kMaxPageBackAnimationTime,
  _kMaxDroppedSwipePageForwardAnimationTime,
  timing,
} from '../../../common/custom-route/common';

const app = getApp();

const { windowHeight } = app.globalData;

Page({
  data: {
    list: new Array(40).fill(1),
  },

  onLoad() {
    this.setData({
      renderer: this.renderer,
    });

    this._useWorklet = this.renderer === 'skyline' && !!wx.worklet;
    if (this._useWorklet) {
      this.customRouteContext = wx.router?.getRouteContext(this);
      this.scrollTop = wx.worklet.shared(0);
      this.startPan = wx.worklet.shared(false);
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#000000',
        duration: 300,
      });
    }
  },

  onUnload() {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      duration: 300,
    });
  },

  back() {
    wx.navigateBack({
      delta: 1,
    });
  },
  shouldPanResponse() {
    'worklet';
    return this.startPan.value;
  },
  shouldScrollViewResponse(pointerEvent) {
    'worklet';
    const { primaryAnimation } = this.customRouteContext;
    if (primaryAnimation.value < 1) return false;
    const scrollTop = this.scrollTop.value;
    const { deltaY } = pointerEvent;
    const result = !(scrollTop <= 0 && deltaY > 0);
    this.startPan.value = !result;
    return result;
  },
  adjustDecelerationVelocity(velocity) {
    'worklet';
    const scrollTop = this.scrollTop.value;
    return scrollTop <= 0 ? 0 : velocity;
  },
  handleScroll(event) {
    'worklet';
    if (!this._useWorklet) return;
    this.scrollTop.value = event.detail.scrollTop;
  },
  handleDragStart() {
    'worklet';
    this.startPan.value = true;
    const { startUserGesture } = this.customRouteContext;
    startUserGesture();
  },

  handleDragUpdate(delta) {
    'worklet';
    const { primaryAnimation } = this.customRouteContext;
    const newVal = primaryAnimation.value - delta;
    primaryAnimation.value = clamp(newVal, 0.0, 1.0);
  },

  handleDragEnd(velocity) {
    'worklet';
    this.startPan.value = false;
    const { primaryAnimation, stopUserGesture, didPop } = this.customRouteContext;

    let animateForward = false;
    if (Math.abs(velocity) >= _kMinFlingVelocity) {
      animateForward = velocity <= 0;
    } else {
      animateForward = primaryAnimation.value > 0.7;
    }
    const t = primaryAnimation.value;
    const animationCurve = Curves.fastLinearToSlowEaseIn;
    if (animateForward) {
      const droppedPageForwardAnimationTime = Math.min(
        Math.floor(lerp(_kMaxDroppedSwipePageForwardAnimationTime, 0, t)),
        _kMaxPageBackAnimationTime,
      );
      primaryAnimation.value = timing(
        1.0,
        {
          duration: droppedPageForwardAnimationTime,
          easing: animationCurve,
        },
        () => {
          stopUserGesture();
        },
      );
    } else {
      const droppedPageBackAnimationTime = Math.floor(lerp(0, _kMaxDroppedSwipePageForwardAnimationTime, t));
      primaryAnimation.value = timing(
        0.0,
        {
          duration: droppedPageBackAnimationTime,
          easing: animationCurve,
        },
        () => {
          didPop();
          stopUserGesture();
        },
      );
    }
  },

  handleVerticalDrag(gestureEvent) {
    'worklet';
    if (gestureEvent.state === GestureState.BEGIN) {
      this.handleDragStart();
    } else if (gestureEvent.state === GestureState.ACTIVE) {
      const delta = gestureEvent.deltaY / windowHeight;
      this.handleDragUpdate(delta);
    } else if (gestureEvent.state === GestureState.END) {
      const velocity = gestureEvent.velocityY / windowHeight;
      this.handleDragEnd(velocity);
    } else if (gestureEvent.state === GestureState.CANCELLED) {
      this.handleDragEnd(0.0);
    }
  },
});
