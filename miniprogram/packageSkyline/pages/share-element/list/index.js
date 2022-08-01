// @ts-nocheck
import { worklet, supportWorklet } from '../../../common/worklet-api';
import { cardList } from '../data';
import CustomRouteType from '../../../common/custom-route/index';
import { showTips } from '../../../common/tips';

Page({
  data: {
    cardList
  },

  onLoad() {
    if (this.renderer !== 'skyline' || !supportWorklet()) {
      showTips()
      return;
    }
  },

  go(e) {
    const { idx } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/packageSkyline/pages/share-element/card/index?idx=${idx}`,
      routeType: CustomRouteType.OpacityTransition,
    });
  },
});
