/**
 * Created by zhangmiao on 2018/3/14.
 * 写这个,有点难;有错误请指出 ,微信中不能Function.Apply 和evl,所以去掉其中所有的gen()
 */
var converter = module.exports;

var Enum,
    util;


converter._configure = function () {
    Enum = require('./enum');
    util = require('./util');
};

function valuePartial_fromObject(field, fieldIndex, propName, options){
    var m       = options['m'];
    var d       = options['d'];
    var _types  = options['types'];
    var ksi     = options['ksi'];
    var ksiFlag = typeof ksi != 'undefined';
    if(field.resolvedType){
        if(field.resolvedType instanceof Enum){
            var prop = ksiFlag ? d[propName][ksi] : d[propName];
            var values = field.resolvedType.values,
                keys = Object.keys(values);
            for (var i = 0; i < keys.length; i++){
                if(field.repeated && values[keys[i]] === field.typeDefault){
                    continue;
                }
                if(keys[i] == prop || values[keys[i]] == prop){
                    ksiFlag ?
                        m[propName][ksi] = values[keys[i]] :
                        m[propName] = values[keys[i]];
                    break
                }
            }
        }else {
            if(typeof (ksiFlag ? d[propName][ksi] : d[propName]) !== 'object')
                throw TypeError(field.fullName + ": object expected");
            ksiFlag ?
                m[propName][ksi] = _types[fieldIndex].fromObject(d[propName][ksi]):
                m[propName] = _types[fieldIndex].fromObject(d[propName]);
        }
    } else {
        var  isUnsigned = false;
        switch (field.type){
            case "double":
            case "float":
                ksiFlag ?
                    m[propName][ksi] = Number(d[propName][ksi]) :
                    m[propName] = Number(d[propName]);
                break;
            case "uint32":
            case "fixed32":
                ksiFlag ?
                    m[propName][ksi] = d[propName][ksi] >>> 0:
                    m[propName] = d[propName] >>> 0;
                break;
            case "int32":
            case "sint32":
            case "sfixed32":
                ksiFlag ?
                    m[propName][ksi] = d[propName][ksi] | 0 :
                    m[propName] = d[propName] |0;
                break;
            case "uint64":
                isUnsigned = true;
            // eslint-disable-line no-fallthrough
            case "int64":
            case "sint64":
            case "fixed64":
            case "sfixed64":
                if(util.Long)
                    ksiFlag ?
                        m[propName][ksi] = util.Long.fromValue(d[propName][ksi]).unsigned = isUnsigned :
                        m[propName] = util.Long.fromValue(d[propName]).unsigned = isUnsigned;
                else if(typeof (ksiFlag ? d[propName][ksi] : d[propName]) === 'string')
                    ksiFlag ?
                        m[propName][ksi] =parseInt(d[propName][ksi], 10) :
                        m[propName] =parseInt(d[propName], 10);
                else if(typeof (ksiFlag ? d[propName][ksi] : d[propName]) === 'number')
                    ksiFlag ?
                        m[propName][ksi] = d[propName][ksi] :
                        m[propName] = d[propName];
                else if(typeof (ksiFlag ? d[propName][ksi] : d[propName]) === 'object')
                    ksiFlag ?
                        m[propName][ksi] = new util.LongBits(d[propName][ksi].low >>> 0, d[propName][ksi].high >>> 0).toNumber(isUnsigned) :
                        m[propName] = new util.LongBits(d[propName].low >>> 0, d[propName].high >>> 0).toNumber(isUnsigned);
                break;
            case "bytes":
                if(typeof (ksiFlag ? d[propName][ksi] : d[propName]) ==="string")
                    ksiFlag ?
                        util.base64.decode(d[propName][ksi],m[propName][ksi]=util.newBuffer(util.base64.length(d[propName][ksi])),0) :
                        util.base64.decode(d[propName],m[propName]=util.newBuffer(util.base64.length(d[propName])),0);
                else if((ksiFlag ? d[propName][ksi] : d[propName]).length)
                    ksiFlag?
                        m[propName][ksi]=d[propName][ksi] :
                        m[propName]=d[propName];
                break;
            case "string":
                ksiFlag?
                    m[propName][ksi]=String(d[propName][ksi]) :
                    m[propName]=String(d[propName]);
                break;
            case "bool":
                ksiFlag?
                    m[propName][ksi]=Boolean(d[propName][ksi]):
                    m[propName]=Boolean(d[propName]);
                break;
        }
    }
}

