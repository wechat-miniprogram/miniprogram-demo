import tinyColor from 'tinycolor2';
import { cmykInputToColor, rgb2cmyk } from './cmyk';
import { parseGradientString, isGradientColor } from './gradient';
const mathRound = Math.round;
const hsv2rgba = (states) => tinyColor(states).toRgb();
const hsv2hsva = (states) => tinyColor(states).toHsv();
const hsv2hsla = (states) => tinyColor(states).toHsl();
export const gradientColors2string = (object) => {
    const { points, degree } = object;
    const colorsStop = points
        .sort((pA, pB) => pA.left - pB.left)
        .map((p) => `${p.color} ${Math.round(p.left * 100) / 100}%`);
    return `linear-gradient(${degree}deg,${colorsStop.join(',')})`;
};
export const getColorWithoutAlpha = (color) => tinyColor(color).setAlpha(1).toHexString();
export const genId = () => (1 + Math.random() * 4294967295).toString(16);
export const genGradientPoint = (left, color) => ({
    id: genId(),
    left,
    color,
});
export class Color {
    constructor(input) {
        this.states = {
            s: 100,
            v: 100,
            h: 100,
            a: 1,
        };
        this.gradientStates = {
            colors: [],
            degree: 0,
            selectedId: null,
            css: '',
        };
        this.update(input);
    }
    update(input) {
        var _a, _b;
        const gradientColors = parseGradientString(input);
        if (this.isGradient && !gradientColors) {
            const colorHsv = tinyColor(input).toHsv();
            this.states = colorHsv;
            this.updateCurrentGradientColor();
            return;
        }
        this.originColor = input;
        this.isGradient = false;
        let colorInput = input;
        if (gradientColors) {
            this.isGradient = true;
            const object = gradientColors;
            const points = object.points.map((c) => genGradientPoint(c.left, c.color));
            this.gradientStates = {
                colors: points,
                degree: object.degree,
                selectedId: ((_a = points[0]) === null || _a === void 0 ? void 0 : _a.id) || null,
            };
            this.gradientStates.css = this.linearGradient;
            colorInput = (_b = this.gradientSelectedPoint) === null || _b === void 0 ? void 0 : _b.color;
        }
        this.updateStates(colorInput);
    }
    get saturation() {
        return this.states.s;
    }
    set saturation(value) {
        this.states.s = Math.max(0, Math.min(100, value));
        this.updateCurrentGradientColor();
    }
    get value() {
        return this.states.v;
    }
    set value(value) {
        this.states.v = Math.max(0, Math.min(100, value));
        this.updateCurrentGradientColor();
    }
    get hue() {
        return this.states.h;
    }
    set hue(value) {
        this.states.h = Math.max(0, Math.min(360, value));
        this.updateCurrentGradientColor();
    }
    get alpha() {
        return this.states.a;
    }
    set alpha(value) {
        this.states.a = Math.max(0, Math.min(1, Math.round(value * 100) / 100));
        this.updateCurrentGradientColor();
    }
    get rgb() {
        const { r, g, b } = hsv2rgba(this.states);
        return `rgb(${mathRound(r)}, ${mathRound(g)}, ${mathRound(b)})`;
    }
    get rgba() {
        const { r, g, b, a } = hsv2rgba(this.states);
        return `rgba(${mathRound(r)}, ${mathRound(g)}, ${mathRound(b)}, ${a})`;
    }
    get hsv() {
        const { h, s, v } = this.getHsva();
        return `hsv(${h}, ${s}%, ${v}%)`;
    }
    get hsva() {
        const { h, s, v, a } = this.getHsva();
        return `hsva(${h}, ${s}%, ${v}%, ${a})`;
    }
    get hsl() {
        const { h, s, l } = this.getHsla();
        return `hsl(${h}, ${s}%, ${l}%)`;
    }
    get hsla() {
        const { h, s, l, a } = this.getHsla();
        return `hsla(${h}, ${s}%, ${l}%, ${a})`;
    }
    get hex() {
        return tinyColor(this.states).toHexString();
    }
    get hex8() {
        return tinyColor(this.states).toHex8String();
    }
    get cmyk() {
        const { c, m, y, k } = this.getCmyk();
        return `cmyk(${c}, ${m}, ${y}, ${k})`;
    }
    get css() {
        if (this.isGradient) {
            return this.linearGradient;
        }
        return this.rgba;
    }
    get linearGradient() {
        const { gradientColors, gradientDegree } = this;
        return gradientColors2string({
            points: gradientColors,
            degree: gradientDegree,
        });
    }
    get gradientColors() {
        return this.gradientStates.colors;
    }
    set gradientColors(colors) {
        this.gradientStates.colors = colors;
        this.gradientStates.css = this.linearGradient;
    }
    get gradientSelectedId() {
        return this.gradientStates.selectedId;
    }
    set gradientSelectedId(id) {
        var _a;
        if (id === this.gradientSelectedId) {
            return;
        }
        this.gradientStates.selectedId = id;
        this.updateStates((_a = this.gradientSelectedPoint) === null || _a === void 0 ? void 0 : _a.color);
    }
    get gradientDegree() {
        return this.gradientStates.degree;
    }
    set gradientDegree(degree) {
        this.gradientStates.degree = Math.max(0, Math.min(360, degree));
        this.gradientStates.css = this.linearGradient;
    }
    get gradientSelectedPoint() {
        const { gradientColors, gradientSelectedId } = this;
        return gradientColors.find((color) => color.id === gradientSelectedId);
    }
    getFormatsColorMap() {
        return {
            HEX: this.hex,
            CMYK: this.cmyk,
            RGB: this.rgb,
            RGBA: this.rgba,
            HSL: this.hsl,
            HSLA: this.hsla,
            HSV: this.hsv,
            HSVA: this.hsva,
            CSS: this.css,
            HEX8: this.hex8,
        };
    }
    updateCurrentGradientColor() {
        const { isGradient, gradientColors, gradientSelectedId } = this;
        const { length } = gradientColors;
        const current = this.gradientSelectedPoint;
        if (!isGradient || length === 0 || !current) {
            return false;
        }
        const index = gradientColors.findIndex((color) => color.id === gradientSelectedId);
        const newColor = Object.assign(Object.assign({}, current), { color: this.rgba });
        gradientColors.splice(index, 1, newColor);
        this.gradientColors = gradientColors.slice();
        return this;
    }
    updateStates(input) {
        const color = tinyColor(cmykInputToColor(input));
        const hsva = color.toHsv();
        this.states = hsva;
    }
    getRgba() {
        const { r, g, b, a } = hsv2rgba(this.states);
        return {
            r: mathRound(r),
            g: mathRound(g),
            b: mathRound(b),
            a,
        };
    }
    getCmyk() {
        const { r, g, b } = this.getRgba();
        const [c, m, y, k] = rgb2cmyk(r, g, b);
        return {
            c: mathRound(c * 100),
            m: mathRound(m * 100),
            y: mathRound(y * 100),
            k: mathRound(k * 100),
        };
    }
    getHsva() {
        let { h, s, v, a } = hsv2hsva(this.states);
        h = mathRound(h);
        s = mathRound(s * 100);
        v = mathRound(v * 100);
        a *= 1;
        return {
            h,
            s,
            v,
            a,
        };
    }
    getHsla() {
        let { h, s, l, a } = hsv2hsla(this.states);
        h = mathRound(h);
        s = mathRound(s * 100);
        l = mathRound(l * 100);
        a *= 1;
        return {
            h,
            s,
            l,
            a,
        };
    }
    equals(color) {
        return tinyColor.equals(this.rgba, color);
    }
    static isValid(color) {
        if (parseGradientString(color)) {
            return true;
        }
        return tinyColor(color).isValid();
    }
    static hsva2color(h, s, v, a) {
        return tinyColor({
            h,
            s,
            v,
            a,
        }).toHsvString();
    }
    static hsla2color(h, s, l, a) {
        return tinyColor({
            h,
            s,
            l,
            a,
        }).toHslString();
    }
    static rgba2color(r, g, b, a) {
        return tinyColor({
            r,
            g,
            b,
            a,
        }).toHsvString();
    }
    static hex2color(hex, a) {
        const color = tinyColor(hex);
        color.setAlpha(a);
        return color.toHexString();
    }
    static object2color(object, format) {
        if (format === 'CMYK') {
            const { c, m, y, k } = object;
            return `cmyk(${c}, ${m}, ${y}, ${k})`;
        }
        const color = tinyColor(object, {
            format,
        });
        return color.toRgbString();
    }
}
Color.isGradientColor = (input) => !!isGradientColor(input);
Color.compare = (color1, color2) => {
    const isGradientColor1 = Color.isGradientColor(color1);
    const isGradientColor2 = Color.isGradientColor(color2);
    if (isGradientColor1 && isGradientColor2) {
        const gradientColor1 = gradientColors2string(parseGradientString(color1));
        const gradientColor2 = gradientColors2string(parseGradientString(color2));
        return gradientColor1 === gradientColor2;
    }
    if (!isGradientColor1 && !isGradientColor2) {
        return tinyColor.equals(color1, color2);
    }
    return false;
};
const COLOR_OBJECT_OUTPUT_KEYS = [
    'alpha',
    'css',
    'hex',
    'hex8',
    'hsl',
    'hsla',
    'hsv',
    'hsva',
    'rgb',
    'rgba',
    'saturation',
    'value',
    'isGradient',
];
export const getColorObject = (color) => {
    if (!color) {
        return null;
    }
    const colorObject = Object.create(null);
    COLOR_OBJECT_OUTPUT_KEYS.forEach((key) => (colorObject[key] = color[key]));
    if (color.isGradient) {
        colorObject.linearGradient = color.linearGradient;
    }
    return colorObject;
};
export default Color;
