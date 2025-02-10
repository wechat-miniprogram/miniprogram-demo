import { SuperComponent, RelationsOptions } from '../common/src/index';
export default class Radio extends SuperComponent {
    externalClasses: string[];
    behaviors: string[];
    relations: RelationsOptions;
    options: {
        multipleSlots: boolean;
    };
    lifetimes: {
        attached(): void;
    };
    properties: {
        borderless: {
            type: BooleanConstructor;
            value: boolean;
        };
        tId: {
            type: StringConstructor;
        };
        allowUncheck?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        block?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        checked?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        defaultChecked?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        content?: {
            type: StringConstructor;
            value?: string;
        };
        contentDisabled?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        disabled?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        icon?: {
            type: null;
            value?: string[] | "circle" | "line" | "dot";
        };
        label?: {
            type: StringConstructor;
            value?: string;
        };
        maxContentRow?: {
            type: NumberConstructor;
            value?: number;
        };
        maxLabelRow?: {
            type: NumberConstructor;
            value?: number;
        };
        name?: {
            type: StringConstructor;
            value?: string;
        };
        placement?: {
            type: StringConstructor;
            value?: "left" | "right";
        };
        readonly?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        value?: {
            type: null;
            value?: import("./type").RadioValue;
        };
    };
    controlledProps: {
        key: string;
        event: string;
    }[];
    data: {
        prefix: string;
        classPrefix: string;
        customIcon: boolean;
        slotIcon: boolean;
        optionLinked: boolean;
        iconVal: any[];
        _placement: string;
        _disabled: boolean;
    };
    observers: {
        disabled(v: any): void;
    };
    methods: {
        handleTap(e: any): void;
        doChange(): void;
        init(): void;
        setDisabled(disabled: Boolean): void;
    };
}
