export const getDateRect = (date) => {
    const _date = new Date(date);
    return {
        year: _date.getFullYear(),
        month: _date.getMonth(),
        date: _date.getDate(),
        day: _date.getDay(),
        time: _date.getTime(),
    };
};
export const isSameDate = (date1, date2) => {
    if (date1 instanceof Date || typeof date1 === 'number')
        date1 = getDateRect(date1);
    if (date2 instanceof Date || typeof date2 === 'number')
        date2 = getDateRect(date2);
    const keys = ['year', 'month', 'date'];
    return keys.every((key) => date1[key] === date2[key]);
};
export const getMonthDateRect = (date) => {
    const { year, month } = getDateRect(date);
    const firstDay = new Date(year, month, 1);
    const weekdayOfFirstDay = firstDay.getDay();
    const lastDate = new Date(+new Date(year, month + 1, 1) - 24 * 3600 * 1000).getDate();
    return {
        year,
        month,
        weekdayOfFirstDay,
        lastDate,
    };
};
export const isValidDate = (val) => typeof val === 'number' || val instanceof Date;
export const getDate = (...args) => {
    const now = new Date();
    if (args.length === 0)
        return now;
    if (args.length === 1 && args[0] <= 1000) {
        const { year, month, date } = getDateRect(now);
        return new Date(year, month + args[0], date);
    }
    return Date.apply(null, args);
};
