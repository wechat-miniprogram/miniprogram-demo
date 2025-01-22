export interface TdSearchProps {
    action?: {
        type: StringConstructor;
        value?: string;
    };
    adjustPosition?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    alwaysEmbed?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    center?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    clearable?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    confirmHold?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    confirmType?: {
        type: StringConstructor;
        value?: 'send' | 'search' | 'next' | 'go' | 'done';
    };
    cursor: {
        type: NumberConstructor;
        value?: number;
        required?: boolean;
    };
    cursorSpacing?: {
        type: NumberConstructor;
        value?: number;
    };
    disabled?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    focus?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    holdKeyboard?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    leftIcon?: {
        type: StringConstructor;
        value?: string;
    };
    maxcharacter?: {
        type: NumberConstructor;
        value?: number;
    };
    maxlength?: {
        type: NumberConstructor;
        value?: number;
    };
    placeholder?: {
        type: StringConstructor;
        value?: string;
    };
    placeholderClass?: {
        type: StringConstructor;
        value?: string;
    };
    placeholderStyle: {
        type: StringConstructor;
        value?: string;
        required?: boolean;
    };
    resultList?: {
        type: ArrayConstructor;
        value?: Array<string>;
    };
    selectionEnd?: {
        type: NumberConstructor;
        value?: number;
    };
    selectionStart?: {
        type: NumberConstructor;
        value?: number;
    };
    shape?: {
        type: StringConstructor;
        value?: 'square' | 'round';
    };
    style?: {
        type: StringConstructor;
        value?: string;
    };
    type?: {
        type: StringConstructor;
        value?: 'text' | 'number' | 'idcard' | 'digit' | 'nickname';
    };
    value?: {
        type: StringConstructor;
        value?: string;
    };
}
