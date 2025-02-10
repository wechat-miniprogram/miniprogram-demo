export interface TdDividerProps {
    align?: {
        type: StringConstructor;
        value?: 'left' | 'right' | 'center';
    };
    content?: {
        type: StringConstructor;
        value?: string;
    };
    dashed?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    layout?: {
        type: StringConstructor;
        value?: 'horizontal' | 'vertical';
    };
}
