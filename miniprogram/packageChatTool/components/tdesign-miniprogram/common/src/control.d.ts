declare type ControlInstance = {
    controlled: boolean;
    initValue: any;
    set(newVal: any, extObj?: Object, fn?: any): void;
    get(): any;
    change(newVal: any, customChangeData?: any, customUpdateFn?: any): void;
};
declare type ControlOption = {
    valueKey?: string;
    defaultValueKey?: string;
    changeEventName?: string;
    strict?: boolean;
};
declare function useControl(this: any, option?: ControlOption): ControlInstance;
export { ControlOption, ControlInstance, useControl };
