export declare type Classes = Array<string>;
export interface Styles {
    [css: string]: string | number;
}
export declare type ImageEvent = any;
export declare type PlainObject = {
    [key: string]: any;
};
export declare type OptionData = {
    label?: string;
    value?: string | number;
} & PlainObject;
export declare type TreeOptionData<T = string | number> = {
    children?: Array<TreeOptionData<T>> | boolean;
    label?: string;
    text?: string;
    value?: T;
    content?: string;
} & PlainObject;
export declare type SizeEnum = 'small' | 'medium' | 'large';
export declare type ShapeEnum = 'circle' | 'round';
export declare type HorizontalAlignEnum = 'left' | 'center' | 'right';
export declare type VerticalAlignEnum = 'top' | 'middle' | 'bottom';
export declare type LayoutEnum = 'vertical' | 'horizontal';
export declare type ClassName = {
    [className: string]: any;
} | ClassName[] | string;
export declare type CSSSelector = string;
export interface KeysType {
    value?: string;
    label?: string;
    disabled?: string;
}
export interface TreeKeysType extends KeysType {
    children?: string;
}
export interface HTMLElementAttributes {
    [attribute: string]: string;
}
export interface TScroll {
    bufferSize?: number;
    isFixedRowHeight?: boolean;
    rowHeight?: number;
    threshold?: number;
    type: 'lazy' | 'virtual';
}
export declare type InfinityScroll = TScroll;
export interface ScrollToElementParams {
    index?: number;
    top?: number;
    time?: number;
    behavior?: 'auto' | 'smooth';
}
export interface ComponentScrollToElementParams extends ScrollToElementParams {
    key?: string | number;
}
