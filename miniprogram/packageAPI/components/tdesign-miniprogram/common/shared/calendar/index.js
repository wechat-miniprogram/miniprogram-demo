import { getDateRect, isSameDate, getMonthDateRect, isValidDate, getDate } from '../date';
export default class TCalendar {
    constructor(options = {}) {
        this.type = 'single';
        Object.assign(this, options);
        if (!this.minDate)
            this.minDate = getDate();
        if (!this.maxDate)
            this.maxDate = getDate(6);
    }
    getTrimValue() {
        const { value, type } = this;
        const format = (val) => {
            if (val instanceof Date)
                return val;
            if (typeof val === 'number')
                return new Date(val);
            return new Date();
        };
        if (type === 'single' && isValidDate(value))
            return format(value);
        if (type === 'multiple' || type === 'range') {
            if (Array.isArray(value)) {
                const isValid = value.every((item) => isValidDate(item));
                return isValid ? value.map((item) => format(item)) : [];
            }
            return [];
        }
    }
    getDays() {
        const raw = '日一二三四五六';
        const ans = [];
        let i = this.firstDayOfWeek % 7;
        while (ans.length < 7) {
            ans.push(raw[i]);
            i = (i + 1) % 7;
        }
        return ans;
    }
    getMonths() {
        const ans = [];
        const selectedDate = this.getTrimValue();
        const { minDate, maxDate, type, format } = this;
        let { year: minYear, month: minMonth, time: minTime } = getDateRect(minDate);
        const { year: maxYear, month: maxMonth, time: maxTime } = getDateRect(maxDate);
        const calcType = (year, month, date) => {
            const curDate = new Date(year, month, date, 23, 59, 59);
            if (type === 'single' && selectedDate) {
                if (isSameDate({ year, month, date }, selectedDate))
                    return 'selected';
            }
            if (type === 'multiple' && selectedDate) {
                const hit = selectedDate.some((item) => isSameDate({ year, month, date }, item));
                if (hit) {
                    return 'selected';
                }
            }
            if (type === 'range' && selectedDate) {
                if (Array.isArray(selectedDate)) {
                    const [startDate, endDate] = selectedDate;
                    if (startDate && isSameDate({ year, month, date }, startDate))
                        return 'start';
                    if (endDate && isSameDate({ year, month, date }, endDate))
                        return 'end';
                    if (startDate && endDate && curDate.getTime() > startDate.getTime() && curDate.getTime() < endDate.getTime())
                        return 'centre';
                }
            }
            const minCurDate = new Date(year, month, date, 0, 0, 0);
            if (curDate.getTime() < minTime || minCurDate.getTime() > maxTime) {
                return 'disabled';
            }
            return '';
        };
        while (minYear < maxYear || (minYear === maxYear && minMonth <= maxMonth)) {
            const target = getMonthDateRect(new Date(minYear, minMonth, 1));
            const months = [];
            for (let i = 1; i <= 31; i++) {
                if (i > target.lastDate)
                    break;
                const dateObj = {
                    date: new Date(minYear, minMonth, i),
                    day: i,
                    type: calcType(minYear, minMonth, i),
                };
                months.push(format ? format(dateObj) : dateObj);
            }
            ans.push({
                year: minYear,
                month: minMonth,
                months,
                weekdayOfFirstDay: target.weekdayOfFirstDay,
            });
            const curDate = getDateRect(new Date(minYear, minMonth + 1, 1));
            minYear = curDate.year;
            minMonth = curDate.month;
        }
        return ans;
    }
    select({ cellType, year, month, date }) {
        const { type } = this;
        const selectedDate = this.getTrimValue();
        if (cellType === 'disabled')
            return;
        const selected = new Date(year, month, date);
        this.value = selected;
        if (type === 'range' && Array.isArray(selectedDate)) {
            if (selectedDate.length === 1 && selected > selectedDate[0]) {
                this.value = [selectedDate[0], selected];
            }
            else {
                this.value = [selected];
            }
        }
        else if (type === 'multiple' && Array.isArray(selectedDate)) {
            const newVal = [...selectedDate];
            const index = selectedDate.findIndex((item) => isSameDate(item, selected));
            if (index > -1) {
                newVal.splice(index, 1);
            }
            else {
                newVal.push(selected);
            }
            this.value = newVal;
        }
        return this.value;
    }
}
