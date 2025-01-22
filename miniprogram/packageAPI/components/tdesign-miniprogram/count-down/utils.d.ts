export interface TimeData {
    DD: number;
    HH: number;
    mm: number;
    ss: number;
    SSS: number;
}
export declare const TimeDataUnit: {
    DD: string;
    HH: string;
    mm: string;
    ss: string;
    SSS: string;
};
export declare const parseTimeData: (time: number) => TimeData;
export declare const isSameSecond: (time1: number, time2: number) => boolean;
export declare type TTimeList = {
    digit: string;
    unit: string;
    match: string;
}[];
export declare const parseFormat: (time: number, format: string) => {
    timeText: string;
    timeList: TTimeList;
};
