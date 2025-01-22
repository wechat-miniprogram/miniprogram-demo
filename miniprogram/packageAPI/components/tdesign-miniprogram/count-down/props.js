const props = {
    autoStart: {
        type: Boolean,
        value: true,
    },
    content: {
        type: String,
        value: 'default',
    },
    format: {
        type: String,
        value: 'HH:mm:ss',
    },
    millisecond: {
        type: Boolean,
        value: false,
    },
    size: {
        type: String,
        value: 'medium',
    },
    splitWithUnit: {
        type: Boolean,
        value: false,
    },
    theme: {
        type: String,
        value: 'default',
    },
    time: {
        type: Number,
        value: 0,
        required: true,
    },
};
export default props;
