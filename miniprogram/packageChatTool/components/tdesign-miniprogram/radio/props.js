const props = {
    allowUncheck: {
        type: Boolean,
        value: false,
    },
    block: {
        type: Boolean,
        value: true,
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
        value: false,
    },
    disabled: {
        type: null,
        value: undefined,
    },
    icon: {
        type: null,
        value: 'circle',
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
        value: false,
    },
};
export default props;
