import { SuperComponent, RelationsOptions } from '../common/src/index';
export default class Col extends SuperComponent {
    externalClasses: string[];
    properties: import("./type").TdColProps;
    data: {
        prefix: string;
        classPrefix: string;
    };
    relations: RelationsOptions;
}
