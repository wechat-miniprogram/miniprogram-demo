export interface TdIndexesProps {
    indexList?: {
        type: null;
        value?: string[] | number[];
    };
    sticky?: {
        type: BooleanConstructor;
        value?: Boolean;
    };
    stickyOffset?: {
        type: NumberConstructor;
        value?: number;
    };
}