/*
* @param {Type} mtype Message type
* @returns {Function} Function instance
*/
converter.fromObject = function fromObject(mtype){
    var fields = mtype.fieldsArray;
    return function (options){
        return function (d){
            if(d instanceof this.ctor)
                return d;
            if(!fields.length)
                return new  this.ctor;

            var  m = new this.ctor;
            for (var i = 0; i < fields.length; ++i){
                var field       = fields[i].resolve();
                var propName    = field.name;
                var _i;
                if(field.map){
                    if(d[propName]){
                        if(typeof d[propName] !== 'object')
                            throw TypeError(field.fullName + ": object expected");
                        m[propName] = {};
                    }
                    var ks = Object.keys(d[propName]);
                    for ( _i = 0; _i<ks.length ; ++_i)
                        valuePartial_fromObject(field, i, propName, util.merge(util.copy(options), {m:m,d:d,ksi : ks[_i]}));
                }else if(field.repeated){
                    if(d[propName]){
                        if(!Array.isArray(d[propName]))
                            throw TypeError(field.fullName + ": array expected");
                        m[propName] = [];
                        for (_i = 0; _i < d[propName].length; ++_i) {
                            valuePartial_fromObject(field, i, propName, util.merge(util.copy(options), {
                                m: m,
                                d: d,
                                ksi: _i
                            }));
                        }
                    }
                }else {
                    if((field.resolvedType instanceof Enum) || d[propName]!=null){
                        valuePartial_fromObject(field,i,propName, util.merge(util.copy(options), {m:m,d:d}));
                    }
                }
            }
            return m;
        }
    }
};


function valuePartial_toObject (field, fieldIndex, propName, options){
    var m       = options['m'];
    var d       = options['d'];
    var _types  = options['types'];
    var ksi     = options['ksi'];
    var o       = options['o'];
    var ksiFlag = typeof ksi != 'undefined';
    if(field.resolvedType){
        if (field.resolvedType instanceof  Enum)
            ksiFlag ?
                (d[propName][ksi] = o.enums===String?_types[fieldIndex].values[m[propName][ksi]]:m[propName][ksi]) :
                (d[propName] = o.enums===String?_types[fieldIndex].values[m[propName]]:m[propName]);
        else
            ksiFlag ?
                d[propName][ksi] = _types[fieldIndex].toObject(m[propName][ksi], o) :
                d[propName] = _types[fieldIndex].toObject(m[propName], o);
    }else {
        var isUnsigned = false;
        switch (field.type) {
            case "double":
            case "float":
                ksiFlag ? (d[propName][ksi] = o.json && !isFinite(m[propName][ksi])? String(m[propName][ksi]):m[propName][ksi]) :
                    (d[propName] = o.json && !isFinite(m[propName])? String(m[propName]):m[propName]);
                break;
            case "uint64":
                isUnsigned = true;
            // eslint-disable-line no-fallthrough
            case "int64":
            case "sint64":
            case "fixed64":
            case "sfixed64":
                if(typeof m[propName][ksi] === 'number')
                    ksiFlag ?
                        (d[propName][ksi] = o.longs === String ? String(m[propName][ksi]) : m[propName][ksi]) :
                        (d[propName] = o.longs === String ? String(m[propName]) : m[propName]);
                else
                    ksiFlag ?
                        (d[propName][ksi] =
                        o.longs === String ?
                            util.Long.prototype.toString.call(m[propName][ksi]) :
                            o.longs === Number ? new  util.LongBits(m[propName][ksi].low >>> 0, m[propName][ksi].high >>> 0).toNumber(isUnsigned) : m[propName][ksi]):
                        (d[propName] =
                            o.longs === String ?
                                util.Long.prototype.toString.call(m[propName]) :
                                o.longs === Number ? new  util.LongBits(m[propName].low >>> 0, m[propName].high >>> 0).toNumber(isUnsigned) : m[propName]);
                break;
            case "bytes":
                ksiFlag?
                    (d[propName][ksi] =
                    o.bytes === String ?
                        util.base64.encode(m[propName][ksi], 0, m[propName][ksi].length) :
                        o.bytes === Array ? Array.prototype.slice.call(m[propName][ksi]) : m[propName][ksi]):
                    (d[propName] =
                        o.bytes === String ?
                            util.base64.encode(m[propName], 0, m[propName].length) :
                            o.bytes === Array ? Array.prototype.slice.call(m[propName]) : m[propName]);
                break;
            default:
                ksiFlag ? d[propName][ksi] = m[propName][ksi] : d[propName] = m[propName];
                break;
        }
    }
}


