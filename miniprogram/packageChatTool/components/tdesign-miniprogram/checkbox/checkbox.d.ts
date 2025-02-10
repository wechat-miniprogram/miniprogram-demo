import { SuperComponent, ComponentsOptionsType, RelationsOptions } from '../common/src/index';
export default class CheckBox extends SuperComponent {
    externalClasses: string[];
    behaviors: string[];
    relations: RelationsOptions;
    options: ComponentsOptionsType;
    properties: {
        theme: {
            type: StringConstructor;
            value: string;
        };
        tId: {
            type: StringConstructor;
        };
        block?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        borderless?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        checkAll?: {
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
            value?: string[] | "rectangle" | "circle" | "line";
        };
        indeterminate?: {
            type: BooleanConstructor;
            value?: boolean;
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
            value?: string | number | boolean;
        };
    };
    data: {
        prefix: string;
        classPrefix: string;
        _disabled: boolean;
    };
    observers: {
        disabled(v: any): void;
    };
    controlledProps: {
        key: string;
        event: string;
    }[];
    methods: {
        handleTap(e: WechatMiniprogram.TouchEvent): void;
        setDisabled(disabled: Boolean): void;
    };
}
