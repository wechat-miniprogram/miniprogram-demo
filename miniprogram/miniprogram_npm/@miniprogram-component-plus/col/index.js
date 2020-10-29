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
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ({

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Component({
    properties: {
        span: {
            type: Number,
            value: 24
        },
        offset: {
            type: Number,
            value: 0
        },
        push: {
            type: Number,
            value: -1
        },
        pull: {
            type: Number,
            value: -1
        },
        xs: {
            type: Number,
            optionalTypes: [Object],
            value: -1
        },
        sm: {
            type: Number,
            optionalTypes: [Object],
            value: -1
        },
        md: {
            type: Number,
            optionalTypes: [Object],
            value: -1
        },
        lg: {
            type: Number,
            optionalTypes: [Object],
            value: -1
        },
        xl: {
            type: Number,
            optionalTypes: [Object],
            value: -1
        }
    },
    data: {
        classList: ['weui-col'],
        gutter: 0,
        paddingLeft: 0,
        paddingRight: 0
    },
    relations: {
        "../row/index": {
            type: 'parent',
            linked: function linked(target) {
                this.data.gutter = Number(target.data.gutter);
                this.updateGutter();
            },
            linkChanged: function linkChanged(target) {
                this.data.gutter = Number(target.data.gutter);
                this.updateGutter();
            }
        }
    },
    attached: function attached() {
        this.updateCol();
    },

    methods: {
        updateCol: function updateCol() {
            var classList = ['weui-col'];
            var paddingLeft = void 0,
                paddingRight = 0;
            classList.push('weui-col-' + this.data.span);
            classList.push('weui-col-offset-' + this.data.offset);
            if (this.data.gutter) {
                paddingLeft = this.data.gutter / 2 + 'px';
                paddingRight = paddingLeft;
            }
            if (this.data.push !== -1) {
                this.data.push && classList.push('weui-col-push-' + this.data.push);
            }
            if (this.data.pull !== -1) {
                this.data.pull && classList.push('weui-col-pull-' + this.data.pull);
            }
            this.screenSizeSet('xs', classList);
            this.screenSizeSet('sm', classList);
            this.screenSizeSet('md', classList);
            this.screenSizeSet('lg', classList);
            this.screenSizeSet('xl', classList);
            return this.setData({
                classList: classList
            });
        },
        updateGutter: function updateGutter() {
            var paddingLeft = void 0,
                paddingRight = 0;
            if (this.data.gutter) {
                paddingLeft = this.data.gutter / 2 + 'px';
                paddingRight = paddingLeft;
            }
            this.setData({
                paddingLeft: paddingLeft,
                paddingRight: paddingRight
            });
        },
        screenSizeSet: function screenSizeSet(screen, classList) {
            if (typeof this.data[screen] === 'number' && this.data[screen] !== -1) {
                classList.push('weui-col-' + screen + '-' + this.data[screen]);
            } else if (_typeof(this.data[screen]) === 'object') {
                typeof this.data[screen].offset === 'number' && classList.push('weui-col-' + screen + '-offset-' + this.data[screen].offset);
                typeof this.data[screen].push === 'number' && classList.push('weui-col-' + screen + '-push-' + this.data[screen].push);
                typeof this.data[screen].pull === 'number' && classList.push('weui-col-' + screen + '-pull-' + this.data[screen].pull);
                typeof this.data[screen].span === 'number' && classList.push('weui-col-' + screen + '-' + this.data[screen].span);
            }
        }
    }
});

/***/ })

/******/ });