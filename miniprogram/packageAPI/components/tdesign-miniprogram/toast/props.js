const props = {
    direction: {
        type: String,
        value: 'row',
    },
    duration: {
        type: Number,
        value: 2000,
    },
    icon: {
        type: null,
    },
    message: {
        type: String,
    },
    overlayProps: {
        type: Object,
    },
    placement: {
        type: String,
        value: 'middle',
    },
    preventScrollThrough: {
        type: Boolean,
        value: false,
    },
    showOverlay: {
        type: Boolean,
        value: false,
    },
    theme: {
        type: String,
    },
    usingCustomNavbar: {
        type: Boolean,
        value: false,
    },
};
export default props;
