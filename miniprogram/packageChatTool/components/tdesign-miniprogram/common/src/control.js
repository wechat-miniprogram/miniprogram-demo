const defaultOption = {
    valueKey: 'value',
    defaultValueKey: 'defaultValue',
    changeEventName: 'change',
    strict: true,
};
function useControl(option = {}) {
    const { valueKey, defaultValueKey, changeEventName, strict } = Object.assign(Object.assign({}, defaultOption), option);
    const props = this.properties || {};
    const value = props[valueKey];
    const defaultValue = props[strict ? defaultValueKey : valueKey];
    let controlled = false;
    if (strict && typeof value !== 'undefined' && value !== null) {
        controlled = true;
    }
    const set = (newVal, extObj, fn) => {
        this.setData(Object.assign({ [`_${valueKey}`]: newVal }, extObj), fn);
    };
    return {
        controlled,
        initValue: controlled ? value : defaultValue,
        set,
        get: () => {
            return this.data[`_${valueKey}`];
        },
        change: (newVal, customChangeData, customUpdateFn) => {
            this.triggerEvent(changeEventName, typeof customChangeData !== 'undefined' ? customChangeData : newVal);
            if (controlled) {
                return;
            }
            if (typeof customUpdateFn === 'function') {
                customUpdateFn();
            }
            else {
                set(newVal);
            }
        },
    };
}
export { useControl };
