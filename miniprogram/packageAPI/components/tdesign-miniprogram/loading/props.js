const props = {
    delay: {
        type: Number,
        value: 0,
    },
    duration: {
        type: Number,
        value: 800,
    },
    externalClasses: {
        type: Array,
    },
    indicator: {
        type: Boolean,
        value: true,
    },
    inheritColor: {
        type: Boolean,
        value: false,
    },
    layout: {
        type: String,
        value: 'horizontal',
    },
    loading: {
        type: Boolean,
        value: true,
    },
    pause: {
        type: Boolean,
        value: false,
    },
    progress: {
        type: Number,
    },
    reverse: {
        type: Boolean,
    },
    size: {
        type: String,
        value: '40rpx',
    },
    text: {
        type: String,
    },
    theme: {
        type: String,
        value: 'circular',
    },
};
export default props;
