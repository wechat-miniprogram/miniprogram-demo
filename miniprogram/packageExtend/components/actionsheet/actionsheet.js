module.exports =
/** *** */ (function (modules) { // webpackBootstrap
    /** *** */ 	// The module cache
    /** *** */ 	const installedModules = {}
    /** *** */
    /** *** */ 	// The require function
    /** *** */ 	function __webpack_require__(moduleId) {
      /** *** */
      /** *** */ 		// Check if module is in cache
      /** *** */ 		if (installedModules[moduleId]) {
        /** *** */ 			return installedModules[moduleId].exports
        /** *** */ 		}
      /** *** */ 		// Create a new module (and put it into the cache)
      /** *** */ 		const module = installedModules[moduleId] = {
        /** *** */ 			i: moduleId,
        /** *** */ 			l: false,
        /** *** */ 			exports: {}
        /** *** */}
      /** *** */
      /** *** */ 		// Execute the module function
      /** *** */ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)
      /** *** */
      /** *** */ 		// Flag the module as loaded
      /** *** */ 		module.l = true
      /** *** */
      /** *** */ 		// Return the exports of the module
      /** *** */ 		return module.exports
      /** *** */ 	}
    /** *** */
    /** *** */
    /** *** */ 	// expose the modules object (__webpack_modules__)
    /** *** */ 	__webpack_require__.m = modules
    /** *** */
    /** *** */ 	// expose the module cache
    /** *** */ 	__webpack_require__.c = installedModules
    /** *** */
    /** *** */ 	// define getter function for harmony exports
    /** *** */ 	__webpack_require__.d = function (exports, name, getter) {
      /** *** */ 		if (!__webpack_require__.o(exports, name)) {
        /** *** */ 			Object.defineProperty(exports, name, {enumerable: true, get: getter})
        /** *** */ 		}
      /** *** */ 	}
    /** *** */
    /** *** */ 	// define __esModule on exports
    /** *** */ 	__webpack_require__.r = function (exports) {
      /** *** */ 		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /** *** */ 			Object.defineProperty(exports, Symbol.toStringTag, {value: 'Module'})
        /** *** */ 		}
      /** *** */ 		Object.defineProperty(exports, '__esModule', {value: true})
      /** *** */ 	}
    /** *** */
    /** *** */ 	// create a fake namespace object
    /** *** */ 	// mode & 1: value is a module id, require it
    /** *** */ 	// mode & 2: merge all properties of value into the ns
    /** *** */ 	// mode & 4: return value when already ns object
    /** *** */ 	// mode & 8|1: behave like require
    /** *** */ 	__webpack_require__.t = function (value, mode) {
      /** *** */ 		if (mode & 1) value = __webpack_require__(value)
      /** *** */ 		if (mode & 8) return value
      /** *** */ 		if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value
      /** *** */ 		const ns = Object.create(null)
      /** *** */ 		__webpack_require__.r(ns)
      /** *** */ 		Object.defineProperty(ns, 'default', {enumerable: true, value})
      /** *** */ 		if (mode & 2 && typeof value !== 'string') for (const key in value) __webpack_require__.d(ns, key, function (key) { return value[key] }.bind(null, key))
      /** *** */ 		return ns
      /** *** */ 	}
    /** *** */
    /** *** */ 	// getDefaultExport function for compatibility with non-harmony modules
    /** *** */ 	__webpack_require__.n = function (module) {
      /** *** */ 		const getter = module && module.__esModule
      /** *** */ 			? function getDefault() { return module.default }
      /** *** */ 			: function getModuleExports() { return module }
      /** *** */ 		__webpack_require__.d(getter, 'a', getter)
      /** *** */ 		return getter
      /** *** */ 	}
    /** *** */
    /** *** */ 	// Object.prototype.hasOwnProperty.call
    /** *** */ 	__webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property) }
    /** *** */
    /** *** */ 	// __webpack_public_path__
    /** *** */ 	__webpack_require__.p = ''
    /** *** */
    /** *** */
    /** *** */ 	// Load entry module and return exports
    /** *** */ 	return __webpack_require__(__webpack_require__.s = 1)
    /** *** */ }([
    /* 0 */,
    /* 1 */
    /***/ (function (module, exports, __webpack_require__) {
      Component({
        options: {
          multipleSlots: true,
          // 在组件定义时的选项中启用多slot支持
          addGlobalClass: true
        },
        properties: {
          title: {
            // 标题
            type: String,
            value: ''
          },
          showCancel: {
            // 是否显示取消按钮
            type: Boolean,
            value: true
          },
          cancelText: {
            // 取消按钮文案
            type: String,
            value: '取消'
          },
          maskClass: {
            // 遮罩层class
            type: String,
            value: ''
          },
          extClass: {
            // 弹出窗 class
            type: String,
            value: ''
          },
          maskClosable: {
            // 点击遮罩 关闭 actionsheet
            type: Boolean,
            value: true
          },
          mask: {
            // 是否需要 遮罩层
            type: Boolean,
            value: true
          },
          show: {
            // 是否开启 actionsheet
            type: Boolean,
            value: false
          },
          actions: {
            // actions 列表
            type: Array,
            value: [],
            // {text, extClass}
            observer: '_groupChange'
          }
        },
        methods: {
          _groupChange(e) {
            // 支持 一维数组 写法
            if (e.length > 0 && typeof e[0] !== 'string' && !(e[0] instanceof Array)) {
              this.setData({
                actions: [this.data.actions]
              })
            }
          },
          buttonTap(e) {
            const {
              value,
              groupindex,
              index
            } = e.currentTarget.dataset
            this.triggerEvent('actiontap', {
              value,
              groupindex,
              index
            })
          },
          closeActionSheet(e) {
            const {
              type
            } = e.currentTarget.dataset
            if (this.data.maskClosable || type) {
              // 点击 action 里面的 取消
              this.setData({
                show: false
              }) // 关闭回调事件
              this.triggerEvent('close')
            }
          }
        }
      })
      /***/ })
    /** *** */ ]))
