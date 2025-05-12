const props = {
    action: {
        type: String,
        value: '',
    },
    adjustPosition: {
        type: Boolean,
        value: true,
    },
    alwaysEmbed: {
        type: Boolean,
        value: false,
    },
    center: {
        type: Boolean,
        value: false,
    },
    clearable: {
        type: Boolean,
        value: true,
    },
    confirmHold: {
        type: Boolean,
        value: false,
    },
    confirmType: {
        type: String,
        value: 'search',
    },
    cursor: {
        type: Number,
        required: true,
    },
    cursorSpacing: {
        type: Number,
        value: 0,
    },
    disabled: {
        type: Boolean,
        value: false,
    },
    focus: {
        type: Boolean,
        value: false,
    },
    holdKeyboard: {
        type: Boolean,
        value: false,
    },
    leftIcon: {
        type: String,
        value: 'search',
    },
    maxcharacter: {
        type: Number,
    },
    maxlength: {
        type: Number,
        value: -1,
    },
    placeholder: {
        type: String,
        value: '',
    },
    placeholderClass: {
        type: String,
        value: 'input-placeholder',
    },
    placeholderStyle: {
        type: String,
        value: '',
        required: true,
    },
    resultList: {
        type: Array,
        value: [],
    },
    selectionEnd: {
        type: Number,
        value: -1,
    },
    selectionStart: {
        type: Number,
        value: -1,
    },
    shape: {
        type: String,
        value: 'square',
    },
    style: {
        type: String,
        value: '',
    },
    type: {
        type: String,
        value: 'text',
    },
    value: {
        type: String,
        value: '',
    },
};
export default props;
