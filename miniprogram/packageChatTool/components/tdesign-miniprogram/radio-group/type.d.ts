import { KeysType } from '../common/common';
export interface TdRadioGroupProps<T = RadioValue> {
    allowUncheck?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    borderless?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    disabled?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    icon?: {
        type: null;
        value?: 'circle' | 'line' | 'dot' | Array<string>;
    };
    keys?: {
        type: ObjectConstructor;
        value?: KeysType;
    };
    name?: {
        type: StringConstructor;
        value?: string;
    };
    options?: {
        type: ArrayConstructor;
        value?: Array<RadioOption>;
    };
    placement?: {
        type: StringConstructor;
        value?: 'left' | 'right';
    };
    value?: {
        type: null;
        value?: T;
    };
    defaultValue?: {
        type: null;
        value?: T;
    };
}
export declare type RadioOption = string | number | RadioOptionObj;
export interface RadioOptionObj {
    label?: string;
    value?: string | number;
    readonly?: boolean;
    disabled?: boolean;
    allowUncheck?: boolean;
}
export declare type RadioValue = string | number | boolean;
