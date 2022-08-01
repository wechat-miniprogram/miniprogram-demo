import { showTips } from '../../../common/tips';
import { worklet, supportWorklet } from '../../../common/worklet-api';

Page({
  data: {},
  onLoad: function onLoad() {
    if (this.renderer !== 'skyline' || !supportWorklet()) {
      showTips()
      return;
    }
  },
  jump: function jump() {
    wx.navigateTo({
      routeType: 'HalfScreenDialog',
      url: '/packageSkyline/pages/flutter/half-page/index'
    });
  },
  back: function back() {
    wx.navigateBack();
  }
});
