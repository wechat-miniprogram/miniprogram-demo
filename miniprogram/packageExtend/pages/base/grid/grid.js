import CustomPage from '../../../base/CustomPage'

const {GRID_DEMO_URL} = getApp().globalData
const app = getApp()

CustomPage({
  onShareAppMessage() {
    return {
      title: 'grid',
      path: 'page/weui/example/grid/grid'
    }
  },
  data: {
    grids: [
      {
        imgUrl: app.globalData.iconTabbar,
        url: GRID_DEMO_URL,
        text: 'Grid'
      },
      {
        imgUrl: app.globalData.iconTabbar,
        url: GRID_DEMO_URL,
        text: 'Grid'
      },
      {
        imgUrl: app.globalData.iconTabbar,
        url: GRID_DEMO_URL,
        text: 'Grid'
      },
      {
        imgUrl: app.globalData.iconTabbar,
        url: GRID_DEMO_URL,
        text: 'Grid'
      },
      {
        imgUrl: app.globalData.iconTabbar,
        url: GRID_DEMO_URL,
        text: 'Grid'
      },
      {
        imgUrl: app.globalData.iconTabbar,
        url: GRID_DEMO_URL,
        text: 'Grid'
      },
      {
        imgUrl: app.globalData.iconTabbar,
        url: GRID_DEMO_URL,
        text: 'Grid'
      },
      {
        imgUrl: app.globalData.iconTabbar,
        url: GRID_DEMO_URL,
        text: 'Grid'
      },
      {
        imgUrl: app.globalData.iconTabbar,
        url: GRID_DEMO_URL,
        text: 'Grid'
      }
    ]
  }
})
