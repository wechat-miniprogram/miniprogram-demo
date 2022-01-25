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
    /** *** */ return __webpack_require__(__webpack_require__.s = 8)
    /** *** */ }({

    /***/ 8:
    /***/ (function (module, exports, __webpack_require__) {
      const selectQuery = __webpack_require__(9)
      const target = '.weui-sticky'

      Component({
        options: {
          addGlobalClass: true,
          pureDataPattern: /^_/,
          multipleSlots: true
        },
        behaviors: [selectQuery],
        properties: {
          offsetTop: {
            type: Number,
            value: 0
          },
          zIndex: {
            type: Number,
            value: 99
          },
          disabled: {
            type: Boolean,
            value: false
          },
          container: {
            type: null
          }
        },
        data: {
          fixed: false,
          height: 0,
          _attached: false,
          _containerHeight: 0
        },
        observers: {
          disabled(newVal) {
            if (!this._attached) return
            newVal ? this.disconnectObserver() : this.initObserver()
          },
          container(newVal) {
            if (typeof newVal !== 'function' || !this.data.height) return
            this.observerContainer()
          }
        },
        lifetimes: {
          attached() {
            this.data._attached = true
            if (!this.data.disabled) this.initObserver()
          },
          detached() {
            this.data._attached = false
            this.disconnectObserver()
          }
        },
        methods: {
          getContainerRect() {
            const nodesRef = this.data.container()
            return new Promise(function (resolve) {
              return nodesRef.boundingClientRect(resolve).exec()
            })
          },
          initObserver() {
            const _this = this

            this.disconnectObserver()
            this.getRect(target).then(function (rect) {
              _this.setData({
                height: rect.height
              })
              _this.observerContent()
              _this.observerContainer()
            })
          },
          disconnectObserver(observerName) {
            if (observerName) {
              const observer = this[observerName]
              observer && observer.disconnect()
            } else {
              this.contentObserver && this.contentObserver.disconnect()
              this.containerObserver && this.containerObserver.disconnect()
            }
          },
          observerContent() {
            const _this2 = this

            const offsetTop = this.data.offsetTop

            this.disconnectObserver('contentObserver')
            const contentObserver = this.createIntersectionObserver({
              thresholds: [1],
              initialRatio: 1
            })
            contentObserver.relativeToViewport({
              top: -offsetTop
            })
            contentObserver.observe(target, function (res) {
              if (_this2.data.disabled) return
              _this2.setFixed(res.boundingClientRect.top)
            })
            this.contentObserver = contentObserver
          },
          observerContainer() {
            const _this3 = this

            const _data = this.data
            const container = _data.container
            const height = _data.height
            const offsetTop = _data.offsetTop

            if (typeof container !== 'function') return
            this.disconnectObserver('containerObserver')
            this.getContainerRect().then(function (rect) {
              _this3.getRect(target).then(function (contentRect) {
                const _contentTop = contentRect.top
                const _containerTop = rect.top
                const _containerHeight = rect.height
                const _relativeTop = _contentTop - _containerTop
                const containerObserver = _this3.createIntersectionObserver({
                  thresholds: [1],
                  initialRatio: 1
                })
                containerObserver.relativeToViewport({
                  top: _containerHeight - height - offsetTop - _relativeTop
                })
                containerObserver.observe(target, function (res) {
                  if (_this3.data.disabled) return
                  _this3.setFixed(res.boundingClientRect.top)
                })
                _this3.data._relativeTop = _relativeTop
                _this3.data._containerHeight = _containerHeight
                _this3.containerObserver = containerObserver
              })
            })
          },
          setFixed(top) {
            const _data2 = this.data
            const height = _data2.height
            const _containerHeight = _data2._containerHeight
            const _relativeTop = _data2._relativeTop
            const offsetTop = _data2.offsetTop

            const fixed = _containerHeight && height ? top >= height + offsetTop + _relativeTop - _containerHeight && top < offsetTop : top < offsetTop
            this.triggerEvent('scroll', {
              scrollTop: top,
              isFixed: fixed
            })
            this.setData({fixed})
          }
        }
      })
      /***/ }),

    /***/ 9:
    /***/ (function (module, exports, __webpack_require__) {
      module.exports = Behavior({
        methods: {
          getRect(selector) {
            const _this = this

            return new Promise(function (resolve, reject) {
              _this.createSelectorQuery().select(selector).boundingClientRect(function (rect) {
                if (rect) {
                  resolve(rect)
                } else {
                  reject(new Error('can not find selector: ' + selector))
                }
              }).exec()
            })
          },
          getAllRects(selector) {
            const _this2 = this

            return new Promise(function (resolve, reject) {
              _this2.createSelectorQuery().selectAll(selector).boundingClientRect(function (rects) {
                if (rects && rects.lenght > 0) {
                  resolve(rects)
                } else {
                  reject(new Error('can not find selector: ' + selector))
                }
              }).exec()
            })
          }
        }
      })
      /***/ })

    /** *** */}))
