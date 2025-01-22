export interface GradientColorPoint {
    id?: string;
    color?: string;
    left?: number;
}
export interface GradientColors {
    points: GradientColorPoint[];
    degree: number;
}
export declare const isGradientColor: (input: string) => null | RegExpExecArray;
export declare const parseGradientString: (input: string) => GradientColors | boolean;
export default parseGradientString;
