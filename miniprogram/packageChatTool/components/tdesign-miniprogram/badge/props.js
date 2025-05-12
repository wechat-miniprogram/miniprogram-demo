const props = {
    color: {
        type: String,
        value: '',
    },
    content: {
        type: String,
        value: '',
    },
    count: {
        type: null,
        value: 0,
    },
    dot: {
        type: Boolean,
        value: false,
    },
    externalClasses: {
        type: Array,
    },
    maxCount: {
        type: Number,
        value: 99,
    },
    offset: {
        type: Array,
    },
    shape: {
        type: String,
        value: 'circle',
    },
    showZero: {
        type: Boolean,
        value: false,
    },
    size: {
        type: String,
        value: 'medium',
    },
};
export default props;
