// pages/detail/index.js
Component({

  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    goOther() {
      wx.navigateTo({
        url: '../other/index',
      })
    },

    goOther2() {
      wx.navigateTo({
        url: '../other/index',
        routeType: 'wx://cupertino-modal'
      })
    }
  }
})