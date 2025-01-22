import { SizeEnum } from '../common/common';
export interface TdLinkProps {
    content?: {
        type: StringConstructor;
        value?: string;
    };
    disabled?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    hover?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    navigatorProps?: {
        type: ObjectConstructor;
        value?: object;
    };
    prefixIcon?: {
        type: null;
        value?: string | object;
    };
    size?: {
        type: StringConstructor;
        value?: SizeEnum;
    };
    suffixIcon?: {
        type: null;
        value?: string | object;
    };
    theme?: {
        type: StringConstructor;
        value?: 'default' | 'primary' | 'danger' | 'warning' | 'success';
    };
    underline?: {
        type: BooleanConstructor;
        value?: boolean;
    };
}
