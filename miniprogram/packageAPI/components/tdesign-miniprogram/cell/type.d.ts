export interface TdCellProps {
    align?: {
        type: StringConstructor;
        value?: 'top' | 'middle' | 'bottom';
    };
    arrow?: {
        type: null;
        value?: boolean | object;
    };
    bordered?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    description?: {
        type: StringConstructor;
        value?: string;
    };
    hover?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    image?: {
        type: StringConstructor;
        value?: string;
    };
    jumpType?: {
        type: StringConstructor;
        value?: 'switchTab' | 'reLaunch' | 'redirectTo' | 'navigateTo';
    };
    leftIcon?: {
        type: null;
        value?: string | object;
    };
    note?: {
        type: StringConstructor;
        value?: string;
    };
    required?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    rightIcon?: {
        type: null;
        value?: string | object;
    };
    title?: {
        type: StringConstructor;
        value?: string;
    };
    url?: {
        type: StringConstructor;
        value?: string;
    };
}
