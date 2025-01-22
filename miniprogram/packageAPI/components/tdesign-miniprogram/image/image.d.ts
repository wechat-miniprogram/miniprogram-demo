import { SuperComponent } from '../common/src/index';
export default class Image extends SuperComponent {
    externalClasses: string[];
    options: {
        multipleSlots: boolean;
    };
    properties: import("./type").TdImageProps;
    data: {
        prefix: string;
        isLoading: boolean;
        isFailed: boolean;
        innerStyle: string;
        classPrefix: string;
    };
    preSrc: string;
    observers: {
        src(): void;
        'width, height'(width: any, height: any): void;
    };
    methods: {
        onLoaded(e: any): void;
        onLoadError(e: any): void;
        calcSize(width: any, height: any): void;
        update(): void;
    };
}
