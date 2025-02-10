import { SuperComponent } from '../common/src/index';
import type { TdButtonProps } from './type';
export interface ButtonProps extends TdButtonProps {
}
export default class Button extends SuperComponent {
    externalClasses: string[];
    behaviors: string[];
    properties: TdButtonProps;
    options: {
        multipleSlots: boolean;
    };
    data: {
        prefix: string;
        className: string;
        classPrefix: string;
    };
    observers: {
        'theme, size, plain, block, shape, disabled, loading, variant'(): void;
        icon(icon: any): void;
    };
    lifetimes: {
        attached(): void;
    };
    methods: {
        setClass(): void;
        getuserinfo(e: any): void;
        contact(e: any): void;
        getphonenumber(e: any): void;
        error(e: any): void;
        opensetting(e: any): void;
        launchapp(e: any): void;
        chooseavatar(e: any): void;
        agreeprivacyauthorization(e: any): void;
        handleTap(e: any): void;
    };
}
