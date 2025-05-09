/**
 * Created by zhangmiao on 2018/3/13.
 */

let Enum
let types
let util

function missing(field) {
  return "missing required '" + field.name + "'"
}

function decoder(mtype) {
  return function (options) {
    const Reader = options.Reader
    const _types = options.types
    const _util = options.util
    return function (r, l) {
      if (!(r instanceof Reader)) r = Reader.create(r)
      const c = l === undefined ? r.len : r.pos + l
      const m = new this.ctor()
      let k
      while (r.pos < c) {
        const t = r.uint32()
        if (mtype.group) {
          if ((t & 7) === 4) break
        }
        const fieldId = t >>> 3
        var i = 0
        let find = false
        for (; i < mtype.fieldsArray.length; ++i) {
          const field = mtype._fieldsArray[i].resolve()
          const name = field.name
          const type = field.resolvedType instanceof Enum ? 'int32' : field.type
          // ref   = m[field.name];
          if (fieldId != field.id) continue
          find = true
          if (field.map) {
            r.skip().pos++
            if (m[name] === _util.emptyObject) m[name] = {}
            k = r[field.keyType]()
            r.pos++
            if (types.long[field.keyType] != undefined) {
              if (types.basic[type] == undefined) {
                m[name][typeof k === 'object' ? _util.longToHash(k) : k] = _types[i].decode(r, r.uint32())
              } else {
                m[name][typeof k === 'object' ? _util.longToHash(k) : k] = r[type]()
              }
            } else if (types.basic[type] == undefined) {
              m[name] = _types[i].decode(r, r.uint32())
            } else {
              m[name] = r[type]()
            }
          } else if (field.repeated) {
            if (!(m[name] && m[name].length)) {
              m[name] = []
            }

            if (types.packed[type] != undefined && (t & 7) === 2) {
              const c2 = r.uint32() + r.pos
              while (r.pos < c2) m[name].push(r[type]())
            } else if (types.basic[type] == undefined) {
              field.resolvedType.group
                ? m[name].push(_types[i].decode(r))
                : m[name].push(_types[i].decode(r, r.uint32()))
            } else {
              m[name].push(r[type]())
            }
          } else if (types.basic[type] == undefined) {
            if (field.resolvedType.group) {
              m[name] = _types[i].decode(r)
            } else {
              m[name] = _types[i].decode(r, r.uint32())
            }
          } else {
            // console.log("m",JSON.stringify(m),"type",type,"field",field);
            m[name] = r[type]()
          }
          break
        }

        if (!find) {
          console.log('t', t)
          r.skipType(t & 7)
        }
      }

      for (i = 0; i < mtype._fieldsArray.length; ++i) {
        const rfield = mtype._fieldsArray[i]
        if (rfield.required) {
          if (!m.hasOwnProperty(rfield.name)) {
            throw util.ProtocolError(missing(rfield), { instance: m })
          }
        }
      }
      // mtype.fieldsArray.filter(function(field) { return field.map; }).length
      return m
    }
  }
}

module.exports = decoder
decoder._configure = function () {
  Enum = require('./enum')
  types = require('./types')
  util = require('./util')
}
