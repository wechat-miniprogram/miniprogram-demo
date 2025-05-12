var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import config from '../common/config';
import { SuperComponent, wxComponent } from '../common/src/index';
import props from './props';
const { prefix } = config;
const name = `${prefix}-radio-group`;
let RadioGroup = class RadioGroup extends SuperComponent {
    constructor() {
        super(...arguments);
        this.externalClasses = [`${prefix}-class`];
        this.data = {
            prefix,
            classPrefix: name,
            radioOptions: [],
        };
        this.relations = {
            '../radio/radio': {
                type: 'descendant',
                linked(target) {
                    const { value, disabled } = this.data;
                    target.setData({
                        checked: value === target.data.value,
                    });
                    target.setDisabled(disabled);
                },
            },
        };
        this.properties = props;
        this.controlledProps = [
            {
                key: 'value',
                event: 'change',
            },
        ];
        this.observers = {
            value(v) {
                this.getChildren().forEach((item) => {
                    item.setData({
                        checked: v === item.data.value,
                    });
                });
            },
            options() {
                this.initWithOptions();
            },
            disabled(v) {
                var _a;
                if ((_a = this.data.options) === null || _a === void 0 ? void 0 : _a.length) {
                    this.initWithOptions();
                    return;
                }
                this.getChildren().forEach((item) => {
                    item.setDisabled(v);
                });
            },
        };
        this.methods = {
            getChildren() {
                let items = this.$children;
                if (!(items === null || items === void 0 ? void 0 : items.length)) {
                    items = this.selectAllComponents(`.${prefix}-radio-option`);
                }
                return items;
            },
            updateValue(value) {
                this._trigger('change', { value });
            },
            handleRadioChange(e) {
                const { checked } = e.detail;
                const { value, index, allowUncheck } = e.target.dataset;
                this._trigger('change', checked === false && allowUncheck ? { value: null, index } : { value, index });
            },
            initWithOptions() {
                const { options, value, keys, disabled } = this.data;
                if (!(options === null || options === void 0 ? void 0 : options.length) || !Array.isArray(options)) {
                    this.setData({
                        radioOptions: [],
                    });
                    return;
                }
                const optionsValue = [];
                try {
                    options.forEach((element) => {
                        var _a, _b, _c;
                        const typeName = typeof element;
                        if (typeName === 'number' || typeName === 'string') {
                            optionsValue.push({
                                label: `${element}`,
                                value: element,
                                checked: value === element,
                                disabled,
                            });
                        }
                        else if (typeName === 'object') {
                            optionsValue.push(Object.assign(Object.assign({}, element), { label: element[(_a = keys === null || keys === void 0 ? void 0 : keys.label) !== null && _a !== void 0 ? _a : 'label'], value: element[(_b = keys === null || keys === void 0 ? void 0 : keys.value) !== null && _b !== void 0 ? _b : 'value'], checked: value === element[(_c = keys === null || keys === void 0 ? void 0 : keys.value) !== null && _c !== void 0 ? _c : 'value'], disabled: element.disabled || disabled }));
                        }
                    });
                    this.setData({
                        radioOptions: optionsValue,
                    });
                }
                catch (error) {
                    console.error('error', error);
                }
            },
        };
    }
};
RadioGroup = __decorate([
    wxComponent()
], RadioGroup);
export default RadioGroup;
