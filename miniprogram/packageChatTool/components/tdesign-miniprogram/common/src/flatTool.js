export const getPrototypeOf = function (obj) {
    return Object.getPrototypeOf ? Object.getPrototypeOf(obj) : obj.__proto__;
};
export const isObject = function isObject(something) {
    const type = typeof something;
    return something !== null && (type === 'function' || type === 'object');
};
export const iterateInheritedPrototype = function iterateInheritedPrototype(callback, fromCtor, toCtor, includeToCtor = true) {
    let proto = fromCtor.prototype || fromCtor;
    const toProto = toCtor.prototype || toCtor;
    while (proto) {
        if (!includeToCtor && proto === toProto)
            break;
        if (callback(proto) === false)
            break;
        if (proto === toProto)
            break;
        proto = getPrototypeOf(proto);
    }
};
export const toObject = function toObject(something, options = {}) {
    const obj = {};
    if (!isObject(something))
        return obj;
    const excludes = options.excludes || ['constructor'];
    const { enumerable = true, configurable = 0, writable = 0 } = options;
    const defaultDesc = {};
    if (enumerable !== 0)
        defaultDesc.enumerable = enumerable;
    if (configurable !== 0)
        defaultDesc.configurable = configurable;
    if (writable !== 0)
        defaultDesc.writable = writable;
    iterateInheritedPrototype((proto) => {
        Object.getOwnPropertyNames(proto).forEach((key) => {
            if (excludes.indexOf(key) >= 0)
                return;
            if (Object.prototype.hasOwnProperty.call(obj, key))
                return;
            const desc = Object.getOwnPropertyDescriptor(proto, key);
            const fnKeys = ['get', 'set', 'value'];
            fnKeys.forEach((k) => {
                if (typeof desc[k] === 'function') {
                    const oldFn = desc[k];
                    desc[k] = function (...args) {
                        return oldFn.apply(Object.prototype.hasOwnProperty.call(options, 'bindTo') ? options.bindTo : this, args);
                    };
                }
            });
            Object.defineProperty(obj, key, Object.assign(Object.assign({}, desc), defaultDesc));
        });
    }, something, options.till || Object, false);
    return obj;
};
export const isPlainObject = function isPlainObject(something) {
    return Object.prototype.toString.call(something) === '[object Object]';
};
