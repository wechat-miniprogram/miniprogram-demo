function inRange(a,b,c){return b<=a&&a<=c}function includes(a,b){return a.indexOf(b)!==-1}var floor=Math.floor;function ToDictionary(o){if(o===undefined)return{};if(o===Object(o))return o;throw TypeError('Could not convert argument to dictionary');}function stringToCodePoints(e){var s=String(e);var n=s.length;var i=0;var u=[];while(i<n){var c=s.charCodeAt(i);if(c<0xD800||c>0xDFFF){u.push(c)}else if(0xDC00<=c&&c<=0xDFFF){u.push(0xFFFD)}else if(0xD800<=c&&c<=0xDBFF){if(i===n-1){u.push(0xFFFD)}else{var d=s.charCodeAt(i+1);if(0xDC00<=d&&d<=0xDFFF){var a=c&0x3FF;var b=d&0x3FF;u.push(0x10000+(a<<10)+b);i+=1}else{u.push(0xFFFD)}}}i+=1}return u}function codePointsToString(a){var s='';for(var i=0;i<a.length;++i){var b=a[i];if(b<=0xFFFF){s+=String.fromCharCode(b)}else{b-=0x10000;s+=String.fromCharCode((b>>10)+0xD800,(b&0x3FF)+0xDC00)}}return s}function isASCIIByte(a){return 0x00<=a&&a<=0x7F}var isASCIICodePoint=isASCIIByte;var end_of_stream=-1;function Stream(a){this.tokens=[].slice.call(a);this.tokens.reverse()}Stream.prototype={endOfStream:function(){return!this.tokens.length},read:function(){if(!this.tokens.length)return end_of_stream;return this.tokens.pop()},prepend:function(a){if(Array.isArray(a)){var b=(a);while(b.length)this.tokens.push(b.pop())}else{this.tokens.push(a)}},push:function(a){if(Array.isArray(a)){var b=(a);while(b.length)this.tokens.unshift(b.shift())}else{this.tokens.unshift(a)}}};var finished=-1;function decoderError(a,b){if(a)throw TypeError('Decoder error');return b||0xFFFD}function encoderError(a){throw TypeError('The code point '+a+' could not be encoded.');}function Decoder(){}Decoder.prototype={handler:function(a,b){}};function Encoder(){}Encoder.prototype={handler:function(a,b){}};function getEncoding(a){a=String(a).trim().toLowerCase();if(Object.prototype.hasOwnProperty.call(label_to_encoding,a)){return label_to_encoding[a]}return null}var encodings=[{"encodings":[{"labels":["unicode-1-1-utf-8","utf-8","utf8"],"name":"UTF-8"}],"heading":"The Encoding"},];var label_to_encoding={};encodings.forEach(function(c){c.encodings.forEach(function(b){b.labels.forEach(function(a){label_to_encoding[a]=b})})});var encoders={};var decoders={};function indexCodePointFor(a,b){if(!b)return null;return b[a]||null}function indexPointerFor(a,b){var c=b.indexOf(a);return c===-1?null:c}function index(a){if(!('encoding-indexes'in global)){throw Error("Indexes missing."+" Did you forget to include encoding-indexes.js first?");}return global['encoding-indexes'][a]}function indexGB18030RangesCodePointFor(a){if((a>39419&&a<189000)||(a>1237575))return null;if(a===7457)return 0xE7C7;var b=0;var c=0;var d=index('gb18030-ranges');var i;for(i=0;i<d.length;++i){var e=d[i];if(e[0]<=a){b=e[0];c=e[1]}else{break}}return c+a-b}function indexGB18030RangesPointerFor(a){if(a===0xE7C7)return 7457;var b=0;var c=0;var d=index('gb18030-ranges');var i;for(i=0;i<d.length;++i){var e=d[i];if(e[1]<=a){b=e[1];c=e[0]}else{break}}return c+a-b}function indexShiftJISPointerFor(c){shift_jis_index=shift_jis_index||index('jis0208').map(function(a,b){return inRange(b,8272,8835)?null:a});var d=shift_jis_index;return d.indexOf(c)}var shift_jis_index;function indexBig5PointerFor(c){big5_index_no_hkscs=big5_index_no_hkscs||index('big5').map(function(a,b){return(b<(0xA1-0x81)*157)?null:a});var d=big5_index_no_hkscs;if(c===0x2550||c===0x255E||c===0x2561||c===0x256A||c===0x5341||c===0x5345){return d.lastIndexOf(c)}return indexPointerFor(c,d)}var big5_index_no_hkscs;var DEFAULT_ENCODING='utf-8';function TextDecoder(a,b){if(!(this instanceof TextDecoder))throw TypeError('Called as a function. Did you forget \'new\'?');a=a!==undefined?String(a):DEFAULT_ENCODING;b=ToDictionary(b);this._encoding=null;this._decoder=null;this._ignoreBOM=false;this._BOMseen=false;this._error_mode='replacement';this._do_not_flush=false;var c=getEncoding(a);if(c===null||c.name==='replacement')throw RangeError('Unknown encoding: '+a);if(!decoders[c.name]){throw Error('Decoder not present.'+' Did you forget to include encoding-indexes.js first?');}var d=this;d._encoding=c;if(Boolean(b['fatal']))d._error_mode='fatal';if(Boolean(b['ignoreBOM']))d._ignoreBOM=true;if(!Object.defineProperty){this.encoding=d._encoding.name.toLowerCase();this.fatal=d._error_mode==='fatal';this.ignoreBOM=d._ignoreBOM}return d}if(Object.defineProperty){Object.defineProperty(TextDecoder.prototype,'encoding',{get:function(){return this._encoding.name.toLowerCase()}});Object.defineProperty(TextDecoder.prototype,'fatal',{get:function(){return this._error_mode==='fatal'}});Object.defineProperty(TextDecoder.prototype,'ignoreBOM',{get:function(){return this._ignoreBOM}})}TextDecoder.prototype.decode=function decode(b,c){var d;if(typeof b==='object'&&b instanceof ArrayBuffer){d=new Uint8Array(b)}else if(typeof b==='object'&&'buffer'in b&&b.buffer instanceof ArrayBuffer){d=new Uint8Array(b.buffer,b.byteOffset,b.byteLength)}else{d=new Uint8Array(0)}c=ToDictionary(c);if(!this._do_not_flush){this._decoder=decoders[this._encoding.name]({fatal:this._error_mode==='fatal'});this._BOMseen=false}this._do_not_flush=Boolean(c['stream']);var e=new Stream(d);var f=[];var g;while(true){var h=e.read();if(h===end_of_stream)break;g=this._decoder.handler(e,h);if(g===finished)break;if(g!==null){if(Array.isArray(g))f.push.apply(f,(g));else f.push(g)}}if(!this._do_not_flush){do{g=this._decoder.handler(e,e.read());if(g===finished)break;if(g===null)continue;if(Array.isArray(g))f.push.apply(f,(g));else f.push(g)}while(!e.endOfStream());this._decoder=null}function serializeStream(a){if(includes(['UTF-8','UTF-16LE','UTF-16BE'],this._encoding.name)&&!this._ignoreBOM&&!this._BOMseen){if(a.length>0&&a[0]===0xFEFF){this._BOMseen=true;a.shift()}else if(a.length>0){this._BOMseen=true}else{}}return codePointsToString(a)}return serializeStream.call(this,f)};function TextEncoder(a,b){if(!(this instanceof TextEncoder))throw TypeError('Called as a function. Did you forget \'new\'?');b=ToDictionary(b);this._encoding=null;this._encoder=null;this._do_not_flush=false;this._fatal=Boolean(b['fatal'])?'fatal':'replacement';var c=this;if(Boolean(b['NONSTANDARD_allowLegacyEncoding'])){a=a!==undefined?String(a):DEFAULT_ENCODING;var d=getEncoding(a);if(d===null||d.name==='replacement')throw RangeError('Unknown encoding: '+a);if(!encoders[d.name]){throw Error('Encoder not present.'+' Did you forget to include encoding-indexes.js first?');}c._encoding=d}else{c._encoding=getEncoding('utf-8');if(a!==undefined&&'console'in global){console.warn('TextEncoder constructor called with encoding label, '+'which is ignored.')}}if(!Object.defineProperty)this.encoding=c._encoding.name.toLowerCase();return c}if(Object.defineProperty){Object.defineProperty(TextEncoder.prototype,'encoding',{get:function(){return this._encoding.name.toLowerCase()}})}TextEncoder.prototype.encode=function encode(a,b){a=a===undefined?'':String(a);b=ToDictionary(b);if(!this._do_not_flush)this._encoder=encoders[this._encoding.name]({fatal:this._fatal==='fatal'});this._do_not_flush=Boolean(b['stream']);var c=new Stream(stringToCodePoints(a));var d=[];var e;while(true){var f=c.read();if(f===end_of_stream)break;e=this._encoder.handler(c,f);if(e===finished)break;if(Array.isArray(e))d.push.apply(d,(e));else d.push(e)}if(!this._do_not_flush){while(true){e=this._encoder.handler(c,c.read());if(e===finished)break;if(Array.isArray(e))d.push.apply(d,(e));else d.push(e)}this._encoder=null}return new Uint8Array(d)};function UTF8Decoder(d){var e=d.fatal;var f=0,utf8_bytes_seen=0,utf8_bytes_needed=0,utf8_lower_boundary=0x80,utf8_upper_boundary=0xBF;this.handler=function(a,b){if(b===end_of_stream&&utf8_bytes_needed!==0){utf8_bytes_needed=0;return decoderError(e)}if(b===end_of_stream)return finished;if(utf8_bytes_needed===0){if(inRange(b,0x00,0x7F)){return b}else if(inRange(b,0xC2,0xDF)){utf8_bytes_needed=1;f=b&0x1F}else if(inRange(b,0xE0,0xEF)){if(b===0xE0)utf8_lower_boundary=0xA0;if(b===0xED)utf8_upper_boundary=0x9F;utf8_bytes_needed=2;f=b&0xF}else if(inRange(b,0xF0,0xF4)){if(b===0xF0)utf8_lower_boundary=0x90;if(b===0xF4)utf8_upper_boundary=0x8F;utf8_bytes_needed=3;f=b&0x7}else{return decoderError(e)}return null}if(!inRange(b,utf8_lower_boundary,utf8_upper_boundary)){f=utf8_bytes_needed=utf8_bytes_seen=0;utf8_lower_boundary=0x80;utf8_upper_boundary=0xBF;a.prepend(b);return decoderError(e)}utf8_lower_boundary=0x80;utf8_upper_boundary=0xBF;f=(f<<6)|(b&0x3F);utf8_bytes_seen+=1;if(utf8_bytes_seen!==utf8_bytes_needed)return null;var c=f;f=utf8_bytes_needed=utf8_bytes_seen=0;return c}}function UTF8Encoder(f){var g=f.fatal;this.handler=function(a,b){if(b===end_of_stream)return finished;if(isASCIICodePoint(b))return b;var c,offset;if(inRange(b,0x0080,0x07FF)){c=1;offset=0xC0}else if(inRange(b,0x0800,0xFFFF)){c=2;offset=0xE0}else if(inRange(b,0x10000,0x10FFFF)){c=3;offset=0xF0}var d=[(b>>(6*c))+offset];while(c>0){var e=b>>(6*(c-1));d.push(0x80|(e&0x3F));c-=1}return d}}encoders['UTF-8']=function(a){return new UTF8Encoder(a)};decoders['UTF-8']=function(a){return new UTF8Decoder(a)};
let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    return new Uint8Array(wasm.memory.buffer);
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let cachedFloat32Memory0 = null;

