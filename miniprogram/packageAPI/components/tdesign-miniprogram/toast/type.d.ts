import { OverlayProps } from '../overlay/index';
export interface TdToastProps {
    direction?: {
        type: StringConstructor;
        value?: 'row' | 'column';
    };
    duration?: {
        type: NumberConstructor;
        value?: number;
    };
    icon?: {
        type: null;
        value?: string | object;
    };
    message?: {
        type: StringConstructor;
        value?: string;
    };
    overlayProps?: {
        type: ObjectConstructor;
        value?: OverlayProps;
    };
    placement?: {
        type: StringConstructor;
        value?: 'top' | 'middle' | 'bottom';
    };
    preventScrollThrough?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    showOverlay?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    theme?: {
        type: StringConstructor;
        value?: 'loading' | 'success' | 'error';
    };
    usingCustomNavbar?: {
        type: BooleanConstructor;
        value?: boolean;
    };
}
