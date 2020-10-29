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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ({

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Component({
    options: {
        addGlobalClass: true,
        pureDataPattern: /^_/,
        multipleSlots: true
    },
    properties: {
        vtabs: { type: Array, value: [] },
        tabBarClass: { type: String, value: '' },
        activeClass: { type: String, value: '' },
        tabLineColor: { type: String, value: '#ff0000' },
        tabInactiveTextColor: { type: String, value: '#000000' },
        tabActiveTextColor: { type: String, value: '#ff0000' },
        tabInactiveBgColor: { type: String, value: '#eeeeee' },
        tabActiveBgColor: { type: String, value: '#ffffff' },
        activeTab: { type: Number, value: 0 },
        animation: { type: Boolean, value: true }
    },
    data: {
        currentView: 0,
        contentScrollTop: 0,
        _heightRecords: [],
        _contentHeight: {}
    },
    observers: {
        activeTab: function activeTab(_activeTab) {
            this.scrollTabBar(_activeTab);
        }
    },
    relations: {
        '../vtabs-content/index': {
            type: 'child',
            linked: function linked(target) {
                var _this = this;

                target.calcHeight(function (rect) {
                    _this.data._contentHeight[target.data.tabIndex] = rect.height;
                    if (_this._calcHeightTimer) {
                        clearTimeout(_this._calcHeightTimer);
                    }
                    _this._calcHeightTimer = setTimeout(function () {
                        _this.calcHeight();
                    }, 100);
                });
            },
            unlinked: function unlinked(target) {
                delete this.data._contentHeight[target.data.tabIndex];
            }
        }
    },
    lifetimes: {
        attached: function attached() {}
    },
    methods: {
        calcHeight: function calcHeight() {
            var length = this.data.vtabs.length;
            var _contentHeight = this.data._contentHeight;
            var _heightRecords = [];
            var temp = 0;
            for (var i = 0; i < length; i++) {
                _heightRecords[i] = temp + (_contentHeight[i] || 0);
                temp = _heightRecords[i];
            }
            this.data._heightRecords = _heightRecords;
        },
        scrollTabBar: function scrollTabBar(index) {
            var len = this.data.vtabs.length;
            if (len === 0) return;
            var currentView = index < 6 ? 0 : index - 5;
            if (currentView >= len) currentView = len - 1;
            this.setData({ currentView: currentView });
        },
        handleTabClick: function handleTabClick(e) {
            var _heightRecords = this.data._heightRecords;
            var index = e.currentTarget.dataset.index;
            var contentScrollTop = _heightRecords[index - 1] || 0;
            this.triggerEvent('tabclick', { index: index });
            this.setData({
                activeTab: index,
                contentScrollTop: contentScrollTop
            });
        },
        handleContentScroll: function handleContentScroll(e) {
            var _heightRecords = this.data._heightRecords;
            if (_heightRecords.length === 0) return;
            var length = this.data.vtabs.length;
            var scrollTop = e.detail.scrollTop;
            var index = 0;
            if (scrollTop >= _heightRecords[0]) {
                for (var i = 1; i < length; i++) {
                    if (scrollTop >= _heightRecords[i - 1] && scrollTop < _heightRecords[i]) {
                        index = i;
                        break;
                    }
                }
            }
            if (index !== this.data.activeTab) {
                this.triggerEvent('change', { index: index });
                this.setData({ activeTab: index });
            }
        }
    }
});

/***/ })

/******/ });