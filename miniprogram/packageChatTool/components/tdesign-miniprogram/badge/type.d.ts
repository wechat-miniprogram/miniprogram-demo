export interface TdBadgeProps {
    color?: {
        type: StringConstructor;
        value?: string;
    };
    content?: {
        type: StringConstructor;
        value?: string;
    };
    count?: {
        type: null;
        value?: string | number;
    };
    dot?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    externalClasses?: {
        type: ArrayConstructor;
        value?: ['t-class', 't-class-content', 't-class-count'];
    };
    maxCount?: {
        type: NumberConstructor;
        value?: number;
    };
    offset?: {
        type: ArrayConstructor;
        value?: Array<string | number>;
    };
    shape?: {
        type: StringConstructor;
        value?: 'circle' | 'square' | 'bubble' | 'ribbon';
    };
    showZero?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    size?: {
        type: StringConstructor;
        value?: 'medium' | 'large';
    };
}
