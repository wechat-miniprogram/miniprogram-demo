var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { wxComponent, SuperComponent } from '../common/src/index';
import config from '../common/config';
import props from './props';
import { classNames, isNumber, calcIcon } from '../common/utils';
const { prefix } = config;
const name = `${prefix}-tag`;
let Tag = class Tag extends SuperComponent {
    constructor() {
        super(...arguments);
        this.data = {
            prefix,
            classPrefix: name,
            className: '',
            tagStyle: '',
        };
        this.properties = props;
        this.externalClasses = [`${prefix}-class`];
        this.options = {
            multipleSlots: true,
        };
        this.lifetimes = {
            attached() {
                this.setClass();
                this.setTagStyle();
            },
        };
        this.observers = {
            'size, shape, theme, variant, closable, disabled'() {
                this.setClass();
            },
            maxWidth() {
                this.setTagStyle();
            },
            icon(v) {
                this.setData({
                    _icon: calcIcon(v),
                });
            },
            closable(v) {
                this.setData({
                    _closable: calcIcon(v, 'close'),
                });
            },
        };
        this.methods = {
            setClass() {
                const { prefix, classPrefix } = this.data;
                const { size, shape, theme, variant, closable, disabled } = this.properties;
                const tagClass = [
                    classPrefix,
                    `${classPrefix}--${theme || 'default'}`,
                    `${classPrefix}--${variant}`,
                    closable ? `${classPrefix}--closable ${prefix}-is-closable` : '',
                    disabled ? `${classPrefix}--disabled ${prefix}-is-disabled` : '',
                    `${classPrefix}--${size}`,
                    `${classPrefix}--${shape}`,
                ];
                const className = classNames(tagClass);
                this.setData({
                    className,
                });
            },
            setTagStyle() {
                const { maxWidth } = this.properties;
                if (!maxWidth) {
                    return '';
                }
                const width = isNumber(maxWidth) ? `${maxWidth}px` : maxWidth;
                this.setData({ tagStyle: `max-width:${width};` });
            },
            handleClick(e) {
                if (this.data.disabled)
                    return;
                this.triggerEvent('click', e);
            },
            handleClose(e) {
                if (this.data.disabled)
                    return;
                this.triggerEvent('close', e);
            },
        };
    }
};
Tag = __decorate([
    wxComponent()
], Tag);
export default Tag;
