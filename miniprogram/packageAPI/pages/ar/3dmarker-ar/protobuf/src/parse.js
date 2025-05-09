module.exports = parse

parse.filename = null
parse.defaults = { keepCase: false }

let tokenize
let Root
let Type
let Field
let MapField
let OneOf
let Enum
let Service
let Method
let types
let util

const base10Re = /^[1-9][0-9]*$/
const base10NegRe = /^-?[1-9][0-9]*$/
const base16Re = /^0[x][0-9a-fA-F]+$/
const base16NegRe = /^-?0[x][0-9a-fA-F]+$/
const base8Re = /^0[0-7]+$/
const base8NegRe = /^-?0[0-7]+$/
const numberRe = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/
const nameRe = /^[a-zA-Z_][a-zA-Z_0-9]*$/
const typeRefRe = /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)+$/
const fqTypeRefRe = /^(?:\.[a-zA-Z][a-zA-Z_0-9]*)+$/

/**
 * Result object returned from {@link parse}.
 * @interface IParserResult
 * @property {string|undefined} package Package name, if declared
 * @property {string[]|undefined} imports Imports, if any
 * @property {string[]|undefined} weakImports Weak imports, if any
 * @property {string|undefined} syntax Syntax, if specified (either `"proto2"` or `"proto3"`)
 * @property {Root} root Populated root instance
 */

/**
 * Options modifying the behavior of {@link parse}.
 * @interface IParseOptions
 * @property {boolean} [keepCase=false] Keeps field casing instead of converting to camel case
 * @property {boolean} [alternateCommentMode=false] Recognize double-slash comments in addition to doc-block comments.
 */

/**
 * Options modifying the behavior of JSON serialization.
 * @interface IToJSONOptions
 * @property {boolean} [keepComments=false] Serializes comments.
 */

/**
 * Parses the given .proto source and returns an object with the parsed contents.
 * @param {string} source Source contents
 * @param {Root} root Root to populate
 * @param {IParseOptions} [options] Parse options. Defaults to {@link parse.defaults} when omitted.
 * @returns {IParserResult} Parser result
 * @property {string} filename=null Currently processing file name for error reporting, if known
 * @property {IParseOptions} defaults Default {@link IParseOptions}
 */
