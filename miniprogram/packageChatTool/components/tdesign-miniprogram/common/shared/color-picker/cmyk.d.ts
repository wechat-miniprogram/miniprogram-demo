export declare const rgb2cmyk: (red: number, green: number, blue: number) => number[];
export declare const cmyk2rgb: (cyan: number, magenta: number, yellow: number, black: number) => {
    r: number;
    g: number;
    b: number;
};
export declare const cmykInputToColor: (input: string) => string;
