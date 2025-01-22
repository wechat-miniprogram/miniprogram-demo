/// <reference types="node" />
import { SuperComponent } from '../common/src/index';
import { ToastOptionsType } from './index';
declare type Timer = NodeJS.Timeout | null;
export default class Toast extends SuperComponent {
    externalClasses: string[];
    options: {
        multipleSlots: boolean;
    };
    behaviors: string[];
    hideTimer: Timer;
    data: {
        prefix: string;
        classPrefix: string;
        typeMapIcon: string;
    };
    properties: import("./type").TdToastProps;
    lifetimes: {
        detached(): void;
    };
    pageLifetimes: {
        hide(): void;
    };
    methods: {
        show(options: ToastOptionsType): void;
        hide(): void;
        destroyed(): void;
        loop(): void;
    };
}
export {};
