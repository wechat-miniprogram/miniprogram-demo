Page({
  onShow() {
    wx.reportAnalytics('enter_home_programmatically', {})

    if (wx.canIUse('getExptInfoSync')) {
      console.log('getExptInfoSync expt_args_1', wx.getExptInfoSync(['expt_args_1']))
      console.log('getExptInfoSync expt_args_2', wx.getExptInfoSync(['expt_args_2']))
      console.log('getExptInfoSync expt_args_3', wx.getExptInfoSync(['expt_args_3']))
    }
    if (wx.canIUse('reportEvent')) {
      wx.reportEvent('expt_event_1', {expt_data: 1})
      wx.reportEvent('expt_event_2', {expt_data: 5})
      wx.reportEvent('expt_event_3', {expt_data: 9})
      wx.reportEvent('expt_event_4', {expt_data: 200})

      wx.reportEvent('weexpt_event_key_1', {option_1: 1, option_2: 10, option_str_1: 'abc'})
      wx.reportEvent('weexpt_event_key_1', {option_1: 'abc', option_2: '1000', option_str_1: '1'})
    }
  },
  onShareAppMessage() {
    return {
      title: '小程序交互动画展示',
      path: 'page/animation/index'
    }
  },
  onShareTimeline() {
    '小程序交互动画展示'
  },

  data: {
    list: [
      {
        id: 'SkylineBase',
        name: '基础组件',
        open: false,
        pages: [
          { url: 'worklet/animation/index', name: 'worklet 动画'},
          { url: 'worklet/gesture/index', name: '手势系统'},
          { url: 'share-element/list/index', name: '共享元素动画'},
          { url: 'worklet/bottom-sheet/index', name: '手势协商'},
          { key: 'custom-route', url: '/packageSkyline/pages/half-page/scale-page/index', name: '自定义路由' }
        ]
      }, {
        id: 'SkylineDemo',
        name: '常见交互组件',
        open: false,
        pages: [
          { url: '/packageSkylineExamples/examples/address-book/pages/index/index', name: '通讯录'},
          { key: 'custom-route', url: '/packageSkylineExamples/examples/album/pages/album/index', name: '相册'},
          { url: '/packageSkylineExamples/examples/card_transition/pages/list/list', name: '卡片转场'},
          { url: '/packageSkylineExamples/examples/half-screen/pages/index/index', name: '半屏弹窗'},
          { url: '/packageSkylineExamples/examples/segmented-half-screen/pages/index/index', name: '分段式半屏'},
          { url: '/packageSkylineExamples/examples/tab-indicator/pages/index/index', name: 'Tab 指示条'},
          { url: '/packageSkylineExamples/examples/product-list/pages/index/index', name: '搜索栏吸附'},
          { url: '/packageSkylineExamples/examples/expanded-scroll-view/pages/index/index', name: '沉浸式商品浏览'},
          { url: '/packageSkylineExamples/examples/refresher-two-level/index/index', name: '下拉二楼'}  
        ]
      }, {
        id: 'XRFrame',
        name: 'XRFrame 高性能XR解决方案',
        open: false,
        pages: [
          { url: 'pages/index/index', name: '总览'}
        ]
      }, {
        id: 'adaptive',
        name: '多端适配（需在PC端体验）',
        open: false,
        pages: [
          {name: '左右伸缩', url: 'adapt/telescopic/telescopic'},
          {name: '换行排列', url: 'adapt/linebreak/linebreak'},
          {name: '侧边导航栏', url: 'adapt/sidenavigation/sidenavigation'},
          {name: '分页展现', url: 'adapt/pagination/pagination'},
          {name: '自由布局', url: 'adapt/freelayout/freelayout'},
          {name: '分层展现', url: 'adapt/layeredpresentation/layeredpresentation'},
          {name: '横向拓展', url: 'adapt/horizontalexpansion/horizontalexpansion'}
        ]
      }
    ],
    theme: 'light'
  },

  onUnload() {
    if (wx.offThemeChange) {
      wx.offThemeChange()
    }
  },
  onLoad() {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({theme}) => {
        this.setData({theme})
      })
    }
  },

  kindToggle(e) {
    const id = e.currentTarget.id
    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list
    })
    wx.reportAnalytics('click_view_programmatically', {})
  },

  navToDoc(e) {
    wx.navigateTo({
      url: '/packageComponent/pages/doc-web-view/doc-web-view',
    })
  },
  // 打开自定义路由页面
  goToCustomRoute: function goToCustomRoute(evt) {
    const { url } = evt.currentTarget.dataset
    wx.navigateTo({
      routeType: 'ScaleTransition',
      url: `${url}`
    });
  },
})
