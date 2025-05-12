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
const name = `${prefix}-collapse`;
let Collapse = class Collapse extends SuperComponent {
    constructor() {
        super(...arguments);
        this.externalClasses = [`${prefix}-class`];
        this.relations = {
            '../collapse-panel/collapse-panel': {
                type: 'descendant',
            },
        };
        this.controlledProps = [
            {
                key: 'value',
                event: 'change',
            },
        ];
        this.properties = props;
        this.data = {
            prefix,
            classPrefix: name,
        };
        this.observers = {
            'value, expandMutex '() {
                this.updateExpanded();
            },
        };
        this.methods = {
            updateExpanded() {
                this.$children.forEach((child) => {
                    child.updateExpanded(this.properties.value);
                });
            },
            switch(panelValue) {
                const { expandMutex, value: activeValues } = this.properties;
                let value = [];
                const hit = activeValues.indexOf(panelValue);
                if (hit > -1) {
                    value = activeValues.filter((item) => item !== panelValue);
                }
                else {
                    value = expandMutex ? [panelValue] : activeValues.concat(panelValue);
                }
                this._trigger('change', { value });
            },
        };
    }
};
Collapse = __decorate([
    wxComponent()
], Collapse);
export default Collapse;
