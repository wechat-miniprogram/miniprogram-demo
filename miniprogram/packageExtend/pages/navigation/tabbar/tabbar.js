import CustomPage from '../../../base/CustomPage'

const app = getApp()

CustomPage({
  onShareAppMessage() {
    return {
      title: 'tabbar',
      path: 'page/weui/example/tabbar/tabbar'
    }
  },
  data: {
    list: [
      {
        text: '微信',
        iconPath: app.globalData.iconTabbar,
        selectedIconPath: app.globalData.iconTabbar,

        badge: '8'
      },
      {
        text: '通讯录',
        iconPath: app.globalData.iconTabbar,
        selectedIconPath: app.globalData.iconTabbar
      },
      {
        text: '发现',
        iconPath: app.globalData.iconTabbar,
        selectedIconPath: app.globalData.iconTabbar,
        dot: true
      },
      {
        text: '我',
        iconPath: app.globalData.iconTabbar,
        selectedIconPath: app.globalData.iconTabbar
      }
    ]
  },
  tabChange(e) {
    console.log('tab change', e)
  }
})
