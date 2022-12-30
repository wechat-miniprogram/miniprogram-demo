import { GestureState } from '../../common/types';
import { worklet, supportWorklet } from '../../common/worklet-api';
import { showTips } from '../../common/tips';
import { getSafeAreaInsetBottom, getStatusBarHeight } from '../../../util/util';
import { getCommentList } from '../../utils/comment'

const { shared, timing } = worklet;


Page({
  data: {
    animation: null,
    list: getCommentList(),
    safeAreaInsetBottom: getSafeAreaInsetBottom(),
    statusBarHeight: getStatusBarHeight(),
  },
  onLoad() {
    if (this.renderer !== 'skyline' || !supportWorklet()) {
      showTips()
      return;
    }
    const transY = shared(0);
    this.applyAnimatedStyle('.list-wrp', () => {
      'worklet';
      return { transform: `translateY(${transY.value}px)` };
    });
    this.transY = transY;
    this.scrollTop = shared(0);
    this.startPan = shared(false);
    const { windowWidth, windowHeight  } = wx.getSystemInfoSync()
    this.setData({
      w: windowWidth,
      h: windowHeight
    })
  },
  shouldPanResponse() {
    'worklet';
    return this.startPan.value;
  },
  shouldScrollViewResponse(pointerEvent) {
    'worklet';
    if (this.transY.value > 0) return false;
    const scrollTop = this.scrollTop.value;
    const { deltaY } = pointerEvent;
    const result = !(scrollTop <= 0 && deltaY > 0);
    this.startPan.value = !result;
    return result;
  },
  handlePan(gestureEvent) {
    'worklet';
    if (gestureEvent.state === GestureState.ACTIVE) {
      const curPosition = this.transY.value;
      const destination = Math.max(0, curPosition + gestureEvent.deltaY);
      if (curPosition === destination) return;
      this.transY.value = destination;
    }

    if (gestureEvent.state === GestureState.END || gestureEvent.state === GestureState.CANCELLED) {
      this.transY.value = timing(0);
      this.startPan.value = false;
    }
  },
  adjustDecelerationVelocity(velocity) {
    'worklet';
    const scrollTop = this.scrollTop.value;
    return scrollTop <= 0 ? 0 : velocity;
  },
  handleScroll(evt) {
    'worklet';
    this.scrollTop.value = evt.detail.scrollTop;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '半屏',
      path: 'packageSkyline/pages/half-screen/index'
    }
  },
});
