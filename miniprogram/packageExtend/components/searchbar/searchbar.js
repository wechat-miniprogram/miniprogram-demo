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
    /** *** */ return __webpack_require__(__webpack_require__.s = 25)
    /** *** */ }({

    /***/ 25:
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
          focus: {
            type: Boolean,
            value: false
          },
          placeholder: {
            type: String,
            value: '搜索'
          },
          value: {
            type: String,
            value: ''
          },
          search: {
            type: Function,
            value: null
          },
          throttle: {
            type: Number,
            value: 500
          },
          cancelText: {
            type: String,
            value: '取消'
          },
          cancel: {
            type: Boolean,
            value: true
          }
        },
        data: {
          result: []
        },
        lastSearch: Date.now(),
        lifetimes: {
          attached: function attached() {
            if (this.data.focus) {
              this.setData({
                searchState: true
              })
            }
          }
        },
        methods: {
          clearInput() {
            // @ts-ignore
            this.setData({
              value: '',
              focus: true,
              result: []
            }) // @ts-ignore

            this.triggerEvent('clear')
          },
          inputFocus(e) {
            // this.setData({
            //     searchState: true
            // })
            // @ts-ignore
            this.triggerEvent('focus', e.detail)
          },
          inputBlur(e) {
            this.setData({
              focus: false
            })
            this.triggerEvent('blur', e.detail)
          },
          showInput() {
            this.setData({
              focus: true,
              searchState: true
            })
          },

          hideInput() {
            this.setData({
              searchState: false
            })
          },

          // @ts-ignore
          inputChange(e) {
            this.setData({
              value: e.detail.value
            })
            this.triggerEvent('input', e.detail)

            if (Date.now() - this.lastSearch < this.data.throttle) {
              return
            }

            if (typeof this.data.search !== 'function') {
              return
            }

            this.lastSearch = Date.now()
            this.timerId = setTimeout(() => {
              this.data.search(e.detail.value).then(json => {
                this.setData({
                  result: json
                })
              }).catch(err => {
                console.error('search error', err)
              })
            }, this.data.throttle)
          },
          selectResult(e) {
            const {
              index
            } = e.currentTarget.dataset
            const item = this.data.result[index]
            this.triggerEvent('selectresult', {
              index,
              item
            })
          }
        }
      })
      /***/ })

    /** *** */}))
