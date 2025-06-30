const CustomRotue = {
  BottomSheet: 'wx://bottom-sheet',
  Upwards: 'wx://upwards',
  FadeUpwards: 'wx://fade-upwards',
  Zoom: 'wx://zoom',
  Modal: 'wx://modal',
  Cupertino: 'wx://cupertino',
  CupertinoModal: 'wx://cupertino-modal',
  CupertinoModalInside: 'wx://cupertino-modal-inside',
  ModalNavigation: 'wx://modal-navigation',
}

Page({
  data: {
    round: true,
    popGestureDirection: 'vertical',
    range: ['horizontal', 'vertical', 'multi'],
    list: [
      {
        id: 0,
        routeType: CustomRotue.BottomSheet,
        disableDrag: 1,
        content: 'BottomSheet'
      },
      {
        id: 1,
        routeType: CustomRotue.Upwards,
        nextRouteType: CustomRotue.Upwards,
        content: 'Upwards',
        fullscreen: 1,
      },
      {
        id: 2,
        routeType: CustomRotue.FadeUpwards,
        nextRouteType: CustomRotue.FadeUpwards,
        fullscreen: 1,
        content: 'Fade Upwards'
      },
      {
        id: 3,
        routeType: CustomRotue.Zoom,
        nextRouteType: CustomRotue.Zoom,
        fullscreen: 1,
        content: 'Zoom'
      },
      {
        id: 4,
        routeType: CustomRotue.Modal,
        nextRouteType: CustomRotue.ModalNavigation,
        content: 'Modal with navigation'
      },
      // {
      //   id: 5,
      //   routeType: CustomRotue.Cupertino,
      //   nextRouteType: CustomRotue.Cupertino,
      //   fullscreen: 1,
      //   content: 'Cupertino (iOS default)'
      // },
      {
        id: 6,
        routeType: CustomRotue.CupertinoModal,
        nextRouteType: CustomRotue.CupertinoModalInside,
        content: 'Cupertino Modal inside modal'
      },
      {
        id: 7,
        routeType: CustomRotue.CupertinoModal,
        nextRouteType: CustomRotue.ModalNavigation,
        fullscreen: 1,
        content: 'Cupertino Modal with navigation'
      },
    ]
  },
  onShareAppMessage() {
    return {
      title: 'page-return-gesture',
      path: 'packageSkylineRouter/page/page-return-gesture/index/index'
    }
  },
  onLoad() {},

  goNextPage(e) {
    const { routeType, nextRouteType, fullscreen, disableDrag } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/packageSkylineRouter/pages/preset-router/list/index?disableDrag=${disableDrag}&fullscreen=${fullscreen}&nextRouteType=${nextRouteType || ''}`,
      routeType,
      routeOptions: {
        round: this.data.round,
      },
      routeConfig: {
        fullscreenDrag: true,
        popGestureDirection: this.data.popGestureDirection
      }
    });
  },
  onChange(e) {
    const popGestureDirection = this.data.range[e.detail.value]
    this.setData({
      popGestureDirection
    })
  },

  toggleRound() {
    this.setData({
      round: !this.data.round
    })
  }
});