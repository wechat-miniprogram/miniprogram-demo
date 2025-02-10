export interface TdEmptyProps {
    description?: {
        type: StringConstructor;
        value?: string;
    };
    externalClasses?: {
        type: ArrayConstructor;
        value?: ['t-class', 't-class-description', 't-class-image', 't-class-actions'];
    };
    icon?: {
        type: null;
        value?: string | object;
    };
    image?: {
        type: StringConstructor;
        value?: string;
    };
}
