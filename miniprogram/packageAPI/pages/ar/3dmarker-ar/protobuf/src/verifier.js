/**
 * Created by zhangmiao on 2018/3/14.
 */
module.exports = verifier;

var Enum;
var util;

function invalid(field, expected) {
    return field.name + ": " + expected + (field.repeated && expected !== "array" ? "[]" : field.map && expected !== "object" ? "{k:"+field.keyType+"}" : "") + " expected";
}

function verifyValue(field, fieldIndex, ref, options){
    var _types = options.types;
    if(field.resolvedType){
        if(field.resolvedType instanceof Enum){
            var keys = Object.keys(field.resolvedType.values);
            if (keys.indexOf(ref)<0){
                //没有找到时候
                return invalid(field, "enum value");
            }
        }else {
            var e = _types[fieldIndex].verify(ref);
            if(e)
                return field.name + "."+ e;
        }
    } else {
        switch (field.type) {
            case "int32":
            case "uint32":
            case "sint32":
            case "fixed32":
            case "sfixed32":
                if (!util.isInteger(ref))
                    return invalid(field, "integer");
                break;
            case "int64":
            case "uint64":
            case "sint64":
            case "fixed64":
            case "sfixed64":
                if(!util.isInteger(ref)&&!(ref&&util.isInteger(ref.low)&&util.isInteger(ref.high)))
                    return invalid(field, "integer|Long");
                break;
            case "float":
            case "double":
                if(typeof ref!=="number")
                    return invalid(field, "number");
                break;
            case "bool":
                if(typeof ref!=="boolean")
                    return invalid(field, "boolean");
                break;
            case "string":
                if(!util.isString(ref))
                    return invalid(field, "string");
                break;
            case "bytes":
                if(!(ref&&typeof ref.length==="number"||util.isString(ref)))
                    return invalid(field, "buffer");
                break;
        }
    }
}

function verifyKey(field, ref){
    switch(field.keyType){
        case "int32":
        case "uint32":
        case "sint32":
        case "fixed32":
        case "sfixed32":
            if(!util.key32Re.test(ref))
                return invalid(field, "integer key");
            break;
        case "int64":
        case "uint64":
        case "sint64":
        case "fixed64":
        case "sfixed64":
            if(!util.key64Re.test(ref))
                return invalid(field, "integer|Long key");
            break;
        case "bool":
            if(!util.key2Re.test(ref))
                return invalid(field, "boolean key");
            break;
    }
}

function verifier(mtype){
    return function (options){
        return function (m){
            var invalidDes;
            if(typeof m !== 'object' || m === null)
                return "object expected";

            var oneofs = mtype.oneofsArray,
                seenFirstField = {};
            var p;
            if(oneofs.length)
                p = {};
            for (var i = 0; i < mtype.fieldsArray.length; ++i){
                var field = mtype._fieldsArray[i].resolve(),
                    ref   = m[field.name];
                if(!field.optional || (ref!=null&& m.hasOwnProperty(field.name))){
                    var  _i;
                    if (field.map){
                        if(!util.isObject(ref))
                            return invalid(field, "object");
                        var k=Object.keys(ref);
                        for (_i = 0; _i < k.length; ++_i){
                            //检查key值的合法性
                            invalidDes = verifyKey(field, k[_i]);
                            if(invalidDes){
                                return invalidDes;
                            }
                            //检查value值的合法性
                            invalidDes = verifyValue(field, i, ref[k[_i]], options);
                            if(invalidDes){
                                return invalidDes;
                            }
                        }
                    } else if(field.repeated){
                        if(!Array.isArray(ref)){
                            return invalid(field, "array");
                        }

                        for (_i = 0; _i < ref.length; ++_i) {
                            invalidDes = verifyValue(field, i, ref[_i], options);
                            if(invalidDes){
                                return invalidDes;
                            }
                        }
                    } else {
                        if(field.partOf) {
                            var  oneofPropName = field.partOf.name;
                            if (seenFirstField[field.partOf.name] === 1)
                                if(p[oneofPropName] === 1)
                                    return field.partOf.name + ": multiple values";
                            p[oneofPropName] = 1
                        }
                        invalidDes = verifyValue(field, i, ref, options);
                        if(invalidDes){
                            return invalidDes;
                        }
                    }
                }
            }
        }
    }
}

verifier._configure = function(){
    Enum      = require("./enum");
    util      = require("./util");
};