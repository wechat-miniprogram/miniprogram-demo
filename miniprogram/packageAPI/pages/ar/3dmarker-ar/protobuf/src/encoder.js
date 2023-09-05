/**
 * Created by zhangmiao on 2018/3/13.
 * 改写原来的googleProtocolBuffer的encode,请不要告我侵犯版权;/(ㄒoㄒ)/~~
 */
var Enum;
var types;


//得到一个编码过程
function encoder(mtype){
    return function (options){
        var Writer = options.Writer;
        var _types  = options.types;
        var util   = options.util;
        return function (message, writer) {
            writer = writer || Writer.create();
            var fields = mtype.fieldsArray.slice().sort(util.compareFieldsById);
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                var index = mtype._fieldsArray.indexOf(field);

                var type = field.resolvedType instanceof Enum ? 'uint32' : field.type;
                var wireType = types.basic[type];
                var ref      = message[field.name];
                //此处增加枚举型替换,有可能外界传入的枚举是string,转换成number
                if(field.resolvedType instanceof Enum && typeof ref === 'string'){
                    ref = _types[index]['values'][ref];
                }

                //正式进行序列化
                if (field.map) {//有待验证
                    if(ref != null && message.hasOwnProperty(field.name)){
                        for (var  ks =Object.keys(ref), l = 0; l < ks.length; ++l){
                            writer.uint32((field.id << 3 | 2) >>> 0).fork().uint32(8 | types.mapKey[field.keyType])[field.keyType](ks[l]);
                            if(wireType === undefined ){
                                _types[index].encode(ref[ks[l]], writer.uint32(18).fork()).ldelim().ldelim();
                            }else {
                                writer.uint32(16 | wireType)[type](ref[ks[l]]).ldelim();
                            }
                        }
                    }
                } else if (field.repeated) {
                    if (ref && ref.length) {
                        if (field.packed && types.packed[type] !== undefined) {//如果数据可以被packed的话
                            writer.uint32((field.id << 3 | 2) >>> 0).fork();
                            for (var j = 0; j < ref.length; j++) {
                                writer[type](ref[j])
                            }
                            writer.ldelim();
                        } else {//数据不能packed的话
                            for (var k = 0; k < ref.length; k++) {
                                if (wireType === undefined) {//如果是一个自定义的数据类型
                                    if(field.resolvedType.group){
                                        _types[index].encode(ref[k],writer.uint32((field.id << 3 | 3) >>> 0)).uint32((field.id << 3 | 4) >>> 0);
                                    }else {
                                        _types[index].encode(ref[k],writer.uint32((field.id << 3 | 2) >>> 0).fork()).ldelim();
                                    }
                                } else {//如果是string 或者 bytes
                                    writer.uint32((field.id << 3 | wireType) >>> 0)[type](ref[k]);
                                }
                            }
                        }
                    }
                } else {
                    if(!field.optional || (ref != null && (message.hasOwnProperty(field.name) /*|| field.partOf*/))){
                        if(!field.optional && (ref == null || !message.hasOwnProperty(field.name))){
                            console.warn('注意啦!!!很大概率会报错 类型:',message.$type ? message.$type.name : "不晓得",'没有设置对应的属性:',field.name,'检查是不是proto文件属性设置为了required');
                        }
                        if(wireType === undefined){
                            if(field.resolvedType.group){
                                _types[index].encode(ref,writer.uint32((field.id << 3 | 3) >>> 0)).uint32((field.id << 3 | 4) >>> 0);
                            }else {
                                _types[index].encode(ref,writer.uint32((field.id << 3 | 2) >>> 0).fork()).ldelim();
                            }
                        }else {
                            writer.uint32((field.id << 3 | wireType) >>> 0)[type](ref);
                        }
                    }
                }
            }
            return writer;
        }
    };
}

module.exports = encoder;

encoder._configure  = function (){
    Enum    = require("./enum");
    types   = require("./types");
};