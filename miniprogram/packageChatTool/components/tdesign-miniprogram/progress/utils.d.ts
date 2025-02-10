export declare type Gradients = {
    [percent: string]: string;
};
export declare type FromTo = {
    from: string;
    to: string;
};
export declare type LinearGradient = {
    direction?: string;
} & (Gradients | FromTo);
export declare function getBackgroundColor(color: string | string[] | LinearGradient): string;
