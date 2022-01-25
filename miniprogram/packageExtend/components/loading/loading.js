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
    /** *** */ return __webpack_require__(__webpack_require__.s = 14)
    /** *** */ }({

    /***/ 14:
    /***/ (function (module, exports, __webpack_require__) {
      Component({
        options: {
          addGlobalClass: true
        },
        properties: {
          extClass: {
            type: String,
            value: ''
          },
          show: {
            type: Boolean,
            value: true,
            observer(newValue) {
              this._computedStyle(newValue, this.data.animated)
            }
          },
          animated: {
            type: Boolean,
            value: false,
            observer(newValue) {
              this._computedStyle(this.data.show, newValue)
            }
          },
          duration: {
            // 过渡动画时间
            type: Number,
            value: 350
          },
          type: {
            type: String,
            value: 'dot-gray' // 取值dot-white、dot-gray、circle
          },
          tips: {
            // type是circle的时候才有效
            type: String,
            value: '加载中'
          }
        },
        data: {
          animationData: {},
          animationInstance: {},
          displayStyle: 'none'
        },
        methods: {
          _computedStyle(show, animated) {
            if (!show) {
              if (!animated) {
                this.setData({
                  displayStyle: 'none'
                })
              } else {
                this._startAnimation()
              }
            } else {
              this.setData({
                displayStyle: ''
              })
            }
          },

          _startAnimation() {
            setTimeout(() => {
              const data = this.data
              const animation = data.animationInstance
              animation.height(0).step()
              this.setData({
                animationData: animation.export()
              })
            }, 0)
          }

        },
        lifetimes: {
          attached() {
            const data = this.data
            const animationInstance = wx.createAnimation({
              duration: data.duration,
              timingFunction: 'ease'
            })
            this.setData({
              animationInstance
            })

            this._computedStyle(this.data.show, this.data.animated)
          }

        }
      })
      /***/ })

    /** *** */}))
