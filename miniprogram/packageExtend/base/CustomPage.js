import themeMixin from './behaviors/theme'

const CustomPage = function (options) {
  return Page(
    {
      ...options,
      behaviors: [themeMixin].concat(options.behaviors || []),
      onLoad(query) {
        const app = getApp()
        if (this.themeChanged) {
          this.themeChanged(app.globalData.theme)
          app.watchThemeChange && app.watchThemeChange(this.themeChanged)
          options.onLoad && options.onLoad.call(this, query)
        }
      },
      onUnload() {
        const app = getApp()
        if (this.themeChanged) {
          app.unWatchThemeChange && app.unWatchThemeChange(this.themeChanged)
          options.onUnload && options.onUnload.call(this)
        }
      },
      onShareAppMessage() {
        const route = this.route
        const segments = route.split('/')
        const title = segments[segments.length - 1]
        return {
          title,
          path: route,
        }
      },
    }
  )
}

export default CustomPage
