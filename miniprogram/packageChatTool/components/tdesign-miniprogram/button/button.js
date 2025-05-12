var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import props from './props';
import { canIUseFormFieldButton } from '../common/version';
import { calcIcon } from '../common/utils';
const { prefix } = config;
const name = `${prefix}-button`;
let Button = class Button extends SuperComponent {
    constructor() {
        super(...arguments);
        this.externalClasses = [`${prefix}-class`, `${prefix}-class-icon`, `${prefix}-class-loading`];
        this.behaviors = canIUseFormFieldButton() ? ['wx://form-field-button'] : [];
        this.properties = props;
        this.options = {
            multipleSlots: true,
        };
        this.data = {
            prefix,
            className: '',
            classPrefix: name,
        };
        this.observers = {
            'theme, size, plain, block, shape, disabled, loading, variant'() {
                this.setClass();
            },
            icon(icon) {
                this.setData({
                    _icon: calcIcon(icon, ''),
                });
            },
        };
        this.lifetimes = {
            attached() {
                this.setClass();
            },
        };
        this.methods = {
            setClass() {
                const classList = [
                    name,
                    `${prefix}-class`,
                    `${name}--${this.data.variant || 'base'}`,
                    `${name}--${this.data.theme || 'default'}`,
                    `${name}--${this.data.shape || 'rectangle'}`,
                    `${name}--size-${this.data.size || 'medium'}`,
                ];
                if (this.data.block) {
                    classList.push(`${name}--block`);
                }
                if (this.data.disabled) {
                    classList.push(`${name}--disabled`);
                }
                if (this.data.ghost) {
                    classList.push(`${name}--ghost`);
                }
                this.setData({
                    className: classList.join(' '),
                });
            },
            getuserinfo(e) {
                this.triggerEvent('getuserinfo', e.detail);
            },
            contact(e) {
                this.triggerEvent('contact', e.detail);
            },
            getphonenumber(e) {
                this.triggerEvent('getphonenumber', e.detail);
            },
            error(e) {
                this.triggerEvent('error', e.detail);
            },
            opensetting(e) {
                this.triggerEvent('opensetting', e.detail);
            },
            launchapp(e) {
                this.triggerEvent('launchapp', e.detail);
            },
            chooseavatar(e) {
                this.triggerEvent('chooseavatar', e.detail);
            },
            agreeprivacyauthorization(e) {
                this.triggerEvent('agreeprivacyauthorization', e.detail);
            },
            handleTap(e) {
                if (this.data.disabled || this.data.loading)
                    return;
                this.triggerEvent('tap', e);
            },
        };
    }
};
Button = __decorate([
    wxComponent()
], Button);
export default Button;
