module.exports =
/** *** */ (function (modules) { // webpackBootstrap
    /** *** */ // The module cache
    /** *** */ const installedModules = {}
    /** *** */
    /** *** */ // The require function
    /** *** */ function __webpack_require__(moduleId) {
      /** *** */
      /** *** */ // Check if module is in cache
      /** *** */ if (installedModules[moduleId]) {
        /** *** */ return installedModules[moduleId].exports
        /** *** */ }
      /** *** */ // Create a new module (and put it into the cache)
      /** *** */ const module = installedModules[moduleId] = {
        /** *** */ i: moduleId,
        /** *** */ l: false,
        /** *** */ exports: {}
        /** *** */}
      /** *** */
      /** *** */ // Execute the module function
      /** *** */ modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)
      /** *** */
      /** *** */ // Flag the module as loaded
      /** *** */ module.l = true
      /** *** */
      /** *** */ // Return the exports of the module
      /** *** */ return module.exports
      /** *** */ }
    /** *** */
    /** *** */
    /** *** */ // expose the modules object (__webpack_modules__)
    /** *** */ __webpack_require__.m = modules
    /** *** */
    /** *** */ // expose the module cache
    /** *** */ __webpack_require__.c = installedModules
    /** *** */
    /** *** */ // define getter function for harmony exports
    /** *** */ __webpack_require__.d = function (exports, name, getter) {
      /** *** */ if (!__webpack_require__.o(exports, name)) {
        /** *** */ Object.defineProperty(exports, name, {enumerable: true, get: getter})
        /** *** */ }
      /** *** */ }
    /** *** */
    /** *** */ // define __esModule on exports
    /** *** */ __webpack_require__.r = function (exports) {
      /** *** */ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /** *** */ Object.defineProperty(exports, Symbol.toStringTag, {value: 'Module'})
        /** *** */ }
      /** *** */ Object.defineProperty(exports, '__esModule', {value: true})
      /** *** */ }
    /** *** */
    /** *** */ // create a fake namespace object
    /** *** */ // mode & 1: value is a module id, require it
    /** *** */ // mode & 2: merge all properties of value into the ns
    /** *** */ // mode & 4: return value when already ns object
    /** *** */ // mode & 8|1: behave like require
    /** *** */ __webpack_require__.t = function (value, mode) {
      /** *** */ if (mode & 1) value = __webpack_require__(value)
      /** *** */ if (mode & 8) return value
      /** *** */ if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value
      /** *** */ const ns = Object.create(null)
      /** *** */ __webpack_require__.r(ns)
      /** *** */ Object.defineProperty(ns, 'default', {enumerable: true, value})
      /** *** */ if (mode & 2 && typeof value !== 'string') for (const key in value) __webpack_require__.d(ns, key, function (key) { return value[key] }.bind(null, key))
      /** *** */ return ns
      /** *** */ }
    /** *** */
    /** *** */ // getDefaultExport function for compatibility with non-harmony modules
    /** *** */ __webpack_require__.n = function (module) {
      /** *** */ const getter = module && module.__esModule
      /** *** */ ? function getDefault() { return module.default }
      /** *** */ : function getModuleExports() { return module }
      /** *** */ __webpack_require__.d(getter, 'a', getter)
      /** *** */ return getter
      /** *** */ }
    /** *** */
    /** *** */ // Object.prototype.hasOwnProperty.call
    /** *** */ __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property) }
    /** *** */
    /** *** */ // __webpack_public_path__
    /** *** */ __webpack_require__.p = ''
    /** *** */
    /** *** */
    /** *** */ // Load entry module and return exports
    /** *** */ return __webpack_require__(__webpack_require__.s = 3)
    /** *** */ }({

    /***/ 3:
    /***/ (function (module, exports, __webpack_require__) {
      Component({
        options: {
          multipleSlots: true,
          addGlobalClass: true
        },
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
          // 显示隐藏的时候opacity动画效果
          animated: {
            type: Boolean,
            value: true
          },
          // 显示隐藏导航，隐藏的时候navigation-bar的高度占位还在
          show: {
            type: Boolean,
            value: true,
            observer: '_showChange'
          },
          delta: {
            type: Number,
            value: 1
          }
        },
        data: {
          displayStyle: ''
        },
        attached() {
          const isSupport = !!wx.getMenuButtonBoundingClientRect
          const rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null
          wx.getSystemInfo({
            success: res => {
              const ios = !!(res.system.toLowerCase().search('ios') + 1)
              this.setData({
                ios,
                statusBarHeight: res.statusBarHeight,
                innerWidth: isSupport ? `width:${rect.left}px` : '',
                innerPaddingRight: isSupport ? `padding-right:${res.windowWidth - rect.left}px` : '',
                leftWidth: isSupport ? `width:${res.windowWidth - rect.left}px` : ''
              })
            }
          })
        },

        methods: {
          _showChange(show) {
            const animated = this.data.animated
            let displayStyle = ''

            if (animated) {
              displayStyle = `opacity: ${show ? '1' : '0'};-webkit-transition:opacity 0.5s;transition:opacity 0.5s;`
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

            this.triggerEvent('back', {
              delta: data.delta
            }, {})
          }
        }
      })
      /***/ })

    /** *** */}))
