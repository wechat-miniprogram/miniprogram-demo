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
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ({

/***/ 22:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Component({
    options: {
        addGlobalClass: true
    },
    properties: {
        title: {
            type: String,
            value: '图片上传'
        },
        sizeType: {
            type: Array,
            value: ['original', 'compressed']
        },
        sourceType: {
            type: Array,
            value: ['album', 'camera']
        },
        maxSize: {
            type: Number,
            value: 5 * 1024 * 1024
        },
        maxCount: {
            type: Number,
            value: 1
        },
        files: {
            type: Array,
            value: [],
            observer: function observer(newVal, oldVal, changedP) {
                this.setData({
                    currentFiles: newVal
                });
            }
        },
        select: {
            type: Function,
            value: function value() {}
        },
        upload: {
            type: Function,
            value: null
        },
        tips: {
            type: String,
            value: ''
        },
        extClass: {
            type: String,
            value: ''
        },
        showDelete: {
            type: Boolean,
            value: true
        }
    },
    data: {
        currentFiles: [],
        showPreview: false,
        previewImageUrls: []
    },
    ready: function ready() {},

    methods: {
        previewImage: function previewImage(e) {
            var index = e.currentTarget.dataset.index;

            var previewImageUrls = [];
            this.data.files.map(function (item) {
                previewImageUrls.push(item.url);
            });
            this.setData({
                previewImageUrls: previewImageUrls,
                previewCurrent: index,
                showPreview: true
            });
        },
        chooseImage: function chooseImage(e) {
            var _this = this;

            if (this.uploading) return;
            wx.chooseImage({
                count: this.data.maxCount - this.data.files.length,
                success: function success(res) {
                    var invalidIndex = -1;
                    res.tempFiles.forEach(function (item, index) {
                        if (item.size > _this.data.maxSize) {
                            invalidIndex = index;
                        }
                    });
                    if (typeof _this.data.select === 'function') {
                        var ret = _this.data.select(res);
                        if (ret === false) {
                            return;
                        }
                    }
                    if (invalidIndex >= 0) {
                        _this.triggerEvent('fail', { type: 1, errMsg: 'chooseImage:fail size exceed ' + _this.data.maxSize, total: res.tempFilePaths.length, index: invalidIndex }, {});
                        return;
                    }
                    var mgr = wx.getFileSystemManager();
                    var contents = res.tempFilePaths.map(function (item) {
                        var fileContent = mgr.readFileSync(item);
                        return fileContent;
                    });
                    var obj = { tempFilePaths: res.tempFilePaths, tempFiles: res.tempFiles, contents: contents };
                    _this.triggerEvent('select', obj, {});
                    var files = res.tempFilePaths.map(function (item, i) {
                        return { loading: true, url: 'data:image/jpg;base64,' + wx.arrayBufferToBase64(contents[i]) };
                    });
                    if (!files || !files.length) return;
                    if (typeof _this.data.upload === 'function') {
                        var len = _this.data.files.length;
                        var newFiles = _this.data.files.concat(files);
                        _this.setData({ files: newFiles, currentFiles: newFiles });
                        _this.loading = true;
                        _this.data.upload(obj).then(function (json) {
                            _this.loading = false;
                            if (json.urls) {
                                var oldFiles = _this.data.files;
                                json.urls.forEach(function (url, index) {
                                    oldFiles[len + index].url = url;
                                    oldFiles[len + index].loading = false;
                                });
                                _this.setData({ files: oldFiles, currentFiles: newFiles });
                                _this.triggerEvent('success', json, {});
                            } else {
                                _this.triggerEvent('fail', { type: 3, errMsg: 'upload file fail, urls not found' }, {});
                            }
                        }).catch(function (err) {
                            _this.loading = false;
                            var oldFiles = _this.data.files;
                            res.tempFilePaths.map(function (item, index) {
                                oldFiles[len + index].error = true;
                                oldFiles[len + index].loading = false;
                            });
                            _this.setData({ files: oldFiles, currentFiles: newFiles });
                            _this.triggerEvent('fail', { type: 3, errMsg: 'upload file fail', error: err }, {});
                        });
                    }
                },
                fail: function fail(_fail) {
                    if (_fail.errMsg.indexOf('chooseImage:fail cancel') >= 0) {
                        _this.triggerEvent('cancel', {}, {});
                        return;
                    }
                    _fail.type = 2;
                    _this.triggerEvent('fail', _fail, {});
                }
            });
        },
        deletePic: function deletePic(e) {
            var index = e.detail.index;
            var files = this.data.files;
            var file = files.splice(index, 1);
            this.setData({
                files: files,
                currentFiles: files
            });
            this.triggerEvent('delete', { index: index, item: file[0] });
        }
    }
});

/***/ })

/******/ });