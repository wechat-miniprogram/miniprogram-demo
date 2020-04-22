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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isIPhone = false;
var deviceWidth = void 0;
var deviceDPR = void 0;
var BASE_DEVICE_WIDTH = 750;
var checkDeviceWidth = function checkDeviceWidth() {
  var info = wx.getSystemInfoSync();
  // console.log('info', info)
  isIPhone = info.platform === 'ios';
  var newDeviceWidth = info.screenWidth || 375;
  var newDeviceDPR = info.pixelRatio || 2;

  if (!isIPhone) {
    // HACK switch width and height when landscape
    // const newDeviceHeight = info.screenHeight || 375
    // 暂时不处理转屏的情况
  }

  if (newDeviceWidth !== deviceWidth || newDeviceDPR !== deviceDPR) {
    deviceWidth = newDeviceWidth;
    deviceDPR = newDeviceDPR;
    // console.info('Updated device width: ' + newDeviceWidth + 'px DPR ' + newDeviceDPR)
  }
};
checkDeviceWidth();

var eps = 1e-4;
var transformByDPR = function transformByDPR(number) {
  if (number === 0) {
    return 0;
  }
  number = number / BASE_DEVICE_WIDTH * deviceWidth;
  number = Math.floor(number + eps);
  if (number === 0) {
    if (deviceDPR === 1 || !isIPhone) {
      return 1;
    }
    return 0.5;
  }
  return number;
};

var rpxRE = /([+-]?\d+(?:\.\d+)?)rpx/gi;
// const inlineRpxRE = /(?::|\s|\(|\/)([+-]?\d+(?:\.\d+)?)rpx/g

var transformRpx = function transformRpx(style, inline) {
  if (typeof style !== 'string') {
    return style;
  }
  var re = rpxRE;
  return style.replace(re, function (match, num) {
    return transformByDPR(Number(num)) + (inline ? 'px' : '');
  });
};

