import { SuperComponent, RelationsOptions } from '../common/src/index';
export default class Row extends SuperComponent {
    externalClasses: any[];
    properties: import("./type").TdRowProps;
    data: {
        prefix: string;
    };
    relations: RelationsOptions;
    observers: {
        gutter(): void;
    };
    methods: {
        setGutter(): void;
    };
}
