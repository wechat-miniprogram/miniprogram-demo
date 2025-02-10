export interface TdCheckboxProps {
    block?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    borderless?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    checkAll?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    checked?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    defaultChecked?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    content?: {
        type: StringConstructor;
        value?: string;
    };
    contentDisabled?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    disabled?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    icon?: {
        type: null;
        value?: 'circle' | 'line' | 'rectangle' | string[];
    };
    indeterminate?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    label?: {
        type: StringConstructor;
        value?: string;
    };
    maxContentRow?: {
        type: NumberConstructor;
        value?: number;
    };
    maxLabelRow?: {
        type: NumberConstructor;
        value?: number;
    };
    name?: {
        type: StringConstructor;
        value?: string;
    };
    placement?: {
        type: StringConstructor;
        value?: 'left' | 'right';
    };
    readonly?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    value?: {
        type: null;
        value?: string | number | boolean;
    };
}
