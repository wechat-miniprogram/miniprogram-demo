import { GestureState } from '../../../common/types';
import { worklet, supportWorklet } from '../../../common/worklet-api';
import { showTips } from '../../../common/tips';
const { shared, derived, spring } = worklet;

Page({
  data: {},

  onLoad() {
    if (this.renderer !== 'skyline' || !supportWorklet()) {
      showTips()
      return;
    }
    const x = shared(0);
    const y = shared(0);
    const pressed = shared(false);
    const scale = derived(() => spring(pressed.value ? 1.2 : 1));
    this.applyAnimatedStyle('.circle', () => {
      'worklet';
      return {
        backgroundColor: pressed.value ? '#5f9ea0' : '#adff2f',
        transform: `translate(${x.value}px, ${y.value}px) scale(${scale.value})`,
      };
    });

    this.x = x;
    this.y = y;
    this.pressed = pressed;
  },

  handlepan(gestureEvent) {
    'worklet';
    console.log('gestureEvent--------------', gestureEvent.state)
    if (gestureEvent.state === GestureState.POSSIBLE) {
      this.pressed.value = true;
    } else if (gestureEvent.state === GestureState.END || gestureEvent.state === GestureState.CANCELLED) {
      this.pressed.value = false;
      this.x.value = spring(0);
      this.y.value = spring(0);
    } else if (gestureEvent.state === GestureState.ACTIVE) {
      this.x.value += gestureEvent.deltaX;
      this.y.value += gestureEvent.deltaY;
    }
  },
});
