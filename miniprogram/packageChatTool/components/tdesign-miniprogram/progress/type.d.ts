export interface TdProgressProps {
    color?: {
        type: null;
        value?: string | Array<string> | Record<string, string>;
    };
    label?: {
        type: null;
        value?: string | boolean;
    };
    percentage?: {
        type: NumberConstructor;
        value?: number;
    };
    status?: {
        type: StringConstructor;
        value?: ProgressStatus;
    };
    strokeWidth?: {
        type: null;
        value?: string | number;
    };
    style?: {
        type: StringConstructor;
        value?: string;
    };
    theme?: {
        type: StringConstructor;
        value?: ProgressTheme;
    };
    trackColor?: {
        type: StringConstructor;
        value?: string;
    };
}
export declare type ProgressStatus = 'success' | 'error' | 'warning' | 'active';
export declare type ProgressTheme = 'line' | 'plump' | 'circle';
