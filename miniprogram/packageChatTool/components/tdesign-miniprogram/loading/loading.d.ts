import { SuperComponent } from '../common/src/index';
import type { TdLoadingProps } from './type';
export interface LoadingProps extends TdLoadingProps {
}
export default class Loading extends SuperComponent {
    externalClasses: string[];
    data: {
        prefix: string;
        classPrefix: string;
        show: boolean;
    };
    options: {
        multipleSlots: boolean;
    };
    properties: {
        delay?: {
            type: NumberConstructor;
            value?: number;
        };
        duration?: {
            type: NumberConstructor;
            value?: number;
        };
        fullscreen?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        indicator?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        inheritColor?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        layout?: {
            type: StringConstructor;
            value?: "horizontal" | "vertical";
        };
        loading?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        pause?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        progress?: {
            type: NumberConstructor;
            value?: number;
        };
        reverse?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        size?: {
            type: StringConstructor;
            value?: string;
        };
        text?: {
            type: StringConstructor;
            value?: string;
        };
        theme?: {
            type: StringConstructor;
            value?: "circular" | "spinner" | "dots";
        };
    };
    timer: any;
    observers: {
        loading(this: any, cur: any): void;
    };
    lifetimes: {
        detached(): void;
    };
    refreshPage(): void;
}
