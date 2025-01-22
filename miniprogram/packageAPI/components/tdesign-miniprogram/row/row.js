var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import props from './props';
const { prefix } = config;
let Row = class Row extends SuperComponent {
    constructor() {
        super(...arguments);
        this.externalClasses = [];
        this.properties = props;
        this.data = {
            prefix,
        };
        this.relations = {
            '../col/col': {
                type: 'child',
                linked(target) {
                    const { gutter } = this.data;
                    if (gutter) {
                        target.setData({ gutter });
                    }
                },
            },
        };
        this.observers = {
            gutter() {
                this.setGutter();
            },
        };
        this.methods = {
            setGutter() {
                const { gutter } = this.data;
                const cols = this.$children;
                cols.forEach((col) => {
                    col.setData({ gutter });
                });
            },
        };
    }
};
Row = __decorate([
    wxComponent()
], Row);
export default Row;
