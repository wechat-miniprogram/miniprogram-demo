module.exports = Behavior({
  data: {
    theme: 'light'
  },
  methods: {
    themeChanged(theme) {
      this.setData({
        theme
      })
    }
  }
})
