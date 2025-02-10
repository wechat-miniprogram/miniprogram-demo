export declare const getPrototypeOf: (obj: any) => any;
export declare const isObject: (something: any) => boolean;
export declare const iterateInheritedPrototype: (callback: (proto: Record<string, any>) => boolean | void, fromCtor: any, toCtor: any, includeToCtor?: boolean) => void;
export interface ClassInstanceToObjectOptions {
    bindTo?: any;
    excludes?: string[];
    till?: any;
    enumerable?: 0 | boolean;
    configurable?: 0 | boolean;
    writable?: 0 | boolean;
}
export declare const toObject: (something: any, options?: ClassInstanceToObjectOptions) => {
    [key: string]: any;
};
export declare const isPlainObject: (something: any) => boolean;
