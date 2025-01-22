import { SuperComponent, RelationsOptions } from '../common/src/index';
export default class CellGroup extends SuperComponent {
    externalClasses: string[];
    relations: RelationsOptions;
    properties: import("./type").TdCellGroupProps;
    data: {
        prefix: string;
        classPrefix: string;
    };
    methods: {
        updateLastChid(): void;
    };
}
