export interface TdNavbarProps {
    animation?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    delta?: {
        type: NumberConstructor;
        value?: number;
    };
    fixed?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    leftArrow?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    title?: {
        type: StringConstructor;
        value?: string;
    };
    titleMaxLength?: {
        type: NumberConstructor;
        value?: number;
    };
    visible?: {
        type: BooleanConstructor;
        value?: boolean;
    };
}
