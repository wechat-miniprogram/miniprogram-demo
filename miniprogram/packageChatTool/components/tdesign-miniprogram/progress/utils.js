var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
export function getBackgroundColor(color) {
    if (typeof color === 'string') {
        return color;
    }
    if (Array.isArray(color)) {
        if (color[0] && color[0][0] === '#') {
            color.unshift('90deg');
        }
        return `linear-gradient( ${color.join(',')} )`;
    }
    const { from, to, direction = 'to right' } = color, rest = __rest(color, ["from", "to", "direction"]);
    let keys = Object.keys(rest);
    if (keys.length) {
        keys = keys.sort((a, b) => parseFloat(a.substr(0, a.length - 1)) - parseFloat(b.substr(0, b.length - 1)));
        const tempArr = keys.map((key) => `${rest[key]} ${key}`);
        return `linear-gradient(${direction}, ${tempArr.join(',')})`;
    }
    return `linear-gradient(${direction}, ${from}, ${to})`;
}
