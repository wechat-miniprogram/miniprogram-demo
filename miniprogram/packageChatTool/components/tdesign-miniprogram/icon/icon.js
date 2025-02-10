var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import props from './props';
import { styles, addUnit, getRect } from '../common/utils';
const { prefix } = config;
const name = `${prefix}-icon`;
let Icon = class Icon extends SuperComponent {
    constructor() {
        super(...arguments);
        this.externalClasses = [`${prefix}-class`];
        this.properties = props;
        this.data = {
            componentPrefix: prefix,
            classPrefix: name,
            isImage: false,
            iconStyle: undefined,
        };
        this.observers = {
            'name, color, size, style'() {
                this.setIconStyle();
            },
        };
        this.methods = {
            onTap(event) {
                this.triggerEvent('click', event.detail);
            },
            setIconStyle() {
                const { name, color, size, classPrefix } = this.data;
                const isImage = name.indexOf('/') !== -1;
                const sizeValue = addUnit(size);
                const colorStyle = color ? { color: color } : {};
                const fontStyle = size ? { 'font-size': sizeValue } : {};
                const iconStyle = Object.assign(Object.assign({}, colorStyle), fontStyle);
                this.setData({ isImage }, () => __awaiter(this, void 0, void 0, function* () {
                    if (isImage) {
                        let iconSize = sizeValue;
                        if (!iconSize) {
                            yield getRect(this, `.${classPrefix}`)
                                .then((res) => {
                                iconSize = addUnit(res === null || res === void 0 ? void 0 : res.height);
                            })
                                .catch(() => { });
                        }
                        iconStyle.width = iconSize;
                        iconStyle.height = iconSize;
                    }
                    this.setData({ iconStyle: `${styles(iconStyle)}` });
                }));
            },
        };
    }
};
Icon = __decorate([
    wxComponent()
], Icon);
export default Icon;
