/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
export declare const systemInfo: WechatMiniprogram.WindowInfo | WechatMiniprogram.SystemInfo;
export declare const appBaseInfo: WechatMiniprogram.AppBaseInfo | WechatMiniprogram.SystemInfo;
export declare const deviceInfo: WechatMiniprogram.DeviceInfo | WechatMiniprogram.SystemInfo;
declare type Context = WechatMiniprogram.Page.TrivialInstance | WechatMiniprogram.Component.TrivialInstance;
export declare const debounce: (func: any, wait?: number) => (...rest: any[]) => void;
export declare const throttle: (func: any, wait?: number, options?: any) => (...args: any[]) => void;
export declare const classNames: (...args: any[]) => string;
export declare const styles: (styleObj: any) => string;
export declare const getAnimationFrame: (context: any, cb: Function) => any;
export declare const getRect: (context: any, selector: string, needAll?: boolean) => Promise<any>;
export declare const isNumber: (value: any) => boolean;
export declare const isNull: (value: any) => boolean;
export declare const isUndefined: (value: any) => boolean;
export declare const isDef: (value: any) => boolean;
export declare const isIOS: () => boolean;
export declare const addUnit: (value?: string | number) => string | undefined;
export declare const getCharacterLength: (type: string, char: string | number, max?: number) => {
    length: number;
    characters: string;
};
export declare const chunk: (arr: any[], size: number) => any[][];
export declare const getInstance: (context?: Context, selector?: string) => WechatMiniprogram.Component.TrivialInstance;
export declare const unitConvert: (value: number | string | null | undefined) => number;
export declare const setIcon: (iconName: any, icon: any, defaultIcon: any) => {
    [x: string]: any;
};
export declare const isBool: (val: any) => boolean;
export declare const isObject: (val: any) => boolean;
export declare const isString: (val: any) => boolean;
export declare const toCamel: (str: any) => any;
export declare const getCurrentPage: <T>() => T & WechatMiniprogram.OptionalInterface<WechatMiniprogram.Page.ILifetime> & WechatMiniprogram.Page.InstanceProperties & WechatMiniprogram.Page.InstanceMethods<WechatMiniprogram.IAnyObject> & WechatMiniprogram.Page.Data<WechatMiniprogram.IAnyObject> & WechatMiniprogram.IAnyObject;
export declare const uniqueFactory: (compName: any) => () => string;
export declare const calcIcon: (icon: string | Record<string, any>, defaultIcon?: string) => string | Record<string, any>;
export declare const isOverSize: (size: any, sizeLimit: any) => boolean;
export declare const rpx2px: (rpx: any) => number;
export declare const nextTick: () => Promise<void>;
export {};
