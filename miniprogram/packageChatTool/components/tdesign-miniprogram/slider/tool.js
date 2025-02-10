export const trimSingleValue = (value, min, max) => {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
};
export const trimValue = (value, props) => {
    const { min, max, range } = props;
    if (range && Array.isArray(value)) {
        value[0] = trimSingleValue(value[0], min, max);
        value[1] = trimSingleValue(value[1], min, max);
        return value[0] <= value[1] ? value : [value[1], value[0]];
    }
    if (range) {
        return [min, max];
    }
    if (!range) {
        return trimSingleValue(value, min, max);
    }
};
