import { SuperComponent } from '../common/src/index';
export default class Link extends SuperComponent {
    externalClasses: string[];
    properties: import("./type").TdLinkProps;
    options: {
        multipleSlots: boolean;
    };
    data: {
        prefix: string;
        classPrefix: string;
    };
    observers: {
        'theme, status, size, underline, navigatorProps'(): void;
        prefixIcon(v: any): void;
        suffixIcon(v: any): void;
    };
    lifetimes: {
        attached(): void;
    };
    methods: {
        setClass(): void;
        onSuccess(e: any): void;
        onFail(e: any): void;
        onComplete(e: any): void;
    };
}
