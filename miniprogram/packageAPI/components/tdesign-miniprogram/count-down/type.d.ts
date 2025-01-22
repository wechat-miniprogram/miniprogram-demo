export interface TdCountDownProps {
    autoStart?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    content?: {
        type: StringConstructor;
        value?: string;
    };
    format?: {
        type: StringConstructor;
        value?: string;
    };
    millisecond?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    size?: {
        type: StringConstructor;
        value?: 'small' | 'medium' | 'large';
    };
    splitWithUnit?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    theme?: {
        type: StringConstructor;
        value?: 'default' | 'round' | 'square';
    };
    time: {
        type: NumberConstructor;
        value?: number;
        required?: boolean;
    };
}
