export interface TdCollapseProps {
    defaultExpandAll?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    disabled?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    expandIcon?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    expandMutex?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    theme?: {
        type: StringConstructor;
        value?: 'default' | 'card';
    };
    value?: {
        type: ArrayConstructor;
        value?: CollapseValue;
    };
    defaultValue?: {
        type: ArrayConstructor;
        value?: CollapseValue;
    };
}
export declare type CollapseValue = Array<string | number>;
