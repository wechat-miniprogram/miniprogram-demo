Page({
  onShow() {
    wx.reportAnalytics('enter_home_programmatically', {})

    // http://tapd.oa.com/miniprogram_experiment/prong/stories/view/1020425689866413543
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
      title: '小程序官方组件展示',
      path: 'page/component/index'
    }
  },
  onShareTimeline() {
    '小程序官方组件展示'
  },

  data: {
    list: [
      {
        id: 'view',
        name: '视图容器',
        open: false,
        pages: ['view', 'scroll-view', 'swiper', 'movable-view', 'cover-view']
      }, {
        id: 'content',
        name: '基础内容',
        open: false,
        pages: ['text', 'icon', 'progress', 'rich-text']
      }, {
        id: 'form',
        name: '表单组件',
        open: false,
        pages: ['button', 'checkbox', 'form', 'input', 'label', 'picker', 'picker-view', 'radio', 'slider', 'switch', 'textarea', 'editor']
      }, {
        id: 'nav',
        name: '导航',
        open: false,
        pages: ['navigator']
      }, {
        id: 'media',
        name: '媒体组件',
        open: false,
        pages: ['image', 'video', 'camera', 'live-pusher', 'live-player']
      }, {
        id: 'map',
        name: '地图',
        open: false,
        pages: ['map', { appid: 'wxe3f314db2e921db0', name: '腾讯位置服务示例中心'}]
      }, {
        id: 'canvas',
        name: '画布',
        open: false,
        pages: ['canvas-2d', 'webgl']
      }, {
        id: 'open',
        name: '开放能力',
        open: false,
        pages: ['ad', 'open-data', 'web-view']
      }, {
        id: 'obstacle-free',
        name: '无障碍访问',
        open: false,
        pages: ['aria-component']
      }, {
        id: 'Skyline',
        name: 'Skyline 渲染引擎',
        open: false,
        pages: [
          { url: 'worklet/animation/index', name: 'worklet 动画'},
          { url: 'worklet/gesture/index', name: '手势系统'},
          { url: 'share-element/list/index', name: '共享元素动画'},
          { url: 'worklet/bottom-sheet/index', name: '手势协商'},
          { key: 'custom-route', url: 'flutter/scale-page/index', name: '自定义路由' }
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
  goToCustomRoute: function goToCustomRoute() {
    wx.navigateTo({
      routeType: 'ScaleTransition',
      url: '/packageSkyline/pages/flutter/scale-page/index'
    });
  },
})
