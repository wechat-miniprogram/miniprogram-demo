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
    /** *** */ 	return __webpack_require__(__webpack_require__.s = 23)
    /** *** */ }({

    /***/ 23:
    /***/ (function (module, exports, __webpack_require__) {
      Component({
        properties: {
          multi: {
            type: Boolean,
            value: true,
            observer: '_multiChange'
          },
          extClass: {
            type: String,
            value: ''
          },
          prop: {
            type: String,
            value: ''
          }
        },
        data: {
          targetList: [],
          parentCell: null
        },
        relations: {
          '../checkbox/checkbox': {
            type: 'descendant',
            linked: function linked(target) {
              this.data.targetList.push(target)
              target.setMulti(this.data.multi)
              if (!this.data.firstItem) {
                this.data.firstItem = target
              }
              if (target !== this.data.firstItem) {
                target.setOuterClass('weui-cell_wxss')
              }
            },
            unlinked: function unlinked(target) {
              let index = -1
              this.data.targetList.forEach(function (item, idx) {
                if (item === target) {
                  index = idx
                }
              })
              this.data.targetList.splice(index, 1)
              if (!this.data.targetList) {
                this.data.firstItem = null
              }
            }
          },
          '../form/form': {
            type: 'ancestor'
          },
          '../cells/cells': {
            type: 'ancestor',
            linked: function linked(target) {
              if (!this.data.parentCell) {
                this.data.parentCell = target
              }
              this.setParentCellsClass()
            },
            unlinked: function unlinked(target) {
              this.data.parentCell = null
            }
          }
        },
        methods: {
          checkedChange: function checkedChange(checked, target) {
            console.log('checked change', checked)
            if (this.data.multi) {
              const vals = []
              this.data.targetList.forEach(function (item) {
                if (item.data.checked) {
                  vals.push(item.data.value)
                }
              })
              this.triggerEvent('change', {value: vals})
            } else {
              let val = ''
              this.data.targetList.forEach(function (item) {
                if (item === target) {
                  val = item.data.value
                } else {
                  item.setData({
                    checked: false
                  })
                }
              })
              this.triggerEvent('change', {value: val}, {})
            }
          },
          setParentCellsClass: function setParentCellsClass() {
            const className = this.data.multi ? 'weui-cells_checkbox' : ''
            if (this.data.parentCell) {
              this.data.parentCell.setCellsClass(className)
            }
          },
          _multiChange: function _multiChange(multi) {
            this.data.targetList.forEach(function (target) {
              target.setMulti(multi)
            })
            if (this.data.parentCell) {
              this.data.parentCell.setCellMulti(multi)
            }
            return multi
          }
        }
      })
      /***/ })

    /** *** */}))
