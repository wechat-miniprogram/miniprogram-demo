/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
declare type Context = WechatMiniprogram.Page.TrivialInstance | WechatMiniprogram.Component.TrivialInstance;
declare type ToastType = 'loading' | 'success' | 'error';
declare type ToastPositionType = 'top' | 'middle' | 'bottom';
declare type ToastDirectionType = 'row' | 'column';
export declare type ToastOptionsType = {
    context?: Context;
    selector?: string;
    icon?: string;
    message?: string;
    duration?: number;
    theme?: ToastType;
    placement?: ToastPositionType;
    preventScrollThrough?: boolean;
    direction?: ToastDirectionType;
    close?: () => void;
};
declare function Toast(options: ToastOptionsType): void;
declare function showToast(options?: ToastOptionsType): void;
declare function hideToast(options?: ToastOptionsType): void;
export { Toast as default, showToast, hideToast };
