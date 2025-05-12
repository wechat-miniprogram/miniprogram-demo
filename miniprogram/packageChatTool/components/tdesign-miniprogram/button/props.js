const props = {
    appParameter: {
        type: String,
        value: '',
    },
    block: {
        type: Boolean,
        value: false,
    },
    content: {
        type: String,
    },
    customDataset: {
        type: null,
    },
    disabled: {
        type: null,
        value: undefined,
    },
    ghost: {
        type: Boolean,
        value: false,
    },
    hoverClass: {
        type: String,
        value: '',
    },
    hoverStartTime: {
        type: Number,
        value: 20,
    },
    hoverStayTime: {
        type: Number,
        value: 70,
    },
    hoverStopPropagation: {
        type: Boolean,
        value: false,
    },
    icon: {
        type: null,
    },
    lang: {
        type: String,
    },
    loading: {
        type: Boolean,
        value: false,
    },
    loadingProps: {
        type: Object,
    },
    openType: {
        type: String,
    },
    phoneNumberNoQuotaToast: {
        type: Boolean,
        value: true,
    },
    sendMessageImg: {
        type: String,
        value: '截图',
    },
    sendMessagePath: {
        type: String,
        value: '当前分享路径',
    },
    sendMessageTitle: {
        type: String,
        value: '当前标题',
    },
    sessionFrom: {
        type: String,
        value: '',
    },
    shape: {
        type: String,
        value: 'rectangle',
    },
    showMessageCard: {
        type: Boolean,
        value: false,
    },
    size: {
        type: String,
        value: 'medium',
    },
    style: {
        type: String,
        value: '',
    },
    tId: {
        type: String,
        value: '',
    },
    theme: {
        type: String,
        value: 'default',
    },
    type: {
        type: String,
    },
    variant: {
        type: String,
        value: 'base',
    },
};
export default props;
