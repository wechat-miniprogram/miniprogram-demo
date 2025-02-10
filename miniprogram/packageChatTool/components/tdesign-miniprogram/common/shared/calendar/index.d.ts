import type { TDate, TCalendarType, TCalendarValue } from './type';
export default class TCalendar {
    firstDayOfWeek: number;
    value: TCalendarValue | TCalendarValue[];
    type: TCalendarType;
    minDate: Date;
    maxDate: Date;
    format: (day: TDate) => TDate;
    constructor(options?: {});
    getTrimValue(): Date | Date[];
    getDays(weekdays: string[]): any[];
    getMonths(): any[];
    select({ cellType, year, month, date }: {
        cellType: any;
        year: any;
        month: any;
        date: any;
    }): Date | TCalendarValue[];
}
