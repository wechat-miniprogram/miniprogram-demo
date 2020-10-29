module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ({

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var selectQuery = __webpack_require__(9);
var target = '.weui-sticky';
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
        disabled: function disabled(newVal) {
            if (!this._attached) return;
            newVal ? this.disconnectObserver() : this.initObserver();
        },
        container: function container(newVal) {
            if (typeof newVal !== 'function' || !this.data.height) return;
            this.observerContainer();
        }
    },
    lifetimes: {
        attached: function attached() {
            this.data._attached = true;
            if (!this.data.disabled) this.initObserver();
        },
        detached: function detached() {
            this.data._attached = false;
            this.disconnectObserver();
        }
    },
    methods: {
        getContainerRect: function getContainerRect() {
            var nodesRef = this.data.container();
            return new Promise(function (resolve) {
                return nodesRef.boundingClientRect(resolve).exec();
            });
        },
        initObserver: function initObserver() {
            var _this = this;

            this.disconnectObserver();
            this.getRect(target).then(function (rect) {
                _this.setData({
                    height: rect.height
                });
                _this.observerContent();
                _this.observerContainer();
            });
        },
        disconnectObserver: function disconnectObserver(observerName) {
            if (observerName) {
                var observer = this[observerName];
                observer && observer.disconnect();
            } else {
                this.contentObserver && this.contentObserver.disconnect();
                this.containerObserver && this.containerObserver.disconnect();
            }
        },
        observerContent: function observerContent() {
            var _this2 = this;

            var offsetTop = this.data.offsetTop;

            this.disconnectObserver('contentObserver');
            var contentObserver = this.createIntersectionObserver({
                thresholds: [1],
                initialRatio: 1
            });
            contentObserver.relativeToViewport({
                top: -offsetTop
            });
            contentObserver.observe(target, function (res) {
                if (_this2.data.disabled) return;
                _this2.setFixed(res.boundingClientRect.top);
            });
            this.contentObserver = contentObserver;
        },
        observerContainer: function observerContainer() {
            var _this3 = this;

            var _data = this.data,
                container = _data.container,
                height = _data.height,
                offsetTop = _data.offsetTop;

            if (typeof container !== 'function') return;
            this.disconnectObserver('containerObserver');
            this.getContainerRect().then(function (rect) {
                _this3.getRect(target).then(function (contentRect) {
                    var _contentTop = contentRect.top;
                    var _containerTop = rect.top;
                    var _containerHeight = rect.height;
                    var _relativeTop = _contentTop - _containerTop;
                    var containerObserver = _this3.createIntersectionObserver({
                        thresholds: [1],
                        initialRatio: 1
                    });
                    containerObserver.relativeToViewport({
                        top: _containerHeight - height - offsetTop - _relativeTop
                    });
                    containerObserver.observe(target, function (res) {
                        if (_this3.data.disabled) return;
                        _this3.setFixed(res.boundingClientRect.top);
                    });
                    _this3.data._relativeTop = _relativeTop;
                    _this3.data._containerHeight = _containerHeight;
                    _this3.containerObserver = containerObserver;
                });
            });
        },
        setFixed: function setFixed(top) {
            var _data2 = this.data,
                height = _data2.height,
                _containerHeight = _data2._containerHeight,
                _relativeTop = _data2._relativeTop,
                offsetTop = _data2.offsetTop;

            var fixed = _containerHeight && height ? top >= height + offsetTop + _relativeTop - _containerHeight && top < offsetTop : top < offsetTop;
            this.triggerEvent('scroll', {
                scrollTop: top,
                isFixed: fixed
            });
            this.setData({ fixed: fixed });
        }
    }
});

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = Behavior({
  methods: {
    getRect: function getRect(selector) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.createSelectorQuery().select(selector).boundingClientRect(function (rect) {
          if (rect) {
            resolve(rect);
          } else {
            reject(new Error("can not find selector: " + selector));
          }
        }).exec();
      });
    },
    getAllRects: function getAllRects(selector) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.createSelectorQuery().selectAll(selector).boundingClientRect(function (rects) {
          if (rects && rects.lenght > 0) {
            resolve(rects);
          } else {
            reject(new Error("can not find selector: " + selector));
          }
        }).exec();
      });
    }
  }
});

/***/ })

/******/ });