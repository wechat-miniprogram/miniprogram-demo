// components/apiCategory/index.js
Component({

  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    apiCategory: '',
  },

  methods: {

  },

  pageLifetimes: {
    show() {
      const apiCategory = wx.getApiCategory()
      this.setData({ apiCategory })
    }
  }
})
