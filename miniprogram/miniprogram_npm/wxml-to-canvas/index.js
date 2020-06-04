(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const hex = (color) => {
  let result = null

  if (/^#/.test(color) && (color.length === 7 || color.length === 9)) {
    return color
    // eslint-disable-next-line no-cond-assign
  } else if ((result = /^(rgb|rgba)\((.+)\)/.exec(color)) !== null) {
    return '#' + result[2].split(',').map((part, index) => {
      part = part.trim()
      part = index === 3 ? Math.floor(parseFloat(part) * 255) : parseInt(part, 10)
      part = part.toString(16)
      if (part.length === 1) {
        part = '0' + part
      }
      return part
    }).join('')
  } else {
    return '#00000000'
  }
}

const splitLineToCamelCase = (str) => str.split('-').map((part, index) => {
  if (index === 0) {
    return part
  }
  return part[0].toUpperCase() + part.slice(1)
}).join('')

const compareVersion = (v1, v2) => {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)
  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i], 10)
    const num2 = parseInt(v2[i], 10)

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

module.exports = {
  hex,
  splitLineToCamelCase,
  compareVersion
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {


const xmlParse = __webpack_require__(2)
const {Widget} = __webpack_require__(3)
const {Draw} = __webpack_require__(5)
const {compareVersion} = __webpack_require__(0)

const canvasId = 'weui-canvas'

Component({
  properties: {
    width: {
      type: Number,
      value: 400
    },
    height: {
      type: Number,
      value: 300
    }
  },
  data: {
    use2dCanvas: false, // 2.9.2 后可用canvas 2d 接口
  },
  lifetimes: {
    attached() {
      const {SDKVersion, pixelRatio: dpr} = wx.getSystemInfoSync()
      const use2dCanvas = compareVersion(SDKVersion, '2.9.2') >= 0
      this.dpr = dpr
      this.setData({use2dCanvas}, () => {
        if (use2dCanvas) {
          const query = this.createSelectorQuery()
          query.select(`#${canvasId}`)
            .fields({node: true, size: true})
            .exec(res => {
              const canvas = res[0].node
              const ctx = canvas.getContext('2d')
              canvas.width = res[0].width * dpr
              canvas.height = res[0].height * dpr
              ctx.scale(dpr, dpr)
              this.ctx = ctx
              this.canvas = canvas
            })
        } else {
          this.ctx = wx.createCanvasContext(canvasId, this)
        }
      })
    }
  },
  methods: {
    async renderToCanvas(args) {
      const {wxml, style} = args
      const ctx = this.ctx
      const canvas = this.canvas
      const use2dCanvas = this.data.use2dCanvas

      if (use2dCanvas && !canvas) {
        return Promise.reject(new Error('renderToCanvas: fail canvas has not been created'))
      }

      ctx.clearRect(0, 0, this.data.width, this.data.height)
      const {root: xom} = xmlParse(wxml)

      const widget = new Widget(xom, style)
      const container = widget.init()
      this.boundary = {
        top: container.layoutBox.top,
        left: container.layoutBox.left,
        width: container.computedStyle.width,
        height: container.computedStyle.height,
      }
      const draw = new Draw(ctx, canvas, use2dCanvas)
      await draw.drawNode(container)

      if (!use2dCanvas) {
        await this.canvasDraw(ctx)
      }
      return Promise.resolve(container)
    },

    canvasDraw(ctx, reserve) {
      return new Promise(resolve => {
        ctx.draw(reserve, () => {
          resolve()
        })
      })
    },

    canvasToTempFilePath(args = {}) {
      const use2dCanvas = this.data.use2dCanvas

      return new Promise((resolve, reject) => {
        const {
          top, left, width, height
        } = this.boundary

        const copyArgs = {
          x: left,
          y: top,
          width,
          height,
          destWidth: width * this.dpr,
          destHeight: height * this.dpr,
          canvasId,
          fileType: args.fileType || 'png',
          quality: args.quality || 1,
          success: resolve,
          fail: reject
        }

        if (use2dCanvas) {
          delete copyArgs.canvasId
          copyArgs.canvas = this.canvas
        }
        wx.canvasToTempFilePath(copyArgs, this)
      })
    }
  }
})


/***/ }),
/* 2 */
/***/ (function(module, exports) {


/**
 * Module dependencies.
 */


/**
 * Expose `parse`.
 */


/**
 * Parse the given string of `xml`.
 *
 * @param {String} xml
 * @return {Object}
 * @api public
 */

function parse(xml) {
  xml = xml.trim()

  // strip comments
  xml = xml.replace(/<!--[\s\S]*?-->/g, '')

  return document()

  /**
   * XML document.
   */

  function document() {
    return {
      declaration: declaration(),
      root: tag()
    }
  }

  /**
   * Declaration.
   */

  function declaration() {
    const m = match(/^<\?xml\s*/)
    if (!m) return

    // tag
    const node = {
      attributes: {}
    }

    // attributes
    while (!(eos() || is('?>'))) {
      const attr = attribute()
      if (!attr) return node
      node.attributes[attr.name] = attr.value
    }

    match(/\?>\s*/)

    return node
  }

  /**
   * Tag.
   */

  function tag() {
    const m = match(/^<([\w-:.]+)\s*/)
    if (!m) return

    // name
    const node = {
      name: m[1],
      attributes: {},
      children: []
    }

    // attributes
    while (!(eos() || is('>') || is('?>') || is('/>'))) {
      const attr = attribute()
      if (!attr) return node
      node.attributes[attr.name] = attr.value
    }

    // self closing tag
    if (match(/^\s*\/>\s*/)) {
      return node
    }

    match(/\??>\s*/)

    // content
    node.content = content()

    // children
    let child
    while (child = tag()) {
      node.children.push(child)
    }

    // closing
    match(/^<\/[\w-:.]+>\s*/)

    return node
  }

  /**
   * Text content.
   */

  function content() {
    const m = match(/^([^<]*)/)
    if (m) return m[1]
    return ''
  }

  /**
   * Attribute.
   */

  function attribute() {
    const m = match(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/)
    if (!m) return
    return {name: m[1], value: strip(m[2])}
  }

  /**
   * Strip quotes from `val`.
   */

  function strip(val) {
    return val.replace(/^['"]|['"]$/g, '')
  }

  /**
   * Match `re` and advance the string.
   */

  function match(re) {
    const m = xml.match(re)
    if (!m) return
    xml = xml.slice(m[0].length)
    return m
  }

  /**
   * End-of-source.
   */

  function eos() {
    return xml.length == 0
  }

  /**
   * Check for `prefix`.
   */

  function is(prefix) {
    return xml.indexOf(prefix) == 0
  }
}

module.exports = parse


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Block = __webpack_require__(4)
const {splitLineToCamelCase} = __webpack_require__(0)

class Element extends Block {
  constructor(prop) {
    super(prop.style)
    this.name = prop.name
    this.attributes = prop.attributes
  }
}


class Widget {
  constructor(xom, style) {
    this.xom = xom
    this.style = style

    this.inheritProps = ['fontSize', 'lineHeight', 'textAlign', 'verticalAlign', 'color']
  }

  init() {
    this.container = this.create(this.xom)
    this.container.layout()

    this.inheritStyle(this.container)
    return this.container
  }

  // 继承父节点的样式
  inheritStyle(node) {
    const parent = node.parent || null
    const children = node.children || {}
    const computedStyle = node.computedStyle

    if (parent) {
      this.inheritProps.forEach(prop => {
        computedStyle[prop] = computedStyle[prop] || parent.computedStyle[prop]
      })
    }

    Object.values(children).forEach(child => {
      this.inheritStyle(child)
    })
  }

  create(node) {
    let classNames = (node.attributes.class || '').split(' ')
    classNames = classNames.map(item => splitLineToCamelCase(item.trim()))
    const style = {}
    classNames.forEach(item => {
      Object.assign(style, this.style[item] || {})
    })

    const args = {name: node.name, style}

    const attrs = Object.keys(node.attributes)
    const attributes = {}
    for (const attr of attrs) {
      const value = node.attributes[attr]
      const CamelAttr = splitLineToCamelCase(attr)

      if (value === '' || value === 'true') {
        attributes[CamelAttr] = true
      } else if (value === 'false') {
        attributes[CamelAttr] = false
      } else {
        attributes[CamelAttr] = value
      }
    }
    attributes.text = node.content
    args.attributes = attributes
    const element = new Element(args)
    node.children.forEach(childNode => {
      const childElement = this.create(childNode)
      element.add(childElement)
    })
    return element
  }
}

module.exports = {Widget}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("widget-ui");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

class Draw {
  constructor(context, canvas, use2dCanvas = false) {
    this.ctx = context
    this.canvas = canvas || null
    this.use2dCanvas = use2dCanvas
  }

  roundRect(x, y, w, h, r, fill = true, stroke = false) {
    if (r < 0) return
    const ctx = this.ctx

    ctx.beginPath()
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 3 / 2)
    ctx.arc(x + w - r, y + r, r, Math.PI * 3 / 2, 0)
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI / 2)
    ctx.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI)
    ctx.lineTo(x, y + r)
    if (stroke) ctx.stroke()
    if (fill) ctx.fill()
  }

  drawView(box, style) {
    const ctx = this.ctx
    const {
      left: x, top: y, width: w, height: h
    } = box
    const {
      borderRadius = 0,
      borderWidth = 0,
      borderColor,
      color = '#000',
      backgroundColor = 'transparent',
    } = style
    ctx.save()
    // 外环
    if (borderWidth > 0) {
      ctx.fillStyle = borderColor || color
      this.roundRect(x, y, w, h, borderRadius)
    }

    // 内环
    ctx.fillStyle = backgroundColor
    const innerWidth = w - 2 * borderWidth
    const innerHeight = h - 2 * borderWidth
    const innerRadius = borderRadius - borderWidth >= 0 ? borderRadius - borderWidth : 0
    this.roundRect(x + borderWidth, y + borderWidth, innerWidth, innerHeight, innerRadius)
    ctx.restore()
  }

  async drawImage(img, box, style) {
    await new Promise((resolve, reject) => {
      const ctx = this.ctx
      const canvas = this.canvas

      const {
        borderRadius = 0
      } = style
      const {
        left: x, top: y, width: w, height: h
      } = box
      ctx.save()
      this.roundRect(x, y, w, h, borderRadius, false, false)
      ctx.clip()

      const _drawImage = (img) => {
        if (this.use2dCanvas) {
          const Image = canvas.createImage()
          Image.onload = () => {
            ctx.drawImage(Image, x, y, w, h)
            ctx.restore()
            resolve()
          }
          Image.onerror = () => { reject(new Error(`createImage fail: ${img}`)) }
          Image.src = img
        } else {
          ctx.drawImage(img, x, y, w, h)
          ctx.restore()
          resolve()
        }
      }

      const isTempFile = /^wxfile:\/\//.test(img)
      const isNetworkFile = /^https?:\/\//.test(img)

      if (isTempFile) {
        _drawImage(img)
      } else if (isNetworkFile) {
        wx.downloadFile({
          url: img,
          success(res) {
            if (res.statusCode === 200) {
              _drawImage(res.tempFilePath)
            } else {
              reject(new Error(`downloadFile:fail ${img}`))
            }
          },
          fail() {
            reject(new Error(`downloadFile:fail ${img}`))
          }
        })
      } else {
        reject(new Error(`image format error: ${img}`))
      }
    })
  }

  // eslint-disable-next-line complexity
  drawText(text, box, style) {
    const ctx = this.ctx
    let {
      left: x, top: y, width: w, height: h
    } = box
    let {
      color = '#000',
      lineHeight = '1.4em',
      fontSize = 14,
      textAlign = 'left',
      verticalAlign = 'top',
      backgroundColor = 'transparent'
    } = style

    if (typeof lineHeight === 'string') { // 2em
      lineHeight = Math.ceil(parseFloat(lineHeight.replace('em')) * fontSize)
    }
    if (!text || (lineHeight > h)) return

    ctx.save()
    ctx.textBaseline = 'top'
    ctx.font = `${fontSize}px sans-serif`
    ctx.textAlign = textAlign

    // 背景色
    ctx.fillStyle = backgroundColor
    this.roundRect(x, y, w, h, 0)

    // 文字颜色
    ctx.fillStyle = color

    // 水平布局
    switch (textAlign) {
      case 'left':
        break
      case 'center':
        x += 0.5 * w
        break
      case 'right':
        x += w
        break
      default: break
    }

    const textWidth = ctx.measureText(text).width
    const actualHeight = Math.ceil(textWidth / w) * lineHeight
    let paddingTop = Math.ceil((h - actualHeight) / 2)
    if (paddingTop < 0) paddingTop = 0

    // 垂直布局
    switch (verticalAlign) {
      case 'top':
        break
      case 'middle':
        y += paddingTop
        break
      case 'bottom':
        y += 2 * paddingTop
        break
      default: break
    }

    const inlinePaddingTop = Math.ceil((lineHeight - fontSize) / 2)

    // 不超过一行
    if (textWidth <= w) {
      ctx.fillText(text, x, y + inlinePaddingTop)
      return
    }

    // 多行文本
    const chars = text.split('')
    const _y = y

    // 逐行绘制
    let line = ''
    for (const ch of chars) {
      const testLine = line + ch
      const testWidth = ctx.measureText(testLine).width

      if (testWidth > w) {
        ctx.fillText(line, x, y + inlinePaddingTop)
        y += lineHeight
        line = ch
        if ((y + lineHeight) > (_y + h)) break
      } else {
        line = testLine
      }
    }

    // 避免溢出
    if ((y + lineHeight) <= (_y + h)) {
      ctx.fillText(line, x, y + inlinePaddingTop)
    }
    ctx.restore()
  }

  async drawNode(element) {
    const {layoutBox, computedStyle, name} = element
    const {src, text} = element.attributes
    if (name === 'view') {
      this.drawView(layoutBox, computedStyle)
    } else if (name === 'image') {
      await this.drawImage(src, layoutBox, computedStyle)
    } else if (name === 'text') {
      this.drawText(text, layoutBox, computedStyle)
    }
    const childs = Object.values(element.children)
    for (const child of childs) {
      await this.drawNode(child)
    }
  }
}


module.exports = {
  Draw
}


/***/ })
/******/ ]);
});