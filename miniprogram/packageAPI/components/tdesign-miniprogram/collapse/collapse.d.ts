import { SuperComponent, RelationsOptions } from '../common/src/index';
import type { CollapseValue, TdCollapseProps } from './type';
export interface CollapseProps extends TdCollapseProps {
}
export default class Collapse extends SuperComponent {
    externalClasses: string[];
    relations: RelationsOptions;
    controlledProps: {
        key: string;
        event: string;
    }[];
    properties: TdCollapseProps;
    data: {
        prefix: string;
        classPrefix: string;
    };
    observers: {
        'value, expandMutex '(): void;
    };
    methods: {
        updateExpanded(): void;
        switch(panelValue: CollapseValue): void;
    };
}
