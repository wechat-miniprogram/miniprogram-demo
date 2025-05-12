var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import Props from './props';
const { prefix } = config;
const name = `${prefix}-checkbox`;
let CheckBox = class CheckBox extends SuperComponent {
    constructor() {
        super(...arguments);
        this.externalClasses = [
            `${prefix}-class`,
            `${prefix}-class-label`,
            `${prefix}-class-icon`,
            `${prefix}-class-content`,
            `${prefix}-class-border`,
        ];
        this.behaviors = ['wx://form-field'];
        this.relations = {
            '../checkbox-group/checkbox-group': {
                type: 'ancestor',
                linked(parent) {
                    const { value, disabled, borderless } = parent.data;
                    const valueSet = new Set(value);
                    const checkedFromParent = valueSet.has(this.data.value);
                    const data = {
                        _disabled: this.data.disabled == null ? disabled : this.data.disabled,
                    };
                    if (borderless) {
                        data.borderless = true;
                    }
                    data.checked = this.data.checked || checkedFromParent;
                    if (this.data.checked) {
                        parent.updateValue(this.data);
                    }
                    if (this.data.checkAll) {
                        data.checked = valueSet.size > 0;
                    }
                    this.setData(data);
                },
            },
        };
        this.options = {
            multipleSlots: true,
        };
        this.properties = Object.assign(Object.assign({}, Props), { theme: {
                type: String,
                value: 'default',
            }, tId: {
                type: String,
            } });
        this.data = {
            prefix,
            classPrefix: name,
            _disabled: false,
        };
        this.observers = {
            disabled(v) {
                this.setData({ _disabled: v });
            },
        };
        this.controlledProps = [
            {
                key: 'checked',
                event: 'change',
            },
        ];
        this.methods = {
            handleTap(e) {
                const { _disabled, readonly, contentDisabled } = this.data;
                const { target } = e.currentTarget.dataset;
                if (_disabled || readonly || (target === 'text' && contentDisabled))
                    return;
                const { value, label } = this.data;
                const checked = !this.data.checked;
                const parent = this.$parent;
                if (parent) {
                    parent.updateValue(Object.assign(Object.assign({}, this.data), { checked, item: { label, value, checked } }));
                }
                else {
                    this._trigger('change', { context: { value, label }, checked });
                }
            },
            setDisabled(disabled) {
                this.setData({
                    _disabled: this.data.disabled || disabled,
                });
            },
        };
    }
};
CheckBox = __decorate([
    wxComponent()
], CheckBox);
export default CheckBox;
