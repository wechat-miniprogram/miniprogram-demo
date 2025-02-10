const props = {
    delay: {
        type: Number,
        value: 0,
    },
    duration: {
        type: Number,
        value: 800,
    },
    fullscreen: {
        type: Boolean,
        value: false,
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
        value: '20px',
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
