export declare type CompareDate = Date | number | {
    year: number;
    month: number;
    date: number;
};
export declare const getDateRect: (date: Date | number) => {
    year: number;
    month: number;
    date: number;
    day: number;
    time: number;
};
export declare const isSameDate: (date1: CompareDate, date2: CompareDate) => boolean;
export declare const getMonthDateRect: (date: Date | number) => {
    year: number;
    month: number;
    weekdayOfFirstDay: number;
    lastDate: number;
};
export declare const isValidDate: (val: any) => boolean;
export declare const getDate: (...args: any[]) => any;