function getFloat32Memory0() {
    return new Float32Array(wasm.memory.buffer);
}

let WASM_VECTOR_LEN = 0;

function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getFloat32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

const GaussianFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_gaussian_free(ptr >>> 0));
/**
*/
export class Gaussian {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Gaussian.prototype);
        obj.__wbg_ptr = ptr;
        GaussianFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GaussianFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_gaussian_free(ptr);
    }
    /**
    * @param {number} count
    * @param {Float32Array} position_src
    * @param {Float32Array} color_src
    * @param {Float32Array} opacity_src
    * @param {Float32Array} cov_src
    * @returns {Gaussian}
    */
    static new(count, position_src, color_src, opacity_src, cov_src) {
        const ptr0 = passArrayF32ToWasm0(position_src, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF32ToWasm0(color_src, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF32ToWasm0(opacity_src, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passArrayF32ToWasm0(cov_src, wasm.__wbindgen_malloc);
        const len3 = WASM_VECTOR_LEN;
        const ret = wasm.gaussian_new(count, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
        return Gaussian.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    get vpm_ptr() {
        const ret = wasm.gaussian_vpm_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get positions_ptr() {
        const ret = wasm.gaussian_positions_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get opacities_ptr() {
        const ret = wasm.gaussian_opacities_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get colors_ptr() {
        const ret = wasm.gaussian_colors_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get cov_a_ptr() {
        const ret = wasm.gaussian_cov_a_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get cov_b_ptr() {
        const ret = wasm.gaussian_cov_b_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    */
    sort() {
        wasm.gaussian_sort(this.__wbg_ptr);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WXWebAssembly.instantiateStreaming === 'function') {
            try {
                return await WXWebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WXWebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WXWebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WXWebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WXWebAssembly.instantiate(module, imports);

        if (instance instanceof WXWebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedFloat32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WXWebAssembly.Module)) {
        module = new WXWebAssembly.Module(module);
    }

    const instance = new WXWebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
