const props = {
    block: {
        type: Boolean,
        value: true,
    },
    borderless: {
        type: Boolean,
        value: false,
    },
    checkAll: {
        type: Boolean,
        value: false,
    },
    checked: {
        type: Boolean,
        value: null,
    },
    defaultChecked: {
        type: Boolean,
        value: false,
    },
    content: {
        type: String,
    },
    contentDisabled: {
        type: Boolean,
    },
    disabled: {
        type: null,
        value: undefined,
    },
    icon: {
        type: null,
        value: 'circle',
    },
    indeterminate: {
        type: Boolean,
        value: false,
    },
    label: {
        type: String,
    },
    maxContentRow: {
        type: Number,
        value: 5,
    },
    maxLabelRow: {
        type: Number,
        value: 3,
    },
    name: {
        type: String,
        value: '',
    },
    placement: {
        type: String,
        value: 'left',
    },
    readonly: {
        type: Boolean,
        value: false,
    },
    value: {
        type: null,
    },
};
export default props;
