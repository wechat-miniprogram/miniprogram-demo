export interface TdIconProps {
    color?: {
        type: StringConstructor;
        value?: string;
    };
    name: {
        type: StringConstructor;
        value?: string;
        required?: boolean;
    };
    prefix?: {
        type: StringConstructor;
        value?: string;
    };
    size?: {
        type: null;
        value?: string | number;
    };
}
