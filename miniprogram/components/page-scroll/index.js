var globalThis = this, self = this;
module.exports =
require("../../_commons/0.js")([
{
"ids": [6],
"modules":{

/***/ "./node_modules/@mpflow/webpack-plugin/lib/loaders/page-loader.js?appContext=src&outputPath=components%2Fpage-scroll%2Findex!./src/components/page-scroll/index.ts":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@mpflow/webpack-plugin/lib/loaders/page-loader.js?appContext=src&outputPath=components%2Fpage-scroll%2Findex!./src/components/page-scroll/index.ts ***!
  \*************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./index.ts */ "./src/components/page-scroll/index.ts")

/***/ }),

/***/ "./src/components/page-scroll/index.ts":
/*!*********************************************!*\
  !*** ./src/components/page-scroll/index.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Component({
  options: {
    virtualHost: true
  },
  properties: {
    refresherEnabled: {
      type: Boolean,
      value: false
    },
    refresherThreshold: {
      type: Number,
      value: 45
    },
    refresherDefaultStyle: {
      type: String,
      value: 'black'
    },
    refresherBackground: {
      type: String,
      value: '#FFF'
    },
    refresherTriggered: {
      type: Boolean,
      value: false
    },
    lowerThreshold: {
      type: Number,
      value: 50
    },
    scrollIntoView: {
      type: String,
      value: ''
    }
  },
  methods: {
    onScroll: function onScroll(e) {
      this.triggerEvent('scroll', e.detail);
    },
    onScrollToLower: function onScrollToLower(e) {
      this.triggerEvent('scrollToLower', e.detail);
    },
    onPulling: function onPulling(e) {
      this.triggerEvent('pulling', e.detail);
    },
    onRefresh: function onRefresh(e) {
      this.triggerEvent('refresh', e.detail);
    },
    onRestore: function onRestore(e) {
      this.triggerEvent('restore', e.detail);
    },
    onAbort: function onAbort(e) {
      this.triggerEvent('abort', e.detail);
    }
  }
});

/***/ })

},
"entries": [["./node_modules/@mpflow/webpack-plugin/lib/loaders/page-loader.js?appContext=src&outputPath=components%2Fpage-scroll%2Findex!./src/components/page-scroll/index.ts",0]]
},
]);

// # sourceMappingURL=index.js.map