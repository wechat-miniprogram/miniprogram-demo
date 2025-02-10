export interface TdSliderProps {
    disabled?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    label?: {
        type: null;
        value?: string | boolean;
    };
    marks?: {
        type: null;
        value?: Record<number, string> | Array<number>;
    };
    max?: {
        type: NumberConstructor;
        value?: number;
    };
    min?: {
        type: NumberConstructor;
        value?: number;
    };
    range?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    showExtremeValue?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    step?: {
        type: NumberConstructor;
        value?: number;
    };
    theme?: {
        type: StringConstructor;
        value?: 'default' | 'capsule';
    };
    value?: {
        type: null;
        value?: SliderValue;
    };
    defaultValue?: {
        type: null;
        value?: SliderValue;
    };
    vertical?: {
        type: BooleanConstructor;
        value?: boolean;
    };
}
export declare type SliderValue = number | Array<number>;
