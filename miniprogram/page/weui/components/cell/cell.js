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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ({

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Component({
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    properties: {
        hover: {
            type: Boolean,
            value: false
        },
        link: {
            type: Boolean,
            value: false
        },
        extClass: {
            type: String,
            value: ''
        },
        iconClass: {
            type: String,
            value: ''
        },
        bodyClass: {
            type: String,
            value: ''
        },
        icon: {
            type: String,
            value: ''
        },
        title: {
            type: String,
            value: ''
        },
        value: {
            type: String,
            value: ''
        },
        showError: {
            type: Boolean,
            value: false
        },
        prop: {
            type: String,
            value: ''
        },
        url: {
            type: String,
            value: ''
        },
        footerClass: {
            type: String,
            value: ''
        },
        footer: {
            type: String,
            value: ''
        },
        inline: {
            type: Boolean,
            value: true
        },
        hasHeader: {
            type: Boolean,
            value: true
        },
        hasFooter: {
            type: Boolean,
            value: true
        },
        hasBody: {
            type: Boolean,
            value: true
        }
    },
    relations: {
        '../form/form': {
            type: 'ancestor'
        },
        '../cells/cells': {
            type: 'ancestor'
        }
    },
    data: {
        inForm: false
    },
    methods: {
        setError: function setError(error) {
            this.setData({
                error: error || false
            });
        },
        setInForm: function setInForm() {
            this.setData({
                inForm: true
            });
        },
        setOuterClass: function setOuterClass(className) {
            this.setData({
                outerClass: className
            });
        },
        navigateTo: function navigateTo() {
            var _this = this;

            var data = this.data;
            if (data.url && data.link) {
                wx.navigateTo({
                    url: data.url,
                    success: function success(res) {
                        _this.triggerEvent('navigatesuccess', res, {});
                    },
                    fail: function fail(_fail) {
                        _this.triggerEvent('navigateerror', _fail, {});
                    }
                });
            }
        }
    }
});

/***/ })

/******/ });