export interface TDate {
    date: Date;
    day: number;
    type: TDateType;
    className?: string;
    prefix?: string;
    suffix?: string;
}
export declare type TCalendarValue = number | Date;
export declare type TDateType = 'selected' | 'disabled' | 'start' | 'centre' | 'end' | '';
export declare type TCalendarType = 'single' | 'multiple' | 'range';
