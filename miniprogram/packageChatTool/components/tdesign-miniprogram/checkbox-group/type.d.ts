import { KeysType } from '../common/common';
export interface TdCheckboxGroupProps<T = CheckboxGroupValue> {
    borderless?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    disabled?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    keys?: {
        type: ObjectConstructor;
        value?: KeysType;
    };
    max?: {
        type: NumberConstructor;
        value?: number;
    };
    name?: {
        type: StringConstructor;
        value?: string;
    };
    options?: {
        type: ArrayConstructor;
        value?: Array<CheckboxOption>;
    };
    value?: {
        type: ArrayConstructor;
        value?: T;
    };
    defaultValue?: {
        type: ArrayConstructor;
        value?: T;
    };
}
export declare type CheckboxOption = string | number | CheckboxOptionObj;
export interface CheckboxOptionObj {
    label?: string;
    value?: string | number;
    disabled?: boolean;
    checkAll?: true;
}
export declare type CheckboxGroupValue = Array<string | number | boolean>;
