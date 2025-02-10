import { SuperComponent, RelationsOptions } from '../common/src/index';
export default class Cell extends SuperComponent {
    externalClasses: string[];
    relations: RelationsOptions;
    options: {
        multipleSlots: boolean;
    };
    properties: import("./type").TdCellProps;
    data: {
        prefix: string;
        classPrefix: string;
        isLastChild: boolean;
    };
    observers: {
        leftIcon(v: any): void;
        rightIcon(v: any): void;
        arrow(v: any): void;
    };
    setIcon(name: any, value: any, defaultValue: any): void;
    onClick(e: any): void;
    jumpLink(urlKey?: string, link?: string): void;
}
