var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import props from './props';
import { calcIcon } from '../common/utils';
const { prefix } = config;
const name = `${prefix}-cell`;
let Cell = class Cell extends SuperComponent {
    constructor() {
        super(...arguments);
        this.externalClasses = [
            `${prefix}-class`,
            `${prefix}-class-title`,
            `${prefix}-class-description`,
            `${prefix}-class-note`,
            `${prefix}-class-hover`,
            `${prefix}-class-image`,
            `${prefix}-class-left`,
            `${prefix}-class-left-icon`,
            `${prefix}-class-center`,
            `${prefix}-class-right`,
            `${prefix}-class-right-icon`,
        ];
        this.relations = {
            '../cell-group/cell-group': {
                type: 'parent',
            },
        };
        this.options = {
            multipleSlots: true,
        };
        this.properties = props;
        this.data = {
            prefix,
            classPrefix: name,
            isLastChild: false,
        };
        this.observers = {
            leftIcon(v) {
                this.setIcon('_leftIcon', v, '');
            },
            rightIcon(v) {
                this.setIcon('_rightIcon', v, '');
            },
            arrow(v) {
                this.setIcon('_arrow', v, 'chevron-right');
            },
        };
    }
    setIcon(name, value, defaultValue) {
        this.setData({
            [name]: calcIcon(value, defaultValue),
        });
    }
    onClick(e) {
        this.triggerEvent('click', e.detail);
        this.jumpLink();
    }
    jumpLink(urlKey = 'url', link = 'jumpType') {
        const url = this.data[urlKey];
        const jumpType = this.data[link];
        if (url) {
            wx[jumpType]({ url });
        }
    }
};
Cell = __decorate([
    wxComponent()
], Cell);
export default Cell;
