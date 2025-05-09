const app = getApp().globalData
Component({
  options: {
    styleIsolation: 'apply-shared', // 表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    extClass: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    background: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: ''
    },
    back: {
      type: Boolean,
      value: true
    },
    loading: {
      type: Boolean,
      value: false
    },
    animated: {
      // 显示隐藏的时候opacity动画效果
      type: Boolean,
      value: true
    },
    show: {
      // 显示隐藏导航，隐藏的时候navigation-bar的高度占位还在
      type: Boolean,
      value: true,
      observer: '_showChange'
    },
    // back为true的时候，返回的页面深度
    delta: {
      type: Number,
      value: 1
    }
  },
  /**
     * 组件的初始数据
     */
  data: {
    displayStyle: ''
  },
  attached() {
    const isSupport = !!wx.getMenuButtonBoundingClientRect
    const rect = wx.getMenuButtonBoundingClientRect
      ? wx.getMenuButtonBoundingClientRect()
      : null
    const isSkyline = this.renderer === 'skyline'
    this.setData({
      ios: !!(app.system.toLowerCase().search('ios') + 1),
      theme: app.theme || 'light',
      statusBarHeight: app.statusBarHeight,
      navBarHeight: rect.bottom - rect.top + 10 + (isSkyline ? 0 : app.statusBarHeight),
      innerWidth: isSupport ? `width:${rect.left}px` : '',
      innerPaddingRight: isSupport
        ? `padding-right:${app.windowWidth - rect.left}px`
        : '',
      leftWidth: isSupport ? `width:${app.windowWidth - rect.left}px` : '',
    })
    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        this.setData({ theme })
      })
    }
  },
  detached() {
    if (wx.offThemeChange) {
      wx.offThemeChange()
    }
  },
  /**
     * 组件的方法列表
     */
  methods: {
    _showChange(show) {
      const animated = this.data.animated
      let displayStyle = ''
      if (animated) {
        displayStyle = `opacity: ${show ? '1' : '0'
        };-webkit-transition:opacity 0.5s;transition:opacity 0.5s;`
      } else {
        displayStyle = `display: ${show ? '' : 'none'}`
      }
      this.setData({
        displayStyle
      })
    },
    back() {
      const data = this.data
      if (data.delta) {
        wx.navigateBack({
          delta: data.delta
        })
      }
      // 如果是直接打开的，就默认回首页
      if (getCurrentPages().length == 1) {
        wx.switchTab({
          url: '/page/component/index',
          complete: (res) => {
            console.log(res)
          }
        })
      }
      this.triggerEvent('back', { delta: data.delta }, {})
    }
  }
})