converter.toObject   = function toObject(mtype){
    var fields = mtype.fieldsArray.slice().sort(util.compareFieldsById);
    return function (options){
        if(!fields.length)
            return function (){
                return {};
            };
        return function (m, o){
            o = o || {};
            var d = {};
            var repeatedFields = [],
                mapFields = [],
                normalFields = [],
                field,
                propName,
                i = 0;
            for (; i < fields.length; ++i)
                if (!fields[i].partOf)
                    ( fields[i].resolve().repeated ? repeatedFields
                        : fields[i].map ? mapFields
                        : normalFields).push(fields[i]);

            if (repeatedFields.length) {
                if(o.arrays || o.defaults ){
                    for (i = 0; i < repeatedFields.length; ++i)
                        d[repeatedFields[i].name] = [];
                }
            }

            if (mapFields.length) {
                if(o.objects || o.defaults){
                    for  (i = 0; i < mapFields.length; ++i)
                        d[mapFields[i].name] = {};
                }
            }

            if(normalFields.length){
                if(o.defaults){
                    for (i = 0; i < normalFields.length; ++i){
                        field       = normalFields[i],
                        propName    = field.name;
                        if(field.resolvedType instanceof Enum)
                            d[propName] = o.enums = String ? field.resolvedType.valuesById[field.typeDefault] : field.typeDefault;
                        else if(field.long){
                            if(util.Long){
                                var n = new util.Long(field.typeDefault.low, field.typeDefault.high, field.typeDefault.unsigned);
                                d[propName] = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber():n;
                            }else {
                                d[propName] = o.longs === String ? field.typeDefault.toString() : field.typeDefault.toNumber();
                            }
                        }else if(field.bytes){
                            d[propName] = o.bytes === String ? String.fromCharCode.apply(String, field.typeDefault) : Array.prototype.slice.call(field.typeDefault).join('*..*').split("*..*");
                        }else {
                            d[propName] =field.typeDefault;
                        }

                    }
                }
            }
            var hasKs2 = false;
            for (i = 0; i < fields.length; ++i){
                field       = fields[i];
                propName    = field.name;
                var index   = mtype._fieldsArray.indexOf(field);
                var ks2;
                var  j;
                if(field.map){
                    if (!hasKs2){
                        hasKs2 = true;
                    }
                    if (m[propName]&&(ks2 = Object.keys(m[propName]).length)){
                        d[propName] = {};
                        for (j = 0; j < ks2.length; ++j){
                            valuePartial_toObject(field, index, propName, util.merge(util.copy(options), {m:m,d:d,ksi :ks2[j],o:o}));
                        }
                    }
                }else if(field.repeated){
                    if(m[propName]&&m[propName].length){
                        d[propName] = [];
                        for (j = 0; j < m[propName].length; ++j){
                            valuePartial_toObject(field, index, propName, util.merge(util.copy(options), {m:m,d:d,ksi:j,o:o}))
                        }
                    }
                }else {
                    if(m[propName]!=null&& (m.hasOwnProperty(propName)/*|| field.partOf*/)){
                        valuePartial_toObject(field, index, propName, util.merge(util.copy(options), {m:m,d:d,o:o}))
                    }
                    if(field.partOf) {
                        if (o.oneofs)
                            d[field.partOf.name] = propName;
                    }
                }
            }
            return d;
        }
    }


};