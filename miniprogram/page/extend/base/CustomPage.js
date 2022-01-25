import themeMixin from './behaviors/theme'

const CustomPage = function (options) {
  return Page(
    Object.assign({}, options, {
      behaviors: [themeMixin].concat(options.behaviors || []),
      onLoad(query) {
        const app = getApp()
        if (this.themeChanged) {
          this.themeChanged(app.globalData.theme)
          if (app.watchThemeChange) app.watchThemeChange(this.themeChanged)
          if (options.onLoad) options.onLoad.call(this, query)
        }
      },
      onUnload() {
        const app = getApp()
        if (this.themeChanged) {
          if (app.unWatchThemeChange) app.unWatchThemeChange(this.themeChanged)
          if (options.onUnload) options.onUnload.call(this)
        }
      }
    })
  )
}

export default CustomPage