function parse(source, root, options) {
  /* eslint-disable callback-return */
  if (!(root instanceof Root)) {
    options = root
    root = new Root()
  }
  if (!options) options = parse.defaults

  const tn = tokenize(source, options.alternateCommentMode || false)
  const next = tn.next
  const push = tn.push
  const peek = tn.peek
  const skip = tn.skip
  const cmnt = tn.cmnt

  let head = true
  let pkg
  let imports
  let weakImports
  let syntax
  let isProto3 = false

  let ptr = root

  const applyCase = options.keepCase ? function (name) { return name } : util.camelCase

  /* istanbul ignore next */
  function illegal(token, name, insideTryCatch) {
    const filename = parse.filename
    if (!insideTryCatch) parse.filename = null
    return Error('illegal ' + (name || 'token') + " '" + token + "' (" + (filename ? filename + ', ' : '') + 'line ' + tn.line + ')')
  }

  function readString() {
    const values = []
    let token
    do {
      /* istanbul ignore if */
      if ((token = next()) !== '"' && token !== "'") throw illegal(token)

      values.push(next())
      skip(token)
      token = peek()
    } while (token === '"' || token === "'")
    return values.join('')
  }

  function readValue(acceptTypeRef) {
    const token = next()
    switch (token) {
      case "'":
      case '"':
        push(token)
        return readString()
      case 'true': case 'TRUE':
        return true
      case 'false': case 'FALSE':
        return false
    }
    try {
      return parseNumber(token, /* insideTryCatch */ true)
    } catch (e) {
      /* istanbul ignore else */
      if (acceptTypeRef && typeRefRe.test(token)) return token

      /* istanbul ignore next */
      throw illegal(token, 'value')
    }
  }

  function readRanges(target, acceptStrings) {
    let token; let
      start
    do {
      if (acceptStrings && ((token = peek()) === '"' || token === "'")) target.push(readString())
      else target.push([start = parseId(next()), skip('to', true) ? parseId(next()) : start])
    } while (skip(',', true))
    skip(';')
  }

  function parseNumber(token, insideTryCatch) {
    let sign = 1
    if (token.charAt(0) === '-') {
      sign = -1
      token = token.substring(1)
    }
    switch (token) {
      case 'inf': case 'INF': case 'Inf':
        return sign * Infinity
      case 'nan': case 'NAN': case 'Nan': case 'NaN':
        return NaN
      case '0':
        return 0
    }
    if (base10Re.test(token)) return sign * parseInt(token, 10)
    if (base16Re.test(token)) return sign * parseInt(token, 16)
    if (base8Re.test(token)) return sign * parseInt(token, 8)

    /* istanbul ignore else */
    if (numberRe.test(token)) return sign * parseFloat(token)

    /* istanbul ignore next */
    throw illegal(token, 'number', insideTryCatch)
  }

  function parseId(token, acceptNegative) {
    switch (token) {
      case 'max': case 'MAX': case 'Max':
        return 536870911
      case '0':
        return 0
    }

    /* istanbul ignore if */
    if (!acceptNegative && token.charAt(0) === '-') throw illegal(token, 'id')

    if (base10NegRe.test(token)) return parseInt(token, 10)
    if (base16NegRe.test(token)) return parseInt(token, 16)

    /* istanbul ignore else */
    if (base8NegRe.test(token)) return parseInt(token, 8)

    /* istanbul ignore next */
    throw illegal(token, 'id')
  }

  function parsePackage() {
    /* istanbul ignore if */
    if (pkg !== undefined) throw illegal('package')

    pkg = next()

    /* istanbul ignore if */
    if (!typeRefRe.test(pkg)) throw illegal(pkg, 'name')

    ptr = ptr.define(pkg)
    skip(';')
  }

  function parseImport() {
    let token = peek()
    let whichImports
    switch (token) {
      case 'weak':
        whichImports = weakImports || (weakImports = [])
        next()
        break
      case 'public':
        next()
        // eslint-disable-line no-fallthrough
      default:
        whichImports = imports || (imports = [])
        break
    }
    token = readString()
    skip(';')
    whichImports.push(token)
  }

  function parseSyntax() {
    skip('=')
    syntax = readString()
    isProto3 = syntax === 'proto3'

    /* istanbul ignore if */
    if (!isProto3 && syntax !== 'proto2') throw illegal(syntax, 'syntax')

    skip(';')
  }

  function parseCommon(parent, token) {
    switch (token) {
      case 'option':
        parseOption(parent, token)
        skip(';')
        return true

      case 'message':
        parseType(parent, token)
        return true

      case 'enum':
        parseEnum(parent, token)
        return true

      case 'service':
        parseService(parent, token)
        return true

      case 'extend':
        parseExtension(parent, token)
        return true
    }
    return false
  }

  function ifBlock(obj, fnIf, fnElse) {
    const trailingLine = tn.line
    if (obj) {
      obj.comment = cmnt() // try block-type comment
      obj.filename = parse.filename
    }
    if (skip('{', true)) {
      let token
      while ((token = next()) !== '}') fnIf(token)
      skip(';', true)
    } else {
      if (fnElse) fnElse()
      skip(';')
      if (obj && typeof obj.comment !== 'string') obj.comment = cmnt(trailingLine) // try line-type comment if no block
    }
  }

  function parseType(parent, token) {
    /* istanbul ignore if */
    if (!nameRe.test(token = next())) throw illegal(token, 'type name')

    const type = new Type(token)
    ifBlock(type, function parseType_block(token) {
      if (parseCommon(type, token)) return

      switch (token) {
        case 'map':
          parseMapField(type, token)
          break

        case 'required':
        case 'optional':
        case 'repeated':
          parseField(type, token)
          break

        case 'oneof':
          parseOneOf(type, token)
          break

        case 'extensions':
          readRanges(type.extensions || (type.extensions = []))
          break

        case 'reserved':
          readRanges(type.reserved || (type.reserved = []), true)
          break

        default:
          /* istanbul ignore if */
          if (!isProto3 || !typeRefRe.test(token)) throw illegal(token)

          push(token)
          parseField(type, 'optional')
          break
      }
    })
    parent.add(type)
  }

  function parseField(parent, rule, extend) {
    const type = next()
    if (type === 'group') {
      parseGroup(parent, rule)
      return
    }

    /* istanbul ignore if */
    if (!typeRefRe.test(type)) throw illegal(type, 'type')

    let name = next()

    /* istanbul ignore if */
    if (!nameRe.test(name)) throw illegal(name, 'name')

    name = applyCase(name)
    skip('=')

    const field = new Field(name, parseId(next()), type, rule, extend)
    ifBlock(field, function parseField_block(token) {
      /* istanbul ignore else */
      if (token === 'option') {
        parseOption(field, token)
        skip(';')
      } else throw illegal(token)
    }, function parseField_line() {
      parseInlineOptions(field)
    })
    parent.add(field)

    // JSON defaults to packed=true if not set so we have to set packed=false explicity when
    // parsing proto2 descriptors without the option, where applicable. This must be done for
    // all known packable types and anything that could be an enum (= is not a basic type).
    if (!isProto3 && field.repeated && (types.packed[type] !== undefined || types.basic[type] === undefined)) field.setOption('packed', false, /* ifNotSet */ true)
  }

  function parseGroup(parent, rule) {
    let name = next()

    /* istanbul ignore if */
    if (!nameRe.test(name)) throw illegal(name, 'name')

    const fieldName = util.lcFirst(name)
    if (name === fieldName) name = util.ucFirst(name)
    skip('=')
    const id = parseId(next())
    const type = new Type(name)
    type.group = true
    const field = new Field(fieldName, id, name, rule)
    field.filename = parse.filename
    ifBlock(type, function parseGroup_block(token) {
      switch (token) {
        case 'option':
          parseOption(type, token)
          skip(';')
          break

        case 'required':
        case 'optional':
        case 'repeated':
          parseField(type, token)
          break

          /* istanbul ignore next */
        default:
          throw illegal(token) // there are no groups with proto3 semantics
      }
    })
    parent.add(type)
      .add(field)
  }

  function parseMapField(parent) {
    skip('<')
    const keyType = next()

    /* istanbul ignore if */
    if (types.mapKey[keyType] === undefined) throw illegal(keyType, 'type')

    skip(',')
    const valueType = next()

    /* istanbul ignore if */
    if (!typeRefRe.test(valueType)) throw illegal(valueType, 'type')

    skip('>')
    const name = next()

    /* istanbul ignore if */
    if (!nameRe.test(name)) throw illegal(name, 'name')

    skip('=')
    const field = new MapField(applyCase(name), parseId(next()), keyType, valueType)
    ifBlock(field, function parseMapField_block(token) {
      /* istanbul ignore else */
      if (token === 'option') {
        parseOption(field, token)
        skip(';')
      } else throw illegal(token)
    }, function parseMapField_line() {
      parseInlineOptions(field)
    })
    parent.add(field)
  }

  function parseOneOf(parent, token) {
    /* istanbul ignore if */
    if (!nameRe.test(token = next())) throw illegal(token, 'name')

    const oneof = new OneOf(applyCase(token))
    ifBlock(oneof, function parseOneOf_block(token) {
      if (token === 'option') {
        parseOption(oneof, token)
        skip(';')
      } else {
        push(token)
        parseField(oneof, 'optional')
      }
    })
    parent.add(oneof)
  }

  function parseEnum(parent, token) {
    /* istanbul ignore if */
    if (!nameRe.test(token = next())) throw illegal(token, 'name')

    const enm = new Enum(token)
    ifBlock(enm, function parseEnum_block(token) {
      switch (token) {
        case 'option':
          parseOption(enm, token)
          skip(';')
          break

        case 'reserved':
          readRanges(enm.reserved || (enm.reserved = []), true)
          break

        default:
          parseEnumValue(enm, token)
      }
    })
    parent.add(enm)
  }

  function parseEnumValue(parent, token) {
    /* istanbul ignore if */
    if (!nameRe.test(token)) throw illegal(token, 'name')

    skip('=')
    const value = parseId(next(), true)
    const dummy = {}
    ifBlock(dummy, function parseEnumValue_block(token) {
      /* istanbul ignore else */
      if (token === 'option') {
        parseOption(dummy, token) // skip
        skip(';')
      } else throw illegal(token)
    }, function parseEnumValue_line() {
      parseInlineOptions(dummy) // skip
    })
    parent.add(token, value, dummy.comment)
  }

  function parseOption(parent, token) {
    const isCustom = skip('(', true)

    /* istanbul ignore if */
    if (!typeRefRe.test(token = next())) throw illegal(token, 'name')

    let name = token
    if (isCustom) {
      skip(')')
      name = '(' + name + ')'
      token = peek()
      if (fqTypeRefRe.test(token)) {
        name += token
        next()
      }
    }
    skip('=')
    parseOptionValue(parent, name)
  }

  function parseOptionValue(parent, name) {
    if (skip('{', true)) { // { a: "foo" b { c: "bar" } }
      do {
        /* istanbul ignore if */
        if (!nameRe.test(token = next())) throw illegal(token, 'name')

        if (peek() === '{') parseOptionValue(parent, name + '.' + token)
        else {
          skip(':')
          if (peek() === '{') parseOptionValue(parent, name + '.' + token)
          else setOption(parent, name + '.' + token, readValue(true))
        }
      } while (!skip('}', true))
    } else setOption(parent, name, readValue(true))
    // Does not enforce a delimiter to be universal
  }

  function setOption(parent, name, value) {
    if (parent.setOption) parent.setOption(name, value)
  }

  function parseInlineOptions(parent) {
    if (skip('[', true)) {
      do {
        parseOption(parent, 'option')
      } while (skip(',', true))
      skip(']')
    }
    return parent
  }

  function parseService(parent, token) {
    /* istanbul ignore if */
    if (!nameRe.test(token = next())) throw illegal(token, 'service name')

    const service = new Service(token)
    ifBlock(service, function parseService_block(token) {
      if (parseCommon(service, token)) return

      /* istanbul ignore else */
      if (token === 'rpc') parseMethod(service, token)
      else throw illegal(token)
    })
    parent.add(service)
  }

  function parseMethod(parent, token) {
    const type = token

    /* istanbul ignore if */
    if (!nameRe.test(token = next())) throw illegal(token, 'name')

    const name = token
    let requestType; let requestStream
    let responseType; let
      responseStream

    skip('(')
    if (skip('stream', true)) requestStream = true

    /* istanbul ignore if */
    if (!typeRefRe.test(token = next())) throw illegal(token)

    requestType = token
    skip(')'); skip('returns'); skip('(')
    if (skip('stream', true)) responseStream = true

    /* istanbul ignore if */
    if (!typeRefRe.test(token = next())) throw illegal(token)

    responseType = token
    skip(')')

    const method = new Method(name, type, requestType, responseType, requestStream, responseStream)
    ifBlock(method, function parseMethod_block(token) {
      /* istanbul ignore else */
      if (token === 'option') {
        parseOption(method, token)
        skip(';')
      } else throw illegal(token)
    })
    parent.add(method)
  }

  function parseExtension(parent, token) {
    /* istanbul ignore if */
    if (!typeRefRe.test(token = next())) throw illegal(token, 'reference')

    const reference = token
    ifBlock(null, function parseExtension_block(token) {
      switch (token) {
        case 'required':
        case 'repeated':
        case 'optional':
          parseField(parent, token, reference)
          break

        default:
          /* istanbul ignore if */
          if (!isProto3 || !typeRefRe.test(token)) throw illegal(token)
          push(token)
          parseField(parent, 'optional', reference)
          break
      }
    })
  }

  let token
  while ((token = next()) !== null) {
    switch (token) {
      case 'package':

        /* istanbul ignore if */
        if (!head) throw illegal(token)

        parsePackage()
        break

      case 'import':

        /* istanbul ignore if */
        if (!head) throw illegal(token)

        parseImport()
        break

      case 'syntax':

        /* istanbul ignore if */
        if (!head) throw illegal(token)

        parseSyntax()
        break

      case 'option':

        /* istanbul ignore if */
        if (!head) throw illegal(token)

        parseOption(ptr, token)
        skip(';')
        break

      default:

        /* istanbul ignore else */
        if (parseCommon(ptr, token)) {
          head = false
          continue
        }

        /* istanbul ignore next */
        throw illegal(token)
    }
  }

  parse.filename = null
  return {
    package: pkg,
    imports,
    weakImports,
    syntax,
    root
  }
}

/**
 * Parses the given .proto source and returns an object with the parsed contents.
 * @name parse
 * @function
 * @param {string} source Source contents
 * @param {IParseOptions} [options] Parse options. Defaults to {@link parse.defaults} when omitted.
 * @returns {IParserResult} Parser result
 * @property {string} filename=null Currently processing file name for error reporting, if known
 * @property {IParseOptions} defaults Default {@link IParseOptions}
 * @variation 2
 */
parse._configure = function () {
  tokenize = require('./tokenize'),
  Root = require('./root'),
  Type = require('./type'),
  Field = require('./field'),
  MapField = require('./mapField'),
  OneOf = require('./oneof'),
  Enum = require('./enum'),
  Service = require('./service'),
  Method = require('./method'),
  types = require('./types'),
  util = require('./util')
}
