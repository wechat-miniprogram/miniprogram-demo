/// <reference types="miniprogram-api-typings" />
export interface ComponentsOptionsType extends WechatMiniprogram.Component.ComponentOptions {
    styleIsolation?: 'isolated' | 'apply-shared' | 'shared' | 'page-isolated' | 'page-apply-shared' | 'page-shared';
}
export interface RelationsOptions {
    [componentName: string]: WechatMiniprogram.Component.RelationOption;
}
export interface SuperComponent<D = {}, P = {}, M = {}> extends WechatMiniprogram.Component.Lifetimes, WechatMiniprogram.Component.OtherOption, WechatMiniprogram.Component.InstanceMethods<D> {
    properties: P;
    data: D;
    options: ComponentsOptionsType;
    methods: M | Record<string, (...args: any[]) => any>;
    $global: Function;
    [x: string]: any;
}
export declare class SuperComponent<D = {}, P = {}, M = {}> {
    readonly app: any;
    constructor();
}