module.exports = {
  transformRpx: transformRpx
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * recycle-view组件的api使用
 * 提供wx.createRecycleContext进行管理功能
 */
var RecycleContext = __webpack_require__(3);

/**
 * @params options参数是object对象，展开的结构如下
      id: recycle-view的id
      dataKey: recycle-item的wx:for绑定的数据变量
      page: recycle-view所在的页面或组件的实例
      itemSize: 函数或者是Object对象，生成每个recycle-item的宽和高
 * @return RecycleContext对象
 */
module.exports = function (options) {
  return new RecycleContext(options);
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint complexity: ["error", {"max": 50}] */
var recycleData = __webpack_require__(1);
var recycleViewportChangeFunc = __webpack_require__(4);
var transformRpx = __webpack_require__(0);

var RECT_SIZE = 200;

// eslint-disable-next-line no-complexity
function RecycleContext(_ref) {
  var _this = this;

  var id = _ref.id,
      dataKey = _ref.dataKey,
      page = _ref.page,
      itemSize = _ref.itemSize,
      useInPage = _ref.useInPage,
      placeholderClass = _ref.placeholderClass,
      root = _ref.root;

  if (!id || !dataKey || !page || !itemSize) {
    throw new Error('parameter id, dataKey, page, itemSize is required');
  }
  if (typeof itemSize !== 'function' && (typeof itemSize === 'undefined' ? 'undefined' : _typeof(itemSize)) !== 'object') {
    throw new Error('parameter itemSize must be function or object with key width and height');
  }
  if ((typeof itemSize === 'undefined' ? 'undefined' : _typeof(itemSize)) === 'object' && (!itemSize.width || !itemSize.height) && (!itemSize.props || !itemSize.queryClass || !itemSize.dataKey)) {
    throw new Error('parameter itemSize must be function or object with key width and height');
  }
  this.id = id;
  this.dataKey = dataKey;
  this.page = page;
  // 加root参数给useInPage单独使用
  this.root = root;
  this.placeholderClass = placeholderClass;
  page._recycleViewportChange = recycleViewportChangeFunc;
  this.comp = page.selectComponent('#' + id);
  this.itemSize = itemSize;
  this.itemSizeOpt = itemSize;
  // if (!this.comp) {
  // throw `<recycle-view> with id ${id} not found`
  // }
  this.useInPage = useInPage || false;
  if (this.comp) {
    this.comp.context = this;
    this.comp.setPage(page);
    this.comp.setUseInPage(this.useInPage);
  }
  if (this.useInPage && !this.root) {
    throw new Error('parameter root is required when useInPage is true');
  }
  if (this.useInPage) {
    this.oldPageScroll = this.root.onPageScroll;
    // 重写onPageScroll事件
    this.root.onPageScroll = function (e) {
      // this.checkComp();
      if (_this.comp) {
        _this.comp._scrollViewDidScroll({
          detail: {
            scrollLeft: 0,
            scrollTop: e.scrollTop
          }
        });
      }
      _this.oldPageScroll.apply(_this.root, [e]);
    };
    this.oldReachBottom = this.root.onReachBottom;
    this.root.onReachBottom = function (e) {
      if (_this.comp) {
        _this.comp.triggerEvent('scrolltolower', {});
      }
      _this.oldReachBottom.apply(_this.root, [e]);
    };
    this.oldPullDownRefresh = this.root.onPullDownRefresh;
    this.root.onPullDownRefresh = function (e) {
      if (_this.comp) {
        _this.comp.triggerEvent('scrolltoupper', {});
      }
      _this.oldPullDownRefresh.apply(_this.root, [e]);
    };
  }
}
RecycleContext.prototype.checkComp = function () {
  if (!this.comp) {
    this.comp = this.page.selectComponent('#' + this.id);
    if (this.comp) {
      this.comp.setUseInPage(this.useInPage);
      this.comp.context = this;
      this.comp.setPage(this.page);
    } else {
      throw new Error('the recycle-view correspond to this context is detached, pls create another RecycleContext');
    }
  }
};
RecycleContext.prototype.appendList = function (list, cb) {
  this.checkComp();
  var id = this.id;
  var dataKey = this.dataKey;
  if (!recycleData[id]) {
    recycleData[id] = {
      key: dataKey,
      id: id,
      list: list,
      sizeMap: {},
      sizeArray: []
    };
  } else {
    recycleData[id].dataKey = dataKey;
    recycleData[id].list = recycleData[id].list.concat(list);
  }
  this._forceRerender(id, cb);
  return this;
};
RecycleContext.prototype._forceRerender = function (id, cb) {
  this.isDataReady = true; // 首次调用说明数据已经ready了
  // 动态计算高度并缓存
  var that = this;
  var allrect = null;
  var parentRect = null;
  var count = 0;

  function setPlaceholderImage() {
    if (!allrect || !parentRect) return;
    var svgRects = [];
    for (var i = 0; i < count; i++) {
      svgRects.push({
        left: allrect[i].left - parentRect.left,
        top: allrect[i].top - parentRect.top,
        width: allrect[i].width,
        height: allrect[i].height
      });
    }
    that.comp.setPlaceholderImage(svgRects, {
      width: parentRect.width,
      height: parentRect.height
    });
  }
  function newcb() {
    if (cb) {
      cb();
    }
    // 计算placeholder, 只有在动态计算高度的时候才支持
    if (that.autoCalculateSize && that.placeholderClass) {
      var newQueryClass = [];
      that.placeholderClass.forEach(function (item) {
        newQueryClass.push('.' + that.itemSizeOpt.queryClass + ' .' + item);
      });
      // newQueryClass.push(`.` + that.itemSizeOpt.queryClass)
      count = newQueryClass.length;
      wx.createSelectorQuery().selectAll(newQueryClass.join(',')).boundingClientRect(function (rect) {
        if (rect.length < count) return;
        allrect = rect;
        setPlaceholderImage();
      }).exec();
      wx.createSelectorQuery().select('.' + that.itemSizeOpt.queryClass).boundingClientRect(function (rect) {
        parentRect = rect;
        setPlaceholderImage();
      }).exec();
    }
  }
  if (Object.prototype.toString.call(this.itemSizeOpt) === '[object Object]' && this.itemSizeOpt && !this.itemSizeOpt.width) {
    this._recalculateSizeByProp(recycleData[id].list, function (sizeData) {
      recycleData[id].sizeMap = sizeData.map;
      recycleData[id].sizeArray = sizeData.array;
      // 触发强制渲染
      that.comp.forceUpdate(newcb);
    });
    return;
  }
  var sizeData = this._recalculateSize(recycleData[id].list);
  recycleData[id].sizeMap = sizeData.map;
  // console.log('size is', sizeData.array, sizeData.map, 'totalHeight', sizeData.totalHeight)
  // console.log('sizeArray', sizeData.array)
  recycleData[id].sizeArray = sizeData.array;
  // 触发强制渲染
  this.comp.forceUpdate(cb);
};
function getValue(item, key) {
  if (!key) return item;
  if (typeof item[key] !== 'undefined') return item[key];
  var keyItems = key.split('.');
  for (var i = 0; i < keyItems.length; i++) {
    item = item[keyItems[i]];
    if (typeof item === 'undefined' || (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !item) {
      return undefined;
    }
  }
  return item;
}
function getValues(item, keys) {
  if (Object.prototype.toString.call(keys) !== '[object Array]') {
    keys = [keys];
  }
  var vals = {};
  for (var i = 0; i < keys.length; i++) {
    vals[keys[i]] = getValue(item, keys[i]);
  }
  return vals;
}
function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}
function isSamePureValue(item1, item2) {
  if ((typeof item1 === 'undefined' ? 'undefined' : _typeof(item1)) !== (typeof item2 === 'undefined' ? 'undefined' : _typeof(item2))) return false;
  if (isArray(item1) && isArray(item2)) {
    if (item1.length !== item2.length) return false;
    for (var i = 0; i < item1.length; i++) {
      if (item1[i] !== item2[i]) return false;
    }
    return true;
  }
  return item1 === item2;
}
function isSameValue(item1, item2, keys) {
  if (!isArray(keys)) {
    keys = [keys];
  }
  for (var i = 0; i < keys.length; i++) {
    if (!isSamePureValue(getValue(item1, keys[i]), getValue(item2, keys[i]))) return false;
  }
  return true;
}
RecycleContext.prototype._recalculateSizeByProp = function (list, cb) {
  var itemSize = this.itemSizeOpt;
  var propValueMap = this.propValueMap || [];
  var calcNewItems = [];
  var needCalcPropIndex = [];
  if (itemSize.cacheKey) {
    propValueMap = wx.getStorageSync(itemSize.cacheKey) || [];
    // eslint-disable-next-line no-console
    // console.log('[recycle-view] get itemSize from cache', propValueMap)
  }
  this.autoCalculateSize = true;
  var item2PropValueMap = [];
  for (var i = 0; i < list.length; i++) {
    var item2PropValueIndex = propValueMap.length;
    if (!propValueMap.length) {
      var val = getValues(list[i], itemSize.props);
      val.__index__ = i;
      propValueMap.push(val);
      calcNewItems.push(list[i]);
      needCalcPropIndex.push(item2PropValueIndex);
      item2PropValueMap.push({
        index: i,
        sizeIndex: item2PropValueIndex
      });
      continue;
    }
    var found = false;
    for (var j = 0; j < propValueMap.length; j++) {
      if (isSameValue(propValueMap[j], list[i], itemSize.props)) {
        item2PropValueIndex = j;
        found = true;
        break;
      }
    }
    if (!found) {
      var _val = getValues(list[i], itemSize.props);
      _val.__index__ = i;
      propValueMap.push(_val);
      calcNewItems.push(list[i]);
      needCalcPropIndex.push(item2PropValueIndex);
    }
    item2PropValueMap.push({
      index: i,
      sizeIndex: item2PropValueIndex
    });
  }
  // this.item2PropValueMap = item2PropValueMap
  this.propValueMap = propValueMap;
  if (propValueMap.length > 10) {
    // eslint-disable-next-line no-console
    console.warn('[recycle-view] get itemSize count exceed maximum of 10, now got', propValueMap);
  }
  // console.log('itemsize', propValueMap, item2PropValueMap)
  // 预先渲染
  var that = this;
  function newItemSize(item, index) {
    var sizeIndex = item2PropValueMap[index];
    if (!sizeIndex) {
      // eslint-disable-next-line no-console
      console.error('[recycle-view] auto calculate size array error, no map size found', item, index, item2PropValueMap);
      throw new Error('[recycle-view] auto calculate size array error, no map size found');
    }
    var size = propValueMap[sizeIndex.sizeIndex];
    if (!size) {
      // eslint-disable-next-line no-console
      console.log('[recycle-view] auto calculate size array error, no size found', item, index, sizeIndex, propValueMap);
      throw new Error('[recycle-view] auto calculate size array error, no size found');
    }
    return {
      width: size.width,
      height: size.height
    };
  }
  function sizeReady(rects) {
    rects.forEach(function (rect, index) {
      var propValueIndex = needCalcPropIndex[index];
      propValueMap[propValueIndex].width = rect.width;
      propValueMap[propValueIndex].height = rect.height;
    });
    that.itemSize = newItemSize;
    var sizeData = that._recalculateSize(list);
    if (itemSize.cacheKey) {
      wx.setStorageSync(itemSize.cacheKey, propValueMap); // 把数据缓存起来
    }
    if (cb) {
      cb(sizeData);
    }
  }
  if (calcNewItems.length) {
    var obj = {};
    obj[itemSize.dataKey] = calcNewItems;
    this.page.setData(obj, function () {
      // wx.createSelectorQuery().select(itemSize.componentClass).boundingClientRect(rects => {
      //   compSize = rects;
      //   if (compSize && allItemSize) {
      //     sizeReady();
      //   }
      // }).exec();
      wx.createSelectorQuery().selectAll('.' + itemSize.queryClass).boundingClientRect(function (rects) {
        sizeReady(rects);
      }).exec();
    });
  } else {
    that.itemSize = newItemSize;
    var sizeData = that._recalculateSize(list);
    if (cb) {
      cb(sizeData);
    }
  }
};
// 当before和after这2个slot发生变化的时候调用一下此接口
RecycleContext.prototype._recalculateSize = function (list) {
  // 遍历所有的数据
  // 应该最多就千量级的, 遍历没有问题
  var sizeMap = {};
  var func = this.itemSize;
  var funcExist = typeof func === 'function';
  var comp = this.comp;
  var compData = comp.data;
  var offsetLeft = 0;
  var offsetTop = 0;
  var line = 0;
  var column = 0;
  var sizeArray = [];
  var listLen = list.length;
  // 把整个页面拆分成200*200的很多个方格, 判断每个数据落在哪个方格上
  for (var i = 0; i < listLen; i++) {
    list[i].__index__ = i;
    var itemSize = {};
    // 获取到每一项的宽和高
    if (funcExist) {
      // 必须保证返回的每一行的高度一样
      itemSize = func && func.call(this, list[i], i);
    } else {
      itemSize = {
        width: func.width,
        height: func.height
      };
    }
    itemSize = Object.assign({}, itemSize);
    sizeArray.push(itemSize);
    // 判断数据落到哪个方格上
    // 超过了宽度, 移动到下一行, 再根据高度判断是否需要移动到下一个方格
    if (offsetLeft + itemSize.width > compData.width) {
      column = 0;
      offsetLeft = itemSize.width;
      // Fixed issue #22
      if (sizeArray.length >= 2) {
        offsetTop += sizeArray[sizeArray.length - 2].height || 0; // 加上最后一个数据的高度
      } else {
        offsetTop += itemSize.height;
      }
      // offsetTop += sizeArray[sizeArray.length - 2].height // 加上最后一个数据的高度
      // 根据高度判断是否需要移动到下一个方格
      if (offsetTop >= RECT_SIZE * (line + 1)) {
        // fix: 当区块比较大时，会缺失块区域信息
        var lastIdx = i - 1;
        var lastLine = line;

        line += parseInt((offsetTop - RECT_SIZE * line) / RECT_SIZE, 10);

        for (var idx = lastLine; idx < line; idx++) {
          var _key = idx + '.' + column;
          if (!sizeMap[_key]) {
            sizeMap[_key] = [];
          }
          sizeMap[_key].push(lastIdx);
        }
      }

      // 新起一行的元素, beforeHeight是前一个元素的beforeHeight和height相加
      if (i === 0) {
        itemSize.beforeHeight = 0;
      } else {
        var prevItemSize = sizeArray[sizeArray.length - 2];
        itemSize.beforeHeight = prevItemSize.beforeHeight + prevItemSize.height;
      }
    } else {
      if (offsetLeft >= RECT_SIZE * (column + 1)) {
        column++;
      }
      offsetLeft += itemSize.width;
      if (i === 0) {
        itemSize.beforeHeight = 0;
      } else {
        // 同一行的元素, beforeHeight和前面一个元素的beforeHeight一样
        itemSize.beforeHeight = sizeArray[sizeArray.length - 2].beforeHeight;
      }
    }
    var key = line + '.' + column;
    if (!sizeMap[key]) {
      sizeMap[key] = [];
    }
    sizeMap[key].push(i);

    // fix: 当区块比较大时，会缺失块区域信息
    if (listLen - 1 === i && itemSize.height > RECT_SIZE) {
      var _lastIdx = line;
      offsetTop += itemSize.height;
      line += parseInt((offsetTop - RECT_SIZE * line) / RECT_SIZE, 10);
      for (var _idx = _lastIdx; _idx <= line; _idx++) {
        var _key2 = _idx + '.' + column;
        if (!sizeMap[_key2]) {
          sizeMap[_key2] = [];
        }
        sizeMap[_key2].push(i);
      }
    }
  }
  // console.log('sizeMap', sizeMap)
  var obj = {
    array: sizeArray,
    map: sizeMap,
    totalHeight: sizeArray.length ? sizeArray[sizeArray.length - 1].beforeHeight + sizeArray[sizeArray.length - 1].height : 0
  };
  comp.setItemSize(obj);
  return obj;
};
RecycleContext.prototype.deleteList = function (beginIndex, count, cb) {
  this.checkComp();
  var id = this.id;
  if (!recycleData[id]) {
    return this;
  }
  recycleData[id].list.splice(beginIndex, count);
  this._forceRerender(id, cb);
  return this;
};
RecycleContext.prototype.updateList = function (beginIndex, list, cb) {
  this.checkComp();
  var id = this.id;
  if (!recycleData[id]) {
    return this;
  }
  var len = recycleData[id].list.length;
  for (var i = 0; i < list.length && beginIndex < len; i++) {
    recycleData[id].list[beginIndex++] = list[i];
  }
  this._forceRerender(id, cb);
  return this;
};
RecycleContext.prototype.update = RecycleContext.prototype.updateList;
RecycleContext.prototype.splice = function (begin, deleteCount, appendList, cb) {
  this.checkComp();
  var id = this.id;
  var dataKey = this.dataKey;
  // begin是数组
  if ((typeof begin === 'undefined' ? 'undefined' : _typeof(begin)) === 'object' && begin.length) {
    cb = deleteCount;
    appendList = begin;
  }
  if (typeof appendList === 'function') {
    cb = appendList;
    appendList = [];
  }
  if (!recycleData[id]) {
    recycleData[id] = {
      key: dataKey,
      id: id,
      list: appendList || [],
      sizeMap: {},
      sizeArray: []
    };
  } else {
    recycleData[id].dataKey = dataKey;
    var list = recycleData[id].list;
    if (appendList && appendList.length) {
      list.splice.apply(list, [begin, deleteCount].concat(appendList));
    } else {
      list.splice(begin, deleteCount);
    }
  }
  this._forceRerender(id, cb);
  return this;
};

RecycleContext.prototype.append = RecycleContext.prototype.appendList;

RecycleContext.prototype.destroy = function () {
  if (this.useInPage) {
    this.page.onPullDownRefresh = this.oldPullDownRefresh;
    this.page.onReachBottom = this.oldReachBottom;
    this.page.onPageScroll = this.oldPageScroll;
    this.oldPageScroll = this.oldReachBottom = this.oldPullDownRefresh = null;
  }
  this.page = null;
  this.comp = null;
  if (recycleData[this.id]) {
    delete recycleData[this.id];
  }
  return this;
};
// 重新更新下页面的数据
RecycleContext.prototype.forceUpdate = function (cb, reinitSlot) {
  var _this2 = this;

  this.checkComp();
  if (reinitSlot) {
    this.comp.reRender(function () {
      _this2._forceRerender(_this2.id, cb);
    });
  } else {
    this._forceRerender(this.id, cb);
  }
  return this;
};
RecycleContext.prototype.getBoundingClientRect = function (index) {
  this.checkComp();
  if (!recycleData[this.id]) {
    return null;
  }
  var sizeArray = recycleData[this.id].sizeArray;
  if (!sizeArray || !sizeArray.length) {
    return null;
  }
  if (typeof index === 'undefined') {
    var list = [];
    for (var i = 0; i < sizeArray.length; i++) {
      list.push({
        left: 0,
        top: sizeArray[i].beforeHeight,
        width: sizeArray[i].width,
        height: sizeArray[i].height
      });
    }
    return list;
  }
  index = parseInt(index, 10);
  if (index >= sizeArray.length || index < 0) return null;
  return {
    left: 0,
    top: sizeArray[index].beforeHeight,
    width: sizeArray[index].width,
    height: sizeArray[index].height
  };
};
RecycleContext.prototype.getScrollTop = function () {
  this.checkComp();
  return this.comp.currentScrollTop || 0;
};
// 将px转化为rpx
RecycleContext.prototype.transformRpx = RecycleContext.transformRpx = function (str, addPxSuffix) {
  if (typeof str === 'number') str += 'rpx';
  return parseFloat(transformRpx.transformRpx(str, addPxSuffix));
};
RecycleContext.prototype.getViewportItems = function (inViewportPx) {
  this.checkComp();
  var indexes = this.comp.getIndexesInViewport(inViewportPx);
  if (indexes.length <= 0) return [];
  var viewportItems = [];
  var list = recycleData[this.id].list;
  for (var i = 0; i < indexes.length; i++) {
    viewportItems.push(list[indexes[i]]);
  }
  return viewportItems;
};
RecycleContext.prototype.getTotalHeight = function () {
  this.checkComp();
  return this.comp.getTotalHeight();
};
// 返回完整的列表数据
RecycleContext.prototype.getList = function () {
  if (!recycleData[this.id]) {
    return [];
  }
  return recycleData[this.id].list;
};
module.exports = RecycleContext;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint complexity: ["error", {"max": 50}] */
var recycleData = __webpack_require__(1);

module.exports = function (e, cb) {
  var detail = e.detail;
  // console.log('data change transfer use time', Date.now() - e.detail.timeStamp)
  var newList = [];
  var item = recycleData[detail.id];
  // 边界值判断, 避免造成异常, 假设先调用了createRecycleContext, 然后再延迟2s调用append插入数据的情况
  if (!item || !item.list) return;
  var dataList = item.list;
  var pos = detail.data;
  var beginIndex = pos.beginIndex;
  var endIndex = pos.endIndex;
  item.pos = pos;
  // 加ignoreBeginIndex和ignoreEndIndex
  if (typeof beginIndex === 'undefined' || beginIndex === -1 || typeof endIndex === 'undefined' || endIndex === -1) {
    newList = [];
  } else {
    var i = -1;
    for (i = beginIndex; i < dataList.length && i <= endIndex; i++) {
      if (i >= pos.ignoreBeginIndex && i <= pos.ignoreEndIndex) continue;
      newList.push(dataList[i]);
    }
  }
  var obj = {
    // batchSetRecycleData: !this.data.batchSetRecycleData
  };
  obj[item.key] = newList;
  var comp = this.selectComponent('#' + detail.id);
  obj[comp.data.batchKey] = !this.data.batchSetRecycleData;
  comp._setInnerBeforeAndAfterHeight({
    beforeHeight: pos.minTop,
    afterHeight: pos.afterHeight
  });
  this.setData(obj, function () {
    if (typeof cb === 'function') {
      cb();
    }
  });
  // Fix #1
  // 去掉了batchSetDataKey，支持一个页面内显示2个recycle-view
  // const groupSetData = () => {
  //   this.setData(obj)
  //   comp._recycleInnerBatchDataChanged(() => {
  //     if (typeof cb === 'function') {
  //       cb()
  //     }
  //   })
  // }
  // if (typeof this.groupSetData === 'function') {
  //   this.groupSetData(groupSetData)
  // } else {
  //   groupSetData()
  // }
};

/***/ })
/******/ ]);