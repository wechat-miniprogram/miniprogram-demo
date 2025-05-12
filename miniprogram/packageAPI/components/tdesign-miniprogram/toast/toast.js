var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import props from './props';
import transition from '../mixins/transition';
import { calcIcon } from '../common/utils';
import useCustomNavbar from '../mixins/using-custom-navbar';
const { prefix } = config;
const name = `${prefix}-toast`;
let Toast = class Toast extends SuperComponent {
    constructor() {
        super(...arguments);
        this.externalClasses = [`${prefix}-class`];
        this.options = {
            multipleSlots: true,
        };
        this.behaviors = [transition(), useCustomNavbar];
        this.hideTimer = null;
        this.data = {
            prefix,
            classPrefix: name,
            typeMapIcon: '',
        };
        this.properties = props;
        this.lifetimes = {
            detached() {
                this.destroyed();
            },
        };
        this.pageLifetimes = {
            hide() {
                this.hide();
            },
        };
        this.methods = {
            show(options) {
                if (this.hideTimer)
                    clearTimeout(this.hideTimer);
                const iconMap = {
                    loading: 'loading',
                    success: 'check-circle',
                    warning: 'error-circle',
                    error: 'close-circle',
                };
                const typeMapIcon = iconMap[options === null || options === void 0 ? void 0 : options.theme];
                const defaultOptions = {
                    direction: props.direction.value,
                    duration: props.duration.value,
                    icon: props.icon.value,
                    message: props.message.value,
                    placement: props.placement.value,
                    preventScrollThrough: props.preventScrollThrough.value,
                    theme: props.theme.value,
                };
                const data = Object.assign(Object.assign(Object.assign({}, defaultOptions), options), { visible: true, isLoading: (options === null || options === void 0 ? void 0 : options.theme) === 'loading', _icon: calcIcon(typeMapIcon !== null && typeMapIcon !== void 0 ? typeMapIcon : options.icon) });
                const { duration } = data;
                this.setData(data);
                if (duration > 0) {
                    this.hideTimer = setTimeout(() => {
                        this.hide();
                    }, duration);
                }
            },
            hide() {
                var _a, _b;
                if (!this.data.visible)
                    return;
                this.setData({ visible: false });
                (_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.close) === null || _b === void 0 ? void 0 : _b.call(_a);
                this.triggerEvent('close');
            },
            destroyed() {
                if (this.hideTimer) {
                    clearTimeout(this.hideTimer);
                    this.hideTimer = null;
                }
                this.triggerEvent('destory');
            },
            loop() { },
        };
    }
};
Toast = __decorate([
    wxComponent()
], Toast);
export default Toast;
