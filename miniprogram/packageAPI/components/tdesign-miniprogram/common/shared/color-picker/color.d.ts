import tinyColor from 'tinycolor2';
import { GradientColors, GradientColorPoint } from './gradient';
export interface ColorObject {
    alpha: number;
    css: string;
    hex: string;
    hex8: string;
    hsl: string;
    hsla: string;
    hsv: string;
    hsva: string;
    rgb: string;
    rgba: string;
    saturation: number;
    value: number;
    isGradient: boolean;
    linearGradient?: string;
}
interface ColorStates {
    s: number;
    v: number;
    h: number;
    a: number;
}
interface GradientStates {
    colors: GradientColorPoint[];
    degree: number;
    selectedId: string;
    css?: string;
}
export declare const gradientColors2string: (object: GradientColors) => string;
export declare const getColorWithoutAlpha: (color: string) => string;
export declare const genId: () => string;
export declare const genGradientPoint: (left: number, color: string) => GradientColorPoint;
export declare class Color {
    states: ColorStates;
    originColor: string;
    isGradient: boolean;
    gradientStates: GradientStates;
    constructor(input: string);
    update(input: string): void;
    get saturation(): number;
    set saturation(value: number);
    get value(): number;
    set value(value: number);
    get hue(): number;
    set hue(value: number);
    get alpha(): number;
    set alpha(value: number);
    get rgb(): string;
    get rgba(): string;
    get hsv(): string;
    get hsva(): string;
    get hsl(): string;
    get hsla(): string;
    get hex(): string;
    get hex8(): string;
    get cmyk(): string;
    get css(): string;
    get linearGradient(): string;
    get gradientColors(): GradientColorPoint[];
    set gradientColors(colors: GradientColorPoint[]);
    get gradientSelectedId(): string;
    set gradientSelectedId(id: string);
    get gradientDegree(): number;
    set gradientDegree(degree: number);
    get gradientSelectedPoint(): GradientColorPoint;
    getFormatsColorMap(): {
        HEX: string;
        CMYK: string;
        RGB: string;
        RGBA: string;
        HSL: string;
        HSLA: string;
        HSV: string;
        HSVA: string;
        CSS: string;
        HEX8: string;
    };
    updateCurrentGradientColor(): false | this;
    updateStates(input: string): void;
    getRgba(): {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    getCmyk(): {
        c: number;
        m: number;
        y: number;
        k: number;
    };
    getHsva(): tinyColor.ColorFormats.HSVA;
    getHsla(): tinyColor.ColorFormats.HSLA;
    equals(color: string): boolean;
    static isValid(color: string): boolean;
    static hsva2color(h: number, s: number, v: number, a: number): string;
    static hsla2color(h: number, s: number, l: number, a: number): string;
    static rgba2color(r: number, g: number, b: number, a: number): string;
    static hex2color(hex: string, a: number): string;
    static object2color(object: any, format: string): string;
    static isGradientColor: (input: string) => boolean;
    static compare: (color1: string, color2: string) => boolean;
}
export declare const getColorObject: (color: Color) => ColorObject;
export default Color;
