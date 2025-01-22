/// <reference types="miniprogram-api-typings" />
import { SuperComponent } from '../common/src/index';
export default class Tag extends SuperComponent {
    data: {
        prefix: string;
        classPrefix: string;
        className: string;
        tagStyle: string;
    };
    properties: import("./type").TdTagProps;
    externalClasses: string[];
    options: WechatMiniprogram.Component.ComponentOptions;
    lifetimes: {
        attached(): void;
    };
    observers: {
        'size, shape, theme, variant, closable, disabled'(): void;
        maxWidth(): void;
        icon(v: any): void;
        closable(v: any): void;
    };
    methods: {
        setClass(): void;
        setTagStyle(): string;
        handleClick(e: WechatMiniprogram.BaseEvent): void;
        handleClose(e: WechatMiniprogram.BaseEvent): void;
    };
}
