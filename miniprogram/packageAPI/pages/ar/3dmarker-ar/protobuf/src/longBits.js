module.exports = LongBits;

function LongBits(lo, hi) {
    this.lo = lo >>> 0;
    this.hi = hi >>> 0;
}

var zero = LongBits.zero = new LongBits(0, 0);

zero.toNumber = function() { return 0; };
zero.zzEncode = zero.zzDecode = function() { return this; };
zero.length = function() { return 1; };


var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";

LongBits.fromNumber = function fromNumber(value) {
    if (value === 0)
        return zero;
    var sign = value < 0;//如果sign为 1 ,表示为负数
    if (sign)
        value = -value;
    var lo = value >>> 0,//取出底32位
        hi = (value - lo) / 4294967296 >>> 0; //取出高32位
    if (sign) { //负数
        hi = ~hi >>> 0; //求取高32位的反码
        lo = ~lo >>> 0; //求取低32位的反码
        if (++lo > 4294967295) { //低32位大于Math.pow(2,31)-1
            lo = 0;
            if (++hi > 4294967295) //高32位大于Math.pow(2,31)-1
                hi = 0;
        }
    }
    return new LongBits(lo, hi);
};


LongBits.from = function from(value) {
    if (typeof value === "number")
        return LongBits.fromNumber(value);
    if (typeof value === "string" || value instanceof String) {
        return LongBits.fromNumber(parseInt(value, 10));
    }
    return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
};

LongBits.prototype.toNumber = function toNumber(unsigned) {
    if (!unsigned && this.hi >>> 31) {
        var lo = ~this.lo + 1 >>> 0,
            hi = ~this.hi     >>> 0;
        if (!lo)
            hi = hi + 1 >>> 0;
        return -(lo + hi * 4294967296);
    }
    return this.lo + this.hi * 4294967296;
};
LongBits.prototype.toLong = function toLong(unsigned) {
    //return util.Long
    //    ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned))
    //    /* istanbul ignore next */
    //    : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
    return { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
};

var charCodeAt = String.prototype.charCodeAt;

LongBits.fromHash = function fromHash(hash) {
    if (hash === zeroHash)
        return zero;
    return new LongBits(
        ( charCodeAt.call(hash, 0)
        | charCodeAt.call(hash, 1) << 8
        | charCodeAt.call(hash, 2) << 16
        | charCodeAt.call(hash, 3) << 24) >>> 0
        ,
        ( charCodeAt.call(hash, 4)
        | charCodeAt.call(hash, 5) << 8
        | charCodeAt.call(hash, 6) << 16
        | charCodeAt.call(hash, 7) << 24) >>> 0
    );
};

LongBits.prototype.toHash = function toHash() {
    return String.fromCharCode(
        this.lo        & 255,
        this.lo >>> 8  & 255,
        this.lo >>> 16 & 255,
        this.lo >>> 24      ,
        this.hi        & 255,
        this.hi >>> 8  & 255,
        this.hi >>> 16 & 255,
        this.hi >>> 24
    );
};

LongBits.prototype.zzEncode = function zzEncode() {
    var mask =   this.hi >> 31;
    this.hi  = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
    this.lo  = ( this.lo << 1                   ^ mask) >>> 0;
    return this;
};

LongBits.prototype.zzDecode = function zzDecode() {
    var mask = -(this.lo & 1);
    this.lo  = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
    this.hi  = ( this.hi >>> 1                  ^ mask) >>> 0;
    return this;
};
LongBits.prototype.length = function length() {
    var part0 =  this.lo,
        part1 = (this.lo >>> 28 | this.hi << 4) >>> 0,
        part2 =  this.hi >>> 24;
    return part2 === 0
        ? part1 === 0
        ? part0 < 16384
        ? part0 < 128 ? 1 : 2
        : part0 < 2097152 ? 3 : 4
        : part1 < 16384
        ? part1 < 128 ? 5 : 6
        : part1 < 2097152 ? 7 : 8
        : part2 < 128 ? 9 : 10;
};
