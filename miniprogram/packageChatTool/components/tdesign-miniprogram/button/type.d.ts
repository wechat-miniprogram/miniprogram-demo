import { LoadingProps } from '../loading/index';
export interface TdButtonProps {
    appParameter?: {
        type: StringConstructor;
        value?: string;
    };
    block?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    content?: {
        type: StringConstructor;
        value?: string;
    };
    customDataset?: {
        type: null;
        value?: null;
    };
    disabled?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    ghost?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    hoverClass?: {
        type: StringConstructor;
        value?: string;
    };
    hoverStartTime?: {
        type: NumberConstructor;
        value?: number;
    };
    hoverStayTime?: {
        type: NumberConstructor;
        value?: number;
    };
    hoverStopPropagation?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    icon?: {
        type: null;
        value?: string | object;
    };
    lang?: {
        type: StringConstructor;
        value?: 'en' | 'zh_CN' | 'zh_TW';
    };
    loading?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    loadingProps?: {
        type: ObjectConstructor;
        value?: LoadingProps;
    };
    openType?: {
        type: StringConstructor;
        value?: 'contact' | 'share' | 'getPhoneNumber' | 'getUserInfo' | 'launchApp' | 'openSetting' | 'feedback' | 'chooseAvatar' | 'agreePrivacyAuthorization';
    };
    phoneNumberNoQuotaToast?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    sendMessageImg?: {
        type: StringConstructor;
        value?: string;
    };
    sendMessagePath?: {
        type: StringConstructor;
        value?: string;
    };
    sendMessageTitle?: {
        type: StringConstructor;
        value?: string;
    };
    sessionFrom?: {
        type: StringConstructor;
        value?: string;
    };
    shape?: {
        type: StringConstructor;
        value?: 'rectangle' | 'square' | 'round' | 'circle';
    };
    showMessageCard?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    size?: {
        type: StringConstructor;
        value?: 'extra-small' | 'small' | 'medium' | 'large';
    };
    style?: {
        type: StringConstructor;
        value?: string;
    };
    tId?: {
        type: StringConstructor;
        value?: string;
    };
    theme?: {
        type: StringConstructor;
        value?: 'default' | 'primary' | 'danger' | 'light';
    };
    type?: {
        type: StringConstructor;
        value?: 'submit' | 'reset';
    };
    variant?: {
        type: StringConstructor;
        value?: 'base' | 'outline' | 'dashed' | 'text';
    };
}
