export interface TdSwitchProps<T = SwitchValue> {
    customValue?: {
        type: ArrayConstructor;
        value?: Array<SwitchValue>;
    };
    disabled?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    icon?: {
        type: ArrayConstructor;
        value?: string[];
    };
    label?: {
        type: ArrayConstructor;
        value?: string[];
    };
    loading?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    size?: {
        type: StringConstructor;
        value?: 'small' | 'medium' | 'large';
    };
    value?: {
        type: null;
        value?: SwitchValue;
    };
    defaultValue?: {
        type: null;
        value?: SwitchValue;
    };
}
export declare type SwitchValue = string | number | boolean;
